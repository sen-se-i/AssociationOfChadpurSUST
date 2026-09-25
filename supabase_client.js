/**
 * ==============================================================================
 * ASSOCIATION OF CHANDPUR SUST - SUPABASE CLIENT CONFIG & DATA LAYER
 * ==============================================================================
 * Paste your Supabase Project URL and Anon Public Key below:
 */
const SUPABASE_CONFIG = {
  url: 'https://ogbcqpadilsjmvvwgoxf.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYmNxcGFkaWxzam12dndnb3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NjMzODksImV4cCI6MjEwNTAzOTM4OX0.AP-QbFg2ejoYVCyDCqsrdEj7z3LQqtTJpP4IDdvL92Q'
};

// Check if user stored keys in localStorage for easy browser-based testing
if (localStorage.getItem('ACS_SUPABASE_URL')) {
  SUPABASE_CONFIG.url = localStorage.getItem('ACS_SUPABASE_URL');
}
if (localStorage.getItem('ACS_SUPABASE_ANON_KEY')) {
  SUPABASE_CONFIG.anonKey = localStorage.getItem('ACS_SUPABASE_ANON_KEY');
}

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && !SUPABASE_CONFIG.url.includes('xyzcompany')) {
  try {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('⚡ Connected to Supabase live database!');
  } catch (err) {
    console.warn('Supabase initialization failed, using local fallback:', err);
  }
}

/* ──────────────────────────────────────────────────────────────────────────────
   FALLBACK DATA (Ensures zero-downtime & identical rendering if offline)
   ────────────────────────────────────────────────────────────────────────────── */
const DEFAULT_FRONT_PAGE = {
  hero_badge: 'Shahjalal University of Science & Technology',
  hero_title: '<em>Association of</em><br>Chandpur',
  hero_subtitle: 'Unity · Culture · Heritage · SUST',
  hero_desc: 'Bringing together the students of Chandpur — the land of great rivers, silver Hilsha, and timeless culture — under one roof at SUST, Sylhet.',
  about_label: 'About the Association',
  about_title: 'Rooted in <em>Chandpur</em>,<br>Thriving at SUST',
  about_p1: "The Association of Chandpur at Shahjalal University of Science and Technology (SUST), Sylhet, is a vibrant community of students hailing from the culturally rich district of Chandpur, Bangladesh. Founded to foster solidarity and belonging, we welcome every Chandpur student who walks through SUST's gates.",
  about_p2: "Far from home, we become each other's family — sharing stories of the Padma , Meghna and Dakatia rivers, the taste of fresh Hilsha, and the warmth of Chandpur's festivals. We bridge homesickness with brotherhood, turning a university corridor into a piece of Chandpur.",
  about_p3: "Beyond bonding, we represent Chandpur's voice across SUST's diverse association landscape — collaborating, contributing, and celebrating our heritage with pride.",
  stat_members_num: '100<span>+</span>',
  stat_members_label: 'Active Members',
  stat_depts_num: '28',
  stat_depts_label: 'Departments',
  stat_events_num: '8<span>+</span>',
  stat_events_label: 'Annual Events',
  culture_label: 'The Land We Come From',
  culture_title: 'The <em>Rich Legacy</em> of Chandpur',
  culture_desc: 'Chandpur is no ordinary district. Nestled at the confluence of the mighty Meghna, Dakatia and Padma rivers, it is a land of extraordinary natural beauty, deep cultural heritage, and the crown jewel of Bangladesh\'s fisheries — the Ilish (Hilsha).',
  purpose_label: 'Our Mission',
  purpose_title: 'Why We <em>Exist</em>',
  purpose_desc: 'Every Chandpur student at SUST deserves a home away from home. We exist to build that home — strong, warm, and unbreakable.',
  footer_desc: 'Association of Chandpur at SUST — uniting the voices of a river district within the halls of Shahjalal University of Science and Technology, Sylhet.',
  footer_copyright: '© 2025 Association of Chandpur · <span class="sust-tag">SUST, Sylhet</span>',
  footer_credit: 'made by · <span class="sust-tag">Fahim Ahammad Tanvir</span>',
  footer_motto: 'Land of Rivers · Land of Hilsha · Our Home',
  contact_email: 'association.of.chandpur.sust@gmail.com',
  facebook_page_url: 'https://www.facebook.com/AssociationOfChandpurSUST'
};

const DEFAULT_CULTURE_CARDS = [
  { icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>', title:'Land of Ilish', description:"Chandpur is the Ilish (Hilsha) capital of Bangladesh. The Meghna river yields the finest Hilsha in the world — a fish so celebrated it's woven into Bengali identity and culture." },
  { icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M2 6h20M2 18h20"></path></svg>', title:'Great Rivers', description:"Bounded by Meghna, Dakatia, and Padma rivers, Chandpur's landscape is shaped by water — a flowing, breathing geography that gives life, trade, and poetry to the district." },
  { icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>', title:'Vibrant Culture', description:"From riverine folklore to timeless arts, Chandpur's culture is a tapestry of traditions — jari gaan, shari gaan, and festivals that echo centuries of Bengali heritage." },
  { icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>', title:'Historical Richness', description:"Home to ancient landmarks and river ports, Chandpur carries deep historical weight — from the liberation war to rich intellectual and architectural traditions." }
];

const DEFAULT_PURPOSE_CARDS = [
  { step_num:'01', title:'Connect & Build Community', description:'We connect Chandpur students across all departments and batches, creating a tight-knit network that transcends academic boundaries.' },
  { step_num:'02', title:'Assert Our Cultural Identity', description:"We celebrate Chandpur's unique culture — from heritage reunions to river festivals — ensuring our identity shines within SUST's multicultural campus." },
  { step_num:'03', title:'Support & Mentor', description:'Senior members guide freshmen through academic and social challenges. Every newcomer from Chandpur gets a mentor, a friend, and a direction.' },
  { step_num:'04', title:'Represent at SUST', description:"We engage with other district associations and student unions — making Chandpur's presence felt, respected, and valued across the university." }
];

const DEFAULT_EXECUTIVE_MEMBERS = [
  {name:'Zakaria Talukdar Omio', dept:'Public Administration', area:'Haziganj', position:'President', session:'21-22'},
  {name:'Ali Ashraf Tanvir', dept:'Computer Science & Engineering', area:'Matlab Uttar', position:'General Secretary', session:'21-22'},
  {name:'Abdul Mannan Nirjon', dept:'Public Administration', area:'Haimchar', position:'Senior Vice President', session:'21-22'},
  {name:'Mahin Ibrahim', dept:'Chemistry', area:'Kachua', position:'Vice President', session:'21-22'},
  {name:'Fakhrul Islam', dept:'Industrial & Production Engineering', area:'Haimchar', position:'Vice President', session:'21-22'},
  {name:'Shahid Hasan Joy', dept:'Industrial & Production Engineering', area:'Haimchar', position:'Vice President', session:'21-22'},
  {name:'Tahsin Ornob', dept:'Physics', area:'Haziganj', position:'Organizing Secretary', session:'22-23'},
  {name:'Sadman Zaman Litun', dept:'Statistics', area:'Matlab Uttar', position:'Joint Secretary', session:'22-23'},
  {name:'Nayeem Ahmed', dept:'Mechanical Engineering', area:'Matlab Uttar', position:'IT Secretary', session:'22-23'},
  {name:'Farhan Ahmed Kafil', dept:'Chemical Engineering & Polymer Science', area:'Chandpur Sadar', position:'Treasurer', session:'22-23'},
  {name:'Rumman Ahmed', dept:'Chemistry', area:'Chandpur Sadar', position:'Deputy Treasurer', session:'22-23'},
  {name:'Meher Afroz', dept:'Mechanical Engineering', area:'Shahrasti', position:'Office Secretary', session:'22-23'},
  {name:'Tanvir Ahmad Emon', dept:'Statistics', area:'Haziganj', position:'Sports Secretary', session:'22-23'},
  {name:'Shafin Ahmed', dept:'Public Administration', area:'Matlab Uttar', position:'Deputy Sports Secretary', session:'22-23'},
  {name:'Jannatul Nayeema', dept:'English', area:'Chandpur Sadar', position:'Cultural Secretary', session:'22-23'},
  {name:'Jayma Afrin', dept:'Business Administration', area:'Shahrasti', position:'Human Rights Secretary', session:'22-23'},
  {name:'Mahbub Mahi', dept:'Chemical Engineering & Polymer Science', area:'Chandpur Sadar', position:'Media Secretary', session:'22-23'},
  {name:'Antik Chakraborty', dept:'Economics', area:'Chandpur Sadar', position:'Publication Secretary', session:'22-23'},
  {name:'Shafayat Rahman Navin', dept:'Anthropology', area:'Matlab Dakshin', position:'Assistant General Secretary', session:'22-23'},
  {name:'Bayezid Hossain', dept:'English', area:'Haziganj', position:'Assistant General Secretary', session:'22-23'},
  {name:'Tarek Hossain', dept:'Biochemistry & Molecular Biology', area:'Faridganj', position:'Assistant IT Secretary', session:'23-24'},
  {name:'Arzu Sultana Anon', dept:'Computer Science & Engineering', area:'Kachua', position:'Assistant IT Secretary', session:'23-24'},
  {name:'Wasimul Islam Rabbi', dept:'Statistics', area:'Haimchar', position:'Assistant Organizing Secretary', session:'23-24'},
  {name:'Junaeid Hossain', dept:'Computer Science & Engineering', area:'Faridganj', position:'Assistant Organizing Secretary', session:'23-24'},
  {name:'Mezbah Mahi', dept:'Statistics', area:'Haziganj', position:'Assistant Organizing Secretary', session:'23-24'},
  {name:'Emon Hossain', dept:'Statistics', area:'Matlab Uttar', position:'Assistant Treasurer', session:'23-24'},
  {name:'Rakib Mamun', dept:'Mechanical Engineering', area:'Faridganj', position:'Assistant Treasurer', session:'23-24'},
  {name:'Fajlay Raiyan', dept:'Mechanical Engineering', area:'Matlab Uttar', position:'Assistant Office Secretary', session:'23-24'},
  {name:'Ismail Hossain Tonmoy', dept:'Geography and Environment', area:'Faridganj', position:'Assistant Office Secretary', session:'23-24'},
  {name:'Fabiha Bushra Dilshad', dept:'Genetic Engineering & Biotechnology', area:'Matlab Uttar', position:'Assistant Publication Secretary', session:'23-24'},
  {name:'Md Fahim Ahammad Tanvir', dept:'Software Engineering', area:'Haimchar', position:'Assistant Publication Secretary', session:'23-24'},
  {name:'Maryam Chowdhury', dept:'Economics', area:'Kachua', position:'Assistant Human Rights Secretary', session:'23-24'},
  {name:'Shahinur Akter Mitu', dept:'Economics', area:'Kachua', position:'Assistant Cultural Secretary', session:'23-24'},
  {name:'Takaful Islam Karima', dept:'Civil & Environmental Engineering', area:'Chandpur Sadar', position:'Assistant Cultural Secretary', session:'23-24'},
  {name:'Samira Shaiba Athoi', dept:'Geography and Environment', area:'Shahrasti', position:'Assistant Cultural Secretary', session:'23-24'},
  {name:'Mohammad Noman', dept:'Mechanical Engineering', area:'Faridganj', position:'Assistant Media Secretary', session:'23-24'},
  {name:'Fardin Islam Rijvy', dept:'Software Engineering', area:'Haziganj', position:'Assistant Sports Secretary', session:'23-24'},
  {name:'Nahid Hossain', dept:'Genetic Engineering & Biotechnology', area:'Faridganj', position:'Assistant Sports Secretary', session:'23-24'},
  {name:'Asm Raihanul Hasan', dept:'Genetic Engineering & Biotechnology', area:'Shahrasti', position:'Assistant Sports Secretary', session:'23-24'}
];

const DEFAULT_GENERAL_MEMBERS = [
  {name:'Mehedi Hasan Tareq', dept:'Software Engineering', area:'Haimchar', session:'21-22'},
  {name:'Priya Rani', dept:'Computer Science & Engineering', area:'Haimchar', session:'22-23'},
  {name:'Sami', dept:'Software Engineering', area:'Chandpur Sadar', session:'22-23'},
  {name:'Tasnova Tamacchin Nihat', dept:'Software Engineering', area:'Chandpur Sadar', session:'22-23'},
  {name:'Al-Amin Mollik', dept:'Mechanical Engineering', area:'Faridganj', session:'22-23'},
  {name:'Mahbubur Rahman Mahi', dept:'Chemical Engineering & Polymer Science', area:'Chandpur Sadar', session:'22-23'},
  {name:'Sayad Ahmed', dept:'Food Engineering & Tea Technology', area:'Chandpur Sadar', session:'22-23'},
  {name:'Mohammad Atikur Rahman Ratul', dept:'Electrical & Electronic Engineering', area:'Chandpur Sadar', session:'23-24'},
  {name:'Saliha Rahman', dept:'Sociology', area:'Faridganj', session:'23-24'},
  {name:'Muslim Talukder Rifat', dept:'Statistics', area:'Chandpur Sadar', session:'24-25'},
  {name:'Ariyan Rahman Shanil', dept:'Statistics', area:'Haimchar', session:'24-25'},
  {name:'Mohammad Mostafizur Rahman', dept:'Statistics', area:'Matlab Uttar', session:'24-25'},
  {name:'Md Sajid Hossean', dept:'Statistics', area:'Faridganj', session:'24-25'},
  {name:'Musfiq Ahmad', dept:'Statistics', area:'Faridganj', session:'24-25'},
  {name:'Manjur Hasan Fahim', dept:'Software Engineering', area:'Chandpur Sadar', session:'24-25'},
  {name:'Imtiyaz Ahmed Emon', dept:'Software Engineering', area:'Kachua', session:'24-25'},
  {name:'Zakaria Morshed', dept:'Software Engineering', area:'Chandpur Sadar', session:'24-25'},
  {name:'Muhammad Iftekharul Islam', dept:'Physics', area:'Chandpur Sadar', session:'24-25'},
  {name:'Sabit Ahnaf', dept:'Physics', area:'Kachua', session:'24-25'},
  {name:'Nowshin Mahmud Chamak', dept:'Physics', area:'Matlab Uttar', session:'24-25'},
  {name:'Tanzim Ahmed Mahim', dept:'Chemistry', area:'Matlab Uttar', session:'24-25'},
  {name:'Iqbal Sami', dept:'Chemistry', area:'Haziganj', session:'24-25'},
  {name:'Farhan Sadeque', dept:'Forestry & Environmental Science', area:'Kachua', session:'24-25'},
  {name:'Rakibul Hasan Moin', dept:'Forestry & Environmental Science', area:'Kachua', session:'24-25'},
  {name:'Tanvir Hassan', dept:'Business Administration', area:'Kachua', session:'24-25'},
  {name:'Md Nabil Khan', dept:'Business Administration', area:'Chandpur Sadar', session:'24-25'},
  {name:'Md Farhan Muntasir Nehal', dept:'Electrical & Electronic Engineering', area:'Kachua', session:'24-25'},
  {name:'Md Hasebul Hasan Rippy', dept:'Civil & Environmental Engineering', area:'Haimchar', session:'24-25'},
  {name:'Swastika Naha Arpa', dept:'Chemical Engineering & Polymer Science', area:'Chandpur Sadar', session:'24-25'},
  {name:'Arifa Binta Alam', dept:'Food Engineering & Tea Technology', area:'Haziganj', session:'24-25'},
  {name:'Noor Hossain Alif', dept:'Geography and Environment', area:'Faridganj', session:'24-25'},
  {name:'Md Moshiur Rahman Sami', dept:'Oceanography', area:'Chandpur Sadar', session:'24-25'},
  {name:'Mishkat Jahan Mithila', dept:'Public Administration', area:'Chandpur Sadar', session:'24-25'},
  {name:'Md Sabbir Ahmed Osmani', dept:'Political Studies', area:'Kachua', session:'24-25'},
  {name:'Sabrina Sarmin Tanisha', dept:'Social Work', area:'Chandpur Sadar', session:'24-25'},
  {name:'Saiem Qibria', dept:'Industrial & Production Engineering', area:'Matlab Uttar', session:'24-25'},
  {name:'Bushra Ahmed', dept:'Sociology', area:'Chandpur Sadar', session:'25-26'},
  {name:'Ishrat Jahan Esha', dept:'Civil & Environmental Engineering', area:'Hajiganj', session:'25-26'},
  {name:'Tahiyat Nuren Ohi', dept:'Statistics', area:'Chandpur Sadar', session:'25-26'},
  {name:'Fouzia Farook', dept:'Mechanical Engineering', area:'Chandpur Sadar', session:'25-26'},
  {name:'Rouzatun rumman', dept:'Petroleum & Mining Engineering', area:'Chandpur Sadar', session:'25-26'},
  {name:'Nusaiba Binte Zaman', dept:'Industrial & Production Engineering', area:'Shahrasti', session:'25-26'},
  {name:'Sushanto das', dept:'Bangla', area:'Shahrasti', session:'25-26'},
  {name:'Apurbo Raihan', dept:'Physics', area:'Shahrasti', session:'25-26'},
  {name:'Md Sajjadul Karim Sinha', dept:'Physics', area:'Matlab Uttar', session:'25-26'},
  {name:'Sadman Sakib Sami', dept:'English', area:'Matlab Uttar', session:'25-26'},
  {name:'MD Wasif Patwary', dept:'Software Engineering', area:'Chandpur Sadar', session:'25-26'},
  {name:'Abrar Zahin', dept:'Business Administration', area:'Matlab Uttar', session:'25-26'},
  {name:'Tasin Ibrahim', dept:'Business Administration', area:'Kachua', session:'25-26'},
  {name:'Abdullah Al Noman Bhuiyan', dept:'Sociology', area:'Chandpur Sadar', session:'25-26'},
  {name:'Tahsin Mostofa', dept:'Civil & Environmental Engineering', area:'Shahrasti', session:'25-26'},
  {name:'Pronoy Shil Om', dept:'Civil & Environmental Engineering', area:'Hajiganj', session:'25-26'},
  {name:'Simanta biswas', dept:'Chemistry', area:'Matlab Uttar', session:'25-26'},
  {name:'Joynal Abedin', dept:'Biochemistry and Molecular Biology', area:'Matlab Uttar', session:'25-26'},
  {name:'Mahmudul Alam Anik', dept:'Electrical & Electronic Engineering', area:'Hajiganj', session:'25-26'},
  {name:'Ashraful Alam Ishti', dept:'Computer Science & Engineering', area:'Chandpur Sadar', session:'25-26'},
  {name:'Nabil ahmad talukder', dept:'Statistics', area:'Matlab Uttar', session:'25-26'},
  {name:'Aurnob Saha', dept:'Statistics', area:'Chandpur Sadar', session:'25-26'},
  {name:'Ahmed Farhaz Khan', dept:'Statistics', area:'Chandpur Sadar', session:'25-26'},
  {name:'Md. Fahmi Alam', dept:'Industrial & Production Engineering', area:'Shahrasti', session:'25-26'}
];

const DEFAULT_TEACHERS = [
  { name: 'Dr. SM Saiful Islam', dept: 'Chemistry', position: 'Professor', phone: '8801972448030' },
  { name: 'Dr. Md Zakir Hossain', dept: 'Statistics', position: 'Professor', phone: '8801711140801' },
  { name: 'Dr. Mirza Nazmul Hasan', dept: 'Statistics', position: 'Professor', phone: '8801767013458' },
  { name: 'Dr. Mohammad Jasim Uddin', dept: 'Sociology', position: 'Professor', phone: '8801715055869' },
  { name: 'Dr Mohammad Abdul Hannan Pradhan', dept: 'Economics', position: 'Professor', phone: '8801731247170' },
  { name: 'Dr. Masud Alam', dept: 'Economics', position: 'Professor', phone: '8801770340474' },
  { name: 'Dr. Nur Mohammad Majumder', dept: 'Anthropology', position: 'Professor', phone: '8801815107547' },
  { name: 'Dr. Nilufa Aktar', dept: 'Bangla', position: 'Professor', phone: '8801711013131' },
  { name: 'Dr Mohammad Rezaul Karim', dept: 'Chemistry', position: 'Professor', phone: '8801750200968' },
  { name: 'Syed Towfiq Mahmood Hasan', dept: 'Business Administration', position: 'Professor', phone: '8801715018035' },
  { name: 'Dr. Mohammad Abdullah-Al-Shoeb', dept: 'Biochemistry and Molecular Biology', position: 'Professor', phone: '8801787501398' },
  { name: 'Dr. Mohammad Shaiful Alam Amin', dept: 'Chemical Engineering & Polymer Science', position: 'Professor', phone: '8801717466578' },
  { name: 'Md. Syamul Bashar', dept: 'Mechanical Engineering', position: 'Assistant Professor', phone: '8801307486552' },
  { name: 'Shahla Safwat Ravhee', dept: 'Architecture', position: 'Assistant Professor', phone: '8801675868645' },
  { name: 'Mahabub Alam', dept: 'Food Engineering & Tea Technology', position: 'Assistant Professor', phone: '8801837572299' },
  { name: 'Md. Mahin Uddin', dept: 'Geography and Environment', position: 'Lecturer', phone: '8801580380279' }
];

const DEFAULT_STAFF = [
  { name: 'Mr. Helan Hossain Dewan', dept: 'Accounts', position: 'Assistant Director', phone: '' },
  { name: 'Mr. Md. Hasan Mahmud Khan', dept: 'IICT', position: 'Technician', phone: '' },
  { name: 'Mr. Md. Farkul Islam', dept: 'Registrar Office', position: 'Administrative Officer', phone: '' },
  { name: 'Mr. Md. Khoka Mia', dept: 'Chemistry', position: 'Senior Lab Assistant', phone: '' },
  { name: 'Mr. Md. Nazrul Islam', dept: 'Civil & Environmental Engineering', position: 'Instrument Engineer', phone: '' },
  { name: 'Mr. Md. Nasir Uddin Bepari', dept: 'Registrar Office', position: 'Senior Guest House Attendant', phone: '' },
  { name: 'Mr. Md. Babul Hossain', dept: 'Forestry & Environmental Science', position: 'Technician Officer', phone: '' },
  { name: 'Mr. Abu Yusuf', dept: 'Research Center', position: 'Officer', phone: '' },
  { name: 'Mr. Abdul Karim', dept: 'Mathematics', position: 'Office Attendant', phone: '' },
  { name: 'Mr. Md. Jakir Hossain', dept: 'Registrar Office', position: 'Office Assistant', phone: '' },
  { name: 'Ms. Rina Ferdousi', dept: 'Medical Center', position: 'Nurse', phone: '' },
  { name: 'Mr. Monir Hossain', dept: 'Transport', position: 'Senior Driver', phone: '' },
  { name: 'Mr. Alauddin Shah', dept: 'Telephone', position: 'Senior Operator', phone: '' },
  { name: 'Ms. Farhana Begum', dept: 'Female Hall', position: 'Assistant', phone: '' },
  { name: 'Mr. Md. Jitu Mia', dept: 'Anthropology', position: 'Administrative Officer', phone: '' },
  { name: 'Mr. Md. Taslim Dewan', dept: 'Registrar Office', position: 'Senior Guard', phone: '' },
  { name: 'Mr. Imam Hossain', dept: '2nd Female Hall', position: 'Senior Guard', phone: '' },
  { name: 'Mr. Abdur Rob', dept: 'Registrar Office', position: 'Security Assistant', phone: '' },
  { name: 'Mr. Anisur Rahman', dept: 'VC Bungalow', position: 'Senior Gardener', phone: '' },
  { name: 'Mr. Shahjahan Molla', dept: 'Industrial & Production Engineering', position: 'Office Attendant', phone: '' },
  { name: 'Mr. Md. Sohel Ahmed', dept: 'Industrial & Production Engineering', position: 'Office Attendant', phone: '' }
];

const DEFAULT_EVENTS = [
  {
    category: 'Outdoor Sports',
    title: 'Intra Association Football Tournament 2026',
    date: 'July 4, 2026',
    location: 'Mahmudabad Sports Center',
    thumb: 'football2026/1.jpg',
    emoji: '⚽',
    description: "From the first whistle to the final blow—every match was filled with excitement, emotion, battle, and memorable moments.Great goals, incredible saves, intense competition, and every moment on the field made this tournament truly special.<br> However, beyond victory and defeat, the greatest achievement of this season was friendship, unity, sportsmanship, and bringing everyone together on one stage.<br> 📸Thank you to all the players, organizers, volunteers, and spectators, whose cooperation and love made the AoC Football Tournament 2026 a grand success<br>.We will meet again with a bigger event, more intense competition, and many more memorable moments.Until then, let the love for football remain unbroken.",
    photos: ['football2026/1.jpg','football2026/2.jpg','football2026/3.jpg','football2026/4.jpg','football2026/5.jpg','football2026/6.jpg','football2026/7.jpg','football2026/8.jpg','football2026/9.jpg','football2026/10.jpg'],
    captions: []
  },
  {
    category: 'Social and dining Event',
    title: '✨ Sha-Pa Day 2026 ✨',
    date: 'May 05, 2026',
    location: 'London Inn',
    thumb: 'shapaday2026/1 (1).jpg',
    emoji: '🎭',
    description: "The much-awaited Sha-Pa Day 2026 of our association was successfully celebrated with the enthusiastic participation of students from different batches.<br>The event took place at London Inn Restaurant in Sylhet, creating a warm and memorable atmosphere for everyone present.<br>The program began with a vibrant photo session, followed by a delightful lunch and meaningful interaction among the members. Throughout the event, the spirit of unity, friendship, and shared belonging was beautifully reflected.<br>The day concluded with a renewed commitment to remain connected and work together to make the association even more dynamic, active, and strong in the days ahead.<br>",
    photos: ['shapaday2026/1 (1).jpg','shapaday2026/1 (2).jpg','shapaday2026/1 (3).jpg','shapaday2026/IMG-20260505-WA0098.jpg','shapaday2026/1 (5).jpg','shapaday2026/1 (6).jpg','shapaday2026/1 (7).jpg'],
    captions: ['8th Executive Committee','Batch 22','Batch 23','Batch 24','Batch 23 Boys','President Omio and GS Tanvir Bhai','A Moment of Togetherness']
  },
  {
    category: 'Conference & Ceremony',
    title: 'Biennial Conference and Scholarship Ceremony',
    date: 'March 6, 2026',
    location: 'Malancha Community Center , Kumarpara',
    thumb: '8.jpg',
    emoji: '',
    description: "On 6 March 2026, the Chandpur District Welfare Association, Sylhet, hosted its biennial conference and scholarship award ceremony, attended by Zakaria Talukdar Amio, President of the 8th Executive Committee of the Chandpur Association, Shahjalal University of Science and Technology (SUST), and Organizing Secretary Tahsin Arnav.<br>At the beginning of the event, a commemorative magazine was presented to the President and Organizing Secretary of the Chandpur Association by Mohammad Abu Yusuf, Executive Member of the Chandpur District Welfare Association and Assistant Administrative Officer of SUST. The program also included an Iftar gathering in celebration of the holy month of Ramadan. 🌙<br>After the conference, the President and Organizing Secretary of the Chandpur Association paid a courtesy visit to Professor Dr. S. M. Saiful Islam, Chief Advisor of the Chandpur Association, SUST and Chandpur District Welfare Association, Sylhet, during which they informed him about the association’s current and future activities. Dr. Islam assured full support for the association’s initiatives.<br>Courtesy meetings were also held with Gazi Mohammad Zahirul Islam, President, and Mohammad Mohsin Bhuiya, General Secretary of the Chandpur District Welfare Association, Sylhet. They were informed about the association’s future plans and assured their full support while inviting participation in upcoming events.<br>Additionally, a courtesy visit was made to Gazi Mohammad Zahirul Islam, esteemed advisor of the Chandpur District Student Association, Sylhet Agricultural University, who emphasized the importance of collaboration between the two organizations and invited the association for a meeting at Sylhet Agricultural University.<br>Other distinguished attendees included Engr. Mohammad Abdul Haque Miazi, Assistant Engineer, Sylhet City Corporation; Shah Mohammad Fazle Alam Patwari, Police Inspector, PBI, Sylhet; Mohammad Shahjahan, D.G.M., Jalalabad Gas T&D System Limited; and Engr. Abul Hasnat, Assistant Engineer, Jalalabad Ragib-Rabeya Medical College & Hospital, Sylhet.<br>✨ Through mutual cooperation and unity, it is hoped that the bonds among Chandpur students will grow even stronger.",
    photos: ['8.jpg','9.jpg','10.jpg','11.jpg','12.jpg'],
    captions: []
  },
  {
    category: 'Iftar Mahfil',
    title: 'Iftar Mahfil 2025 and General Meeing',
    date: 'February 28, 2026',
    location: 'D Builiding',
    thumb: '3.jpg',
    emoji: '',
    description: "Association of Chandpur’s Iftar Gathering and General Meeting Successfully Held<br>On February 28, 2026, the Iftar gathering and general meeting of the Association of Chandpur, SUST, were held with great enthusiasm. At the event, the 8th Executive Committee of the organization was officially announced, and important discussions were conducted regarding the future activities of the association.<br>The chief guest of the ceremony was Dr. Saiful Islam, Professor of the Department of Chemistry and Chief Advisor of the Association of Chandpur. The special guest was Mohammad Shaiful Alam Amin, Professor of the Department of Chemical Engineering and Polymer Science and an advisor. Also present was Md. Mahin Uddin, Lecturer of the Department of Geography and Environment and an advisor.<br>Among others present were Gazi Md. Jahirul Islam, President of the Chandpur District Welfare Association, and Md. Mohsin Bhuiyan, General Secretary. Current and former members of the organization, officers and staff, students from various departments, and invited guests spent a lively and cordial time together.<br>Heartfelt thanks are extended to everyone involved for the successful completion of this event. The Association of Chandpur will continue to organize such gatherings and general meetings in the future, further strengthening the bonds of friendship, brotherhood, and unity.",
    photos: ['3.jpg','7.jpeg','4.jpg','6.jpeg','1.jpg','2.jpg'],
    captions: []
  },
  {
    category: 'BBQ',
    title: 'BBQ Night and Freshers Orientation',
    date: 'November 28, 2025',
    location: 'SUST Basketball Ground',
    thumb: 'bbq2025/1.jpg',
    emoji: '',
    description: "On 28 November 2025, the Association of Chandpur, SUST, organized a grand Freshers’ Reception and BBQ event. Alongside warmly welcoming the new students from Chandpur of the 2024–25 session, the event turned into a vibrant festival of joy, harmony, and reunion.<br>Distinguished guests present at the event included Professor Dr. Saiful Islam, Professor of the Department of Chemistry and esteemed advisor of the Association of Chandpur; Professor Rezaul Karim, Professor of the Department of Chemistry and advisor; Professor Dr. Mirza Nazmul Hasan, Professor of the Department of Statistics and advisor; Professor Dr. Roksana Begum, Professor of the Department of Chemistry and advisor; and Md. Mahin Uddin, Lecturer of the Department of Geography and Environment and advisor.<br>In addition, the event was attended by current and former members of the association, students from various departments, officers and staff, and invited guests. With everyone’s active participation, the program became lively and truly memorable.<br>In the final segment of the event, a musical performance was presented by the newly admitted and current students, making the colorful cultural evening even more enjoyable.<br>Heartfelt thanks to everyone involved for making this event a success. The Association of Chandpur hopes to continue strengthening the bonds of friendship, unity, and cooperation through such gatherings in the future.<br>— Chandpur Association, SUST",
    photos: ['bbq2025/1.jpg','bbq2025/2.jpg','bbq2025/3.jpg','bbq2025/4.jpg','bbq2025/1.jpeg','bbq2025/2.jpeg','bbq2025/5.jpg'],
    captions: []
  },
  {
    category: 'Get Together',
    title: 'Get together',
    date: 'April 01, 2025',
    location: 'Chandpur Boro Station',
    thumb: 'getTogether/1.jpg',
    emoji: '',
    description: "On the second day of Eid, 2nd Shawwal 1446, it was quite a delightful and memorable day. The Chandpur Association had been determined to ceremony a get-together event during Eid, and finally, on this day, both current and former SUSTians from Chandpur came together and were bound by a beautiful bond of shared memories and togetherness.<br>",
    photos: ['getTogether/1.jpg','getTogether/2.jpg','getTogether/3.jpg','getTogether/4.jpg','getTogether/5.jpg'],
    captions: []
  },
  {
    category: 'Outdoor Sports',
    title: 'Intra-association football tournament',
    date: 'June 27, 2025',
    location: 'Green Valley Sports Center',
    thumb: 'football/3.jpeg',
    emoji: '',
    description: "Our flagship annual event celebrating Chandpur's rich culture. An evening filled with traditional music, dance, Ilish-themed cuisine, and heartfelt reunions. Students dressed in traditional attire, performed baul songs, and shared stories from the banks of Meghna.",
    photos: ['football/1.jpeg','football/2.jpeg','football/3.jpeg','football/5.jpeg','football/4.jpeg'],
    captions: []
  },
  {
    category: 'Orientation',
    title: 'Orientation Programm 2023',
    date: 'December 6th, 2023',
    location: 'SUST Research Center, Library',
    thumb: 'Or2023/1.jpeg',
    emoji: '🎭',
    description: "Welcoming our fresh faces and new minds from Chandpur to SUST with warm guidance and mentorship.",
    photos: ['Or2023/1.jpeg','Or2023/2.jpeg','Or2023/4.jpeg','Or2023/5.jpeg','Or2023/3.jpeg'],
    captions: []
  }
];

/* ─── HELPER: RESOLVE EVENT THEMATIC CATEGORY ─── */
function resolveEventCategory(ev) {
  if (!ev) return 'Normal';
  const cat = (ev.category || '').trim();
  // If explicitly specified in database and is not generic 'Normal', trust it
  if (cat && cat.toLowerCase() !== 'normal') {
    return cat;
  }
  // Try matching against default seeded events by title
  const titleLower = (ev.title || '').toLowerCase().trim();
  const matched = DEFAULT_EVENTS.find(de => de.title && de.title.toLowerCase().trim() === titleLower);
  if (matched && matched.category) {
    return matched.category;
  }
  // Robust pattern matching on title / location
  if (titleLower.includes('bbq')) return 'BBQ';
  if (titleLower.includes('orientation') && !titleLower.includes('bbq')) return 'Orientation';
  if (titleLower.includes('get together') || titleLower.includes('get-together')) return 'Get Together';
  if (titleLower.includes('iftar')) return 'Iftar Mahfil';
  if (titleLower.includes('sha-pa') || titleLower.includes('shapa')) return 'Social and dining Event';
  if (titleLower.includes('football') || titleLower.includes('sport') || (ev.location || '').toLowerCase().includes('sports center')) return 'Outdoor Sports';
  if (titleLower.includes('conference') || titleLower.includes('scholarship')) return 'Conference & Ceremony';
  return cat || 'Normal';
}
if (typeof window !== 'undefined') {
  window.resolveEventCategory = resolveEventCategory;
}

/* ──────────────────────────────────────────────────────────────────────────────
   DATA FETCHING APIS WITH AUTOMATIC FALLBACK
   ────────────────────────────────────────────────────────────────────────────── */

// 1. FRONT PAGE DATA
async function fetchFrontPageData() {
  let content = { ...DEFAULT_FRONT_PAGE };
  let culture = [ ...DEFAULT_CULTURE_CARDS ];
  let purpose = [ ...DEFAULT_PURPOSE_CARDS ];

  if (supabaseClient) {
    try {
      const [resContent, resCulture, resPurpose] = await Promise.all([
        supabaseClient.from('front_page_content').select('key, content'),
        supabaseClient.from('culture_cards').select('*').order('display_order', { ascending: true }),
        supabaseClient.from('purpose_cards').select('*').order('display_order', { ascending: true })
      ]);

      if (resContent.data && resContent.data.length > 0) {
        resContent.data.forEach(row => {
          content[row.key] = row.content;
        });
      }
      if (resCulture.data && resCulture.data.length > 0) {
        culture = resCulture.data;
      }
      if (resPurpose.data && resPurpose.data.length > 0) {
        purpose = resPurpose.data;
      }
    } catch (e) {
      console.warn('Error querying front page from Supabase, using fallback:', e);
    }
  }

  return { content, culture, purpose };
}

// 2. PEOPLE DATA (3 Primary Categories: members, teachers, staff)
async function fetchPeopleData() {
  let executive = [ ...DEFAULT_EXECUTIVE_MEMBERS ];
  let generalOnly = [ ...DEFAULT_GENERAL_MEMBERS ];
  let teachers = [ ...DEFAULT_TEACHERS ];
  let staff = [ ...DEFAULT_STAFF ];
  let members = [];

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('people').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        // Unify all student members (member, executive, general)
        members = data
          .filter(p => p.category === 'member' || p.category === 'executive' || p.category === 'general')
          .map(m => {
            const rawPos = m.position && m.position.trim();
            const pos = rawPos || (m.category === 'executive' ? (m.position || 'Executive Member') : 'General');
            return {
              ...m,
              category: 'member',
              position: pos,
              email: m.email || '',
              facebook_url: m.facebook_url || ''
            };
          });

        teachers = data.filter(p => p.category === 'teacher').map(t => {
          const normT = (t.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const matched = DEFAULT_TEACHERS.find(dt => {
            const normDT = dt.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return normDT === normT || normDT.includes(normT) || normT.includes(normDT)
              || normDT.replace('rezaul', 'razaul') === normT || normDT === normT.replace('razaul', 'rezaul')
              || normDT.replace('pradhan', '').trim() === normT;
          });
          return {
            ...t,
            phone: (t.phone && t.phone.trim()) ? t.phone.trim() : (matched ? matched.phone : '')
          };
        });
        staff = data.filter(p => p.category === 'staff');

        executive = members.filter(m => m.position && m.position.toLowerCase() !== 'general' && m.position.toLowerCase() !== 'general member');
        generalOnly = members.filter(m => !m.position || m.position.toLowerCase() === 'general' || m.position.toLowerCase() === 'general member');
      }
    } catch (e) {
      console.warn('Error querying people from Supabase, using fallback:', e);
    }
  }

  if (!members || members.length === 0) {
    let currentId = 113;
    const execMapped = DEFAULT_EXECUTIVE_MEMBERS.map(m => ({
      id: currentId++,
      ...m,
      category: 'member',
      position: m.position || 'Executive Member',
      email: m.email || '',
      facebook_url: m.facebook_url || ''
    }));
    const genMapped = DEFAULT_GENERAL_MEMBERS.map(m => ({
      id: currentId++,
      ...m,
      category: 'member',
      position: 'General',
      email: m.email || '',
      facebook_url: m.facebook_url || ''
    }));
    members = [...execMapped, ...genMapped];
    teachers = DEFAULT_TEACHERS.map(t => ({
      id: currentId++,
      ...t
    }));
    staff = DEFAULT_STAFF.map(s => ({
      id: currentId++,
      ...s
    }));
  }

  // 1. Sort Members by Session Descending (Newest first, e.g. 26-27, 25-26, 24-25, 23-24, 22-23, 21-22)
  members.sort((a, b) => {
    const sa = (a.session || '').trim();
    const sb = (b.session || '').trim();
    if (!sa && !sb) return 0;
    if (!sa) return 1;
    if (!sb) return -1;
    return sb.localeCompare(sa, undefined, { numeric: true });
  });

  // 2. Sort Teachers Alphabetically by Department Name (Full Form)
  teachers.sort((a, b) => {
    const da = (a.dept || '').trim().toLowerCase();
    const db = (b.dept || '').trim().toLowerCase();
    return da.localeCompare(db);
  });

  // 3. Sort Staff Alphabetically by Department Name
  staff.sort((a, b) => {
    const da = (a.dept || '').trim().toLowerCase();
    const db = (b.dept || '').trim().toLowerCase();
    return da.localeCompare(db);
  });

  const allGeneral = members.map(m => ({
    name: m.name,
    dept: m.dept,
    area: m.area,
    session: m.session,
    position: m.position || 'General',
    email: m.email || '',
    facebook_url: m.facebook_url || '',
    photo_url: m.photo_url || ''
  }));

  return {
    members,
    allMembers: members,
    executiveMembers: executive,
    generalMembersOnly: generalOnly,
    allGeneralMembers: allGeneral,
    teachers,
    staffMembers: staff
  };
}

// 3. EVENTS DATA (Sorted by Date Recency Descending)
async function fetchEventsData() {
  let events = [ ...DEFAULT_EVENTS ];

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('events').select('*');
      if (!error && data && data.length > 0) {
        events = data.map(ev => ({
          id: ev.id,
          category: resolveEventCategory(ev),
          title: ev.title,
          date: ev.date_text,
          date_text: ev.date_text,
          location: ev.location,
          description: ev.description,
          thumb: ev.thumb || '',
          emoji: ev.emoji || '🎭',
          photos: Array.isArray(ev.photos) ? ev.photos : (typeof ev.photos === 'string' ? JSON.parse(ev.photos) : []),
          captions: Array.isArray(ev.captions) ? ev.captions : (typeof ev.captions === 'string' ? JSON.parse(ev.captions) : [])
        }));
      }
    } catch (e) {
      console.warn('Error querying events from Supabase, using fallback:', e);
    }
  }

  // Sort events by date recency (Most recent event first)
  events.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    if (!isNaN(timeA) && !isNaN(timeB)) return timeB - timeA;
    return 0;
  });

  return events;
}

// 4. SINGLE EVENT BY ID (for event detail page)
async function fetchEventById(id) {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('events').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          category: resolveEventCategory(data),
          title: data.title,
          date: data.date_text,
          date_text: data.date_text,
          location: data.location,
          description: data.description,
          thumb: data.thumb || '',
          emoji: data.emoji || '🎭',
          photos: Array.isArray(data.photos) ? data.photos : (typeof data.photos === 'string' ? JSON.parse(data.photos) : []),
          captions: Array.isArray(data.captions) ? data.captions : (typeof data.captions === 'string' ? JSON.parse(data.captions) : [])
        };
      }
    } catch (e) {
      console.warn('Error fetching event by ID:', e);
    }
  }
  return null;
}

// 5. ADMIN SETTINGS
async function fetchAdminSettings() {
  let settings = {};
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('admin_settings').select('*');
      if (!error && data) {
        data.forEach(s => { settings[s.key] = s.value; });
      }
    } catch (e) {
      console.warn('Error fetching admin settings:', e);
    }
  }
  return settings;
}

// Utility Helpers
function nameToFilename(n) {
  return n.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}
function isImageFile(s) {
  if (!s || typeof s !== 'string') return false;
  const str = s.trim();
  if (str.startsWith('data:image/')) return true;
  const clean = str.split('?')[0].split('#')[0];
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(clean)) return true;
  if (/^https?:\/\//i.test(str) && (str.includes('/storage/') || str.includes('/images/') || str.includes('/photos/') || str.includes('/assets/'))) {
    return true;
  }
  return false;
}
if (typeof window !== 'undefined') {
  window.isImageFile = isImageFile;
}

// Automatically apply site settings (e.g. logo, favicon) across pages
async function applySiteSettings() {
  try {
    const settings = await fetchAdminSettings();
    if (settings && settings.logo_url) {
      document.querySelectorAll('.nav-logo img, #siteLogo, #adminLogoPreview').forEach(img => {
        img.src = settings.logo_url;
      });
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) favicon.href = settings.logo_url;
    }
  } catch (err) {
    console.debug('Failed to apply site settings:', err);
  }
}

// Automatically apply footer contact information (email, Facebook page) across pages
async function applyFooterContact() {
  try {
    const { content } = await fetchFrontPageData();
    if (content) {
      if (content.facebook_page_url) {
        document.querySelectorAll('a[href*="facebook.com/AssociationOfChandpurSUST"], a.footer-facebook-link').forEach(a => {
          a.href = content.facebook_page_url;
        });
      }
      if (content.contact_email) {
        document.querySelectorAll('a[href^="mailto:"], a.footer-email-link').forEach(a => {
          a.href = `mailto:${content.contact_email}`;
        });
      }
    }
  } catch (err) {
    console.debug('Failed to apply footer contacts:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    applySiteSettings();
    applyFooterContact();
  });
} else {
  applySiteSettings();
  applyFooterContact();
}

