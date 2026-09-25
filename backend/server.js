/**
 * ==============================================================================
 * ACSUST BACKEND — Express API Server for Admin Panel
 * ==============================================================================
 * Deploy this on Render.com as a Web Service
 * All admin operations are authenticated via Supabase Auth JWT
 * ==============================================================================
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Supabase Clients ───
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Service role client — bypasses RLS, used for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
// Anon client — respects RLS, used to verify auth tokens
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// ─── Middleware ───
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5500')
  .split(',').map(s => s.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o) || o === '*')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Multer for file uploads (memory storage → then upload to Supabase Storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// ─── Auth Middleware ───
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error } = await supabaseAnon.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// ─── Helper: Standard Response ───
function sendResult(res, data, error) {
  if (error) {
    console.error('Supabase error:', error);
    return res.status(400).json({ success: false, error: error.message || error });
  }
  return res.json({ success: true, data });
}

// ==============================================================================
// AUTH ENDPOINTS
// ==============================================================================

// POST /api/auth/login — Login with email/password
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required' });
  }

  const { data, error } = await supabaseAnon.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(401).json({ success: false, error: error.message });
  }

  res.json({
    success: true,
    data: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: { id: data.user.id, email: data.user.email }
    }
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', requireAuth, async (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/auth/me — Verify current session
app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({ success: true, data: { id: req.user.id, email: req.user.email } });
});

// ==============================================================================
// SITE SETTINGS ENDPOINTS
// ==============================================================================

// GET /api/settings — Get all settings
app.get('/api/settings', async (req, res) => {
  const { data, error } = await supabaseAdmin.from('admin_settings').select('*');
  sendResult(res, data, error);
});

// PUT /api/settings/:key — Update a setting
app.put('/api/settings/:key', requireAuth, async (req, res) => {
  const { value } = req.body;
  const { data, error } = await supabaseAdmin
    .from('admin_settings')
    .upsert({ key: req.params.key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select();
  sendResult(res, data, error);
});

// ==============================================================================
// FILE UPLOAD ENDPOINT
// ==============================================================================

// POST /api/upload — Upload image to Supabase Storage
app.post('/api/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file provided' });
  }

  const folder = req.body.folder || 'misc'; // 'logo', 'members', 'events'
  const ext = req.file.originalname.split('.').pop() || 'jpg';
  
  // If id is provided for member, save as members/{id}.{ext} to overwrite previous photo
  let filename;
  if (req.body.id && folder === 'members') {
    filename = `${folder}/${req.body.id}.${ext}`;
  } else {
    filename = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
  }

  const { data, error } = await supabaseAdmin.storage
    .from('assets')
    .upload(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: true
    });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  // Also overwrite local file if pictures directory exists
  const localPicDir = path.resolve(__dirname, '../pictures');
  if (req.body.id && folder === 'members' && fs.existsSync(localPicDir)) {
    try {
      fs.writeFileSync(path.join(localPicDir, `${req.body.id}.${ext}`), req.file.buffer);
    } catch (e) {
      console.warn('Local file write error:', e);
    }
  }

  // Get public URL with cache-buster timestamp
  const { data: urlData } = supabaseAdmin.storage.from('assets').getPublicUrl(filename);
  const publicUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  res.json({
    success: true,
    data: {
      path: filename,
      url: publicUrl
    }
  });
});

// ==============================================================================
// FRONT PAGE CONTENT ENDPOINTS
// ==============================================================================

// GET /api/content — Get all front page content
app.get('/api/content', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('front_page_content')
    .select('*')
    .order('key');
  sendResult(res, data, error);
});

// PUT /api/content/:key — Update a content item
app.put('/api/content/:key', requireAuth, async (req, res) => {
  const { content } = req.body;
  const { data, error } = await supabaseAdmin
    .from('front_page_content')
    .update({ content })
    .eq('key', req.params.key)
    .select();
  sendResult(res, data, error);
});

// ==============================================================================
// CULTURE CARDS ENDPOINTS
// ==============================================================================

app.get('/api/culture-cards', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('culture_cards')
    .select('*')
    .order('display_order');
  sendResult(res, data, error);
});

app.put('/api/culture-cards/:id', requireAuth, async (req, res) => {
  const { icon, title, description, display_order } = req.body;
  const { data, error } = await supabaseAdmin
    .from('culture_cards')
    .update({ icon, title, description, display_order })
    .eq('id', req.params.id)
    .select();
  sendResult(res, data, error);
});

app.post('/api/culture-cards', requireAuth, async (req, res) => {
  const { icon, title, description, display_order } = req.body;
  const { data, error } = await supabaseAdmin
    .from('culture_cards')
    .insert({ icon, title, description, display_order: display_order || 0 })
    .select();
  sendResult(res, data, error);
});

app.delete('/api/culture-cards/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('culture_cards')
    .delete()
    .eq('id', req.params.id);
  sendResult(res, data, error);
});

// ==============================================================================
// PURPOSE CARDS ENDPOINTS
// ==============================================================================

app.get('/api/purpose-cards', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('purpose_cards')
    .select('*')
    .order('display_order');
  sendResult(res, data, error);
});

app.put('/api/purpose-cards/:id', requireAuth, async (req, res) => {
  const { step_num, title, description, display_order } = req.body;
  const { data, error } = await supabaseAdmin
    .from('purpose_cards')
    .update({ step_num, title, description, display_order })
    .eq('id', req.params.id)
    .select();
  sendResult(res, data, error);
});

app.post('/api/purpose-cards', requireAuth, async (req, res) => {
  const { step_num, title, description, display_order } = req.body;
  const { data, error } = await supabaseAdmin
    .from('purpose_cards')
    .insert({ step_num, title, description, display_order: display_order || 0 })
    .select();
  sendResult(res, data, error);
});

app.delete('/api/purpose-cards/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('purpose_cards')
    .delete()
    .eq('id', req.params.id);
  sendResult(res, data, error);
});

// ==============================================================================
// MEMBERS (PEOPLE) ENDPOINTS
// ==============================================================================

// GET /api/members — List all people (optionally filter by category)
app.get('/api/members', async (req, res) => {
  let query = supabaseAdmin.from('people').select('*').order('display_order');
  if (req.query.category) {
    query = query.eq('category', req.query.category);
  }
  const { data, error } = await query;
  sendResult(res, data, error);
});

// GET /api/members/:id — Get single member
app.get('/api/members/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('people')
    .select('*')
    .eq('id', req.params.id)
    .single();
  sendResult(res, data, error);
});

// POST /api/members — Add new member
app.post('/api/members', requireAuth, async (req, res) => {
  const { category, name, dept, area, position, session, photo_url, display_order, facebook_url, instagram_url, email, bio, phone } = req.body;
  const payload = {
    category, name, dept,
    area: area || '', position: position || '', session: session || '',
    photo_url: photo_url || '', display_order: display_order || 0,
    facebook_url: facebook_url || '', instagram_url: instagram_url || '',
    email: email || '', bio: bio || ''
  };
  if (phone !== undefined) payload.phone = phone || '';

  let { data, error } = await supabaseAdmin.from('people').insert(payload).select();
  if (error && error.message && error.message.includes("'phone'")) {
    delete payload.phone;
    const retry = await supabaseAdmin.from('people').insert(payload).select();
    data = retry.data;
    error = retry.error;
  }
  sendResult(res, data, error);
});

// PUT /api/members/:id — Update member
app.put('/api/members/:id', requireAuth, async (req, res) => {
  const updates = {};
  const fields = ['category', 'name', 'dept', 'area', 'position', 'session', 'photo_url', 'display_order', 'facebook_url', 'instagram_url', 'email', 'bio', 'phone'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  let { data, error } = await supabaseAdmin
    .from('people')
    .update(updates)
    .eq('id', req.params.id)
    .select();
    
  if (error && error.message && error.message.includes("'phone'")) {
    delete updates.phone;
    const retry = await supabaseAdmin
      .from('people')
      .update(updates)
      .eq('id', req.params.id)
      .select();
    data = retry.data;
    error = retry.error;
  }
  sendResult(res, data, error);
});

// DELETE /api/members/:id — Delete member
app.delete('/api/members/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('people')
    .delete()
    .eq('id', req.params.id);
  sendResult(res, data, error);
});

// ==============================================================================
// EVENTS ENDPOINTS
// ==============================================================================

// GET /api/events — List all events
app.get('/api/events', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('display_order');
  sendResult(res, data, error);
});

// GET /api/events/:id — Get single event
app.get('/api/events/:id', async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', req.params.id)
    .single();
  sendResult(res, data, error);
});

// POST /api/events — Add new event
app.post('/api/events', requireAuth, async (req, res) => {
  const { title, date_text, location, description, thumb, emoji, photos, captions, display_order, category } = req.body;
  const insertPayload = {
    title, date_text, location, description,
    thumb: thumb || '', emoji: emoji || '🎭',
    photos: photos || [], captions: captions || [],
    display_order: display_order || 0,
    category: category || 'Normal'
  };

  let { data, error } = await supabaseAdmin
    .from('events')
    .insert(insertPayload)
    .select();

  if (error && error.message && error.message.includes("'category'")) {
    delete insertPayload.category;
    const retry = await supabaseAdmin
      .from('events')
      .insert(insertPayload)
      .select();
    data = retry.data;
    error = retry.error;
  }
  sendResult(res, data, error);
});

// PUT /api/events/:id — Update event
app.put('/api/events/:id', requireAuth, async (req, res) => {
  const updates = {};
  const fields = ['title', 'date_text', 'location', 'description', 'thumb', 'emoji', 'photos', 'captions', 'display_order', 'category'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  let { data, error } = await supabaseAdmin
    .from('events')
    .update(updates)
    .eq('id', req.params.id)
    .select();

  if (error && error.message && error.message.includes("'category'")) {
    delete updates.category;
    const retry = await supabaseAdmin
      .from('events')
      .update(updates)
      .eq('id', req.params.id)
      .select();
    data = retry.data;
    error = retry.error;
  }
  sendResult(res, data, error);
});

// DELETE /api/events/:id — Delete event
app.delete('/api/events/:id', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', req.params.id);
  sendResult(res, data, error);
});

// ==============================================================================
// HEALTH CHECK & ROOT
// ==============================================================================
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Association of Chandpur SUST - Backend API is running successfully',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      members: '/api/members',
      events: '/api/events',
      settings: '/api/settings',
      content: '/api/front-page-content'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==============================================================================
// START SERVER
// ==============================================================================
app.listen(PORT, () => {
  console.log(`🚀 ACSUST Backend running on port ${PORT}`);
  console.log(`📡 Supabase URL: ${supabaseUrl}`);
  console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
});
