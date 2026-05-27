// ============================================================
// SchemeSetu - Dummy Data
// Mock data for schemes, notifications, categories, chat
// ============================================================

export interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  ministry: string;
  category: string;
  categories: string[];
  shortDesc: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  deadline: string;
  amount?: string;
  isNew?: boolean;
  isPopular?: boolean;
  applicationUrl: string;
  image?: string;
  tags: string[];
  state?: string;
  searchKeywords?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'deadline' | 'new' | 'update' | 'reminder';
  isRead: boolean;
  schemeId?: string;
}

// ─── Schemes Data ────────────────────────────────────────────────────────────

export const DUMMY_SCHEMES: Scheme[] = [
  {
    id: '1',
    name: 'PM Kisan Samman Nidhi',
    nameHindi: 'पीएम किसान सम्मान निधि',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'farmers',
    categories: ['farmers', 'subsidy'],
    shortDesc: '₹6,000/year direct income support to all farmer families.',
    description:
      'The PM-KISAN scheme provides income support of ₹6,000 per year to all farmer families across India in three equal installments of ₹2,000 each every four months.',
    benefits: [
      '₹6,000 per year directly to bank account',
      '₹2,000 every 4 months in 3 installments',
      'Direct Benefit Transfer (DBT) mode',
      'No middlemen — direct to farmer bank account',
    ],
    eligibility: [
      'Must be a farmer or farmer family',
      'Should own cultivable land',
      'Valid Aadhaar card required',
      'Active bank account linked to Aadhaar',
      'Not a government employee or income taxpayer',
    ],
    documents: [
      'Aadhaar Card',
      'Bank Passbook / Account Number',
      'Land Ownership Documents (Khasra/Khatauni)',
      'Mobile Number linked to Aadhaar',
    ],
    deadline: 'Rolling Applications — Open Year Round',
    amount: '₹6,000/year',
    isPopular: true,
    applicationUrl: 'https://pmkisan.gov.in',
    tags: ['farmers', 'income support', 'agriculture', 'DBT'],
  },
  {
    id: '2',
    name: 'PM Scholarship Scheme',
    nameHindi: 'प्रधानमंत्री छात्रवृत्ति योजना',
    ministry: 'Ministry of Education',
    category: 'students',
    shortDesc: 'Scholarships for wards of ex-servicemen & RPF personnel.',
    description:
      'The PM Scholarship Scheme provides financial assistance to the widows and wards of ex-servicemen and RPF/RPSF personnel for professional degree courses.',
    benefits: [
      '₹2,500/month for boys',
      '₹3,000/month for girls',
      'Covers professional degree courses',
      'Renewable every year on passing',
    ],
    eligibility: [
      'Ward or widow of Ex-Serviceman / RPF personnel',
      'Minimum 60% marks in last qualifying exam',
      'Pursuing 1st year of professional degree',
      'Age between 18-25 years',
    ],
    documents: [
      'Ex-Serviceman certificate',
      'Aadhaar Card',
      'Marksheet of last exam',
      'Admission letter from college',
      'Bank account details',
    ],
    deadline: '31 October 2025',
    amount: '₹36,000/year',
    isNew: true,
    applicationUrl: 'https://scholarships.gov.in',
    tags: ['students', 'scholarship', 'education', 'ex-servicemen'],
  },
  {
    id: '3',
    name: 'PM Ujjwala Yojana',
    nameHindi: 'प्रधानमंत्री उज्ज्वला योजना',
    ministry: 'Ministry of Petroleum & Natural Gas',
    category: 'women',
    shortDesc: 'Free LPG connections to BPL women households.',
    description:
      'PMUY aims to provide free LPG gas connections to women from Below Poverty Line (BPL) households to replace traditional unclean cooking fuels.',
    benefits: [
      'Free LPG connection with stove & first refill',
      'EMI facility for subsequent refills',
      'Clean cooking fuel',
      'Protection from smoke-related diseases',
    ],
    eligibility: [
      'Adult woman from BPL household',
      'Must not have existing LPG connection',
      'Ration card or Antyodaya card',
      'Name on BPL list of state/UT',
    ],
    documents: [
      'BPL Ration Card',
      'Aadhaar Card',
      'Bank Account Details',
      'Passport Size Photos',
    ],
    deadline: 'Open — Rolling Applications',
    isPopular: true,
    applicationUrl: 'https://pmuy.gov.in',
    tags: ['women', 'LPG', 'BPL', 'cooking gas'],
  },
  {
    id: '4',
    name: 'Startup India Seed Fund',
    nameHindi: 'स्टार्टअप इंडिया सीड फंड',
    ministry: 'DPIIT, Ministry of Commerce',
    category: 'business',
    shortDesc: 'Up to ₹50 lakh funding for early-stage startups.',
    description:
      'The Startup India Seed Fund Scheme provides financial assistance for proof of concept, prototype development, product trials, market entry, and commercialization.',
    benefits: [
      'Up to ₹20 lakh for validation/proof of concept',
      'Up to ₹50 lakh for market entry & commercialization',
      'Mentorship from expert advisors',
      'Access to startup ecosystem',
    ],
    eligibility: [
      'DPIIT recognized startup',
      'Incorporated ≤ 2 years ago',
      'Must have innovative product/solution',
      'Not received more than ₹10 lakh funding from government',
    ],
    documents: [
      'DPIIT Recognition Certificate',
      'Business Plan/Pitch Deck',
      'CA Certified Financial Statements',
      'MCA Incorporation Certificate',
      'PAN Card',
    ],
    deadline: '30 September 2025',
    amount: 'Up to ₹50 Lakh',
    isNew: true,
    applicationUrl: 'https://startupindia.gov.in',
    tags: ['startup', 'business', 'funding', 'DPIIT'],
  },
  {
    id: '5',
    name: 'Ayushman Bharat PM-JAY',
    nameHindi: 'आयुष्मान भारत पीएम-जेएवाई',
    ministry: 'Ministry of Health & Family Welfare',
    category: 'health',
    shortDesc: '₹5 lakh health cover for 55 crore+ beneficiaries.',
    description:
      'Pradhan Mantri Jan Arogya Yojana provides health coverage of ₹5 lakh per family per year for secondary and tertiary hospitalization.',
    benefits: [
      '₹5 lakh annual health cover per family',
      'Cashless treatment at empanelled hospitals',
      'Pre & post hospitalization coverage',
      'Coverage for 1,949 medical procedures',
    ],
    eligibility: [
      'Must be on SECC 2011 database or',
      'Active PMJAY beneficiary as per state list',
      'No income cap — based on deprivation criteria',
      'Applicable for rural & urban poor',
    ],
    documents: [
      'Aadhaar Card / VoterID',
      'Ration Card',
      'PMJAY e-card (if already registered)',
    ],
    deadline: 'Ongoing — No Deadline',
    amount: '₹5 Lakh Cover',
    isPopular: true,
    applicationUrl: 'https://pmjay.gov.in',
    tags: ['health', 'insurance', 'BPL', 'hospitalization'],
  },
  {
    id: '6',
    name: 'PM Mudra Yojana',
    nameHindi: 'प्रधानमंत्री मुद्रा योजना',
    ministry: 'Ministry of Finance',
    category: 'business',
    shortDesc: 'Loans up to ₹10 lakh for small business owners.',
    description:
      'PMMY provides collateral-free micro-loans to non-corporate, non-farm small/micro enterprises through Shishu, Kishor, and Tarun loan categories.',
    benefits: [
      'Shishu: Loans up to ₹50,000',
      'Kishor: ₹50,001 to ₹5 lakh',
      'Tarun: ₹5 lakh to ₹10 lakh',
      'No collateral required',
      'Low interest rates',
    ],
    eligibility: [
      'Non-farm income generating activities',
      'Micro or small enterprise owner',
      'Good credit history (for higher amounts)',
      'Indian citizen with valid ID',
    ],
    documents: [
      'Aadhaar + PAN Card',
      'Business Address Proof',
      'Bank Statements (6 months)',
      'Business Plan',
      '2 Passport Photos',
    ],
    deadline: 'Open Year Round',
    amount: 'Up to ₹10 Lakh',
    isPopular: true,
    applicationUrl: 'https://mudra.org.in',
    tags: ['business', 'loan', 'MSME', 'mudra'],
  },
  {
    id: '7',
    name: 'National Apprenticeship Promotion',
    nameHindi: 'राष्ट्रीय प्रशिक्षुता संवर्धन योजना',
    ministry: 'Ministry of Skill Development',
    category: 'jobs',
    shortDesc: 'Stipend support for apprentices in industry training.',
    description:
      'NAPS promotes apprenticeship training by sharing 25% of stipend cost (max ₹1,500/month) with employers to increase apprentice engagement in industries.',
    benefits: [
      '25% stipend reimbursement to employer (max ₹1,500/month)',
      'Basic training cost reimbursement',
      'Industry-recognized certificate',
      'Pathway to regular employment',
    ],
    eligibility: [
      'Aged 14-35 years',
      'Minimum 5th class pass for some trades',
      'Enrolled with a registered employer',
      'Valid Aadhaar Card',
    ],
    documents: [
      'Aadhaar Card',
      'Educational Certificates',
      'Bank Account Details',
      'Photograph',
    ],
    deadline: '31 March 2026',
    amount: '₹1,500/month stipend support',
    isNew: true,
    applicationUrl: 'https://apprenticeshipindia.gov.in',
    tags: ['jobs', 'apprenticeship', 'skill', 'youth'],
  },
  {
    id: '8',
    name: 'Beti Bachao Beti Padhao',
    nameHindi: 'बेटी बचाओ बेटी पढ़ाओ',
    ministry: 'Ministry of Women & Child Development',
    category: 'women',
    shortDesc: 'Promoting welfare, education and survival of girl child.',
    description:
      'BBBP scheme aims to address declining child sex ratio and related issues of women empowerment through multi-sectoral action in 405 districts of India.',
    benefits: [
      'Improved child sex ratio outcomes',
      'Scholarships for girl students',
      'Life skill education programs',
      'Community awareness campaigns',
    ],
    eligibility: [
      'Girl child from birth to 18 years',
      'Parents/guardians can apply on behalf',
      'All social categories covered',
    ],
    documents: [
      'Birth Certificate of girl child',
      'Parents Aadhaar Card',
      'Residence Proof',
    ],
    deadline: 'Ongoing Program',
    applicationUrl: 'https://wcd.nic.in/bbbp-schemes',
    tags: ['women', 'girl child', 'education', 'welfare'],
  },
];

// ─── Category Data ────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'students',         label: 'Students',         emoji: '🎓', count: 142 },
  { id: 'farmers',          label: 'Farmers',          emoji: '🌾', count: 98  },
  { id: 'women',            label: 'Women',            emoji: '👩', count: 87  },
  { id: 'jobs',             label: 'Jobs',             emoji: '💼', count: 65  },
  { id: 'business',         label: 'Business',         emoji: '🏪', count: 54  },
  { id: 'health',           label: 'Health',           emoji: '🏥', count: 73  },
  { id: 'senior',           label: 'Senior Citizens',  emoji: '👴', count: 32  },
  { id: 'housing',          label: 'Housing',          emoji: '🏠', count: 41  },
  { id: 'disability',       label: 'Disability',       emoji: '♿', count: 24  },
  { id: 'startup',          label: 'Startup',          emoji: '🚀', count: 18  },
  { id: 'education',        label: 'Education',        emoji: '📖', count: 76  },
  { id: 'pension',          label: 'Pension',          emoji: '💳', count: 28  },
  { id: 'subsidy',          label: 'Subsidy',          emoji: '💰', count: 52  },
  { id: 'skill-development', label: 'Skill Development', emoji: '🔧', count: 35  },
];

// ─── AI Chat Suggested Prompts ─────────────────────────────────────────────

export const SUGGESTED_PROMPTS = [
  'What schemes are available for farmers?',
  'I am a student. What scholarships can I get?',
  'Show me women empowerment schemes',
  'I want to start a small business. What loans are available?',
  'What health insurance schemes exist for BPL families?',
  'Tell me about PM Kisan Yojana benefits',
  'How can I apply for Ayushman Bharat?',
  'What pension schemes are there for senior citizens?',
];

// ─── AI Chat Messages (Demo) ──────────────────────────────────────────────

export const DEMO_CHAT: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    text: 'Namaste! 🙏 I am Seetu, your AI Government Scheme Assistant. I can help you find schemes based on your eligibility, explain benefits, and guide you through the application process. What would you like to know today?',
    timestamp: new Date(),
  },
];

// ─── Notifications Data ──────────────────────────────────────────────────

export const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: '⚠️ Deadline Reminder',
    body: 'PM Scholarship Scheme deadline is approaching! Apply before 31 October 2025.',
    time: '2 hours ago',
    type: 'deadline',
    isRead: false,
    schemeId: '2',
  },
  {
    id: '2',
    title: '🆕 New Scheme Added',
    body: 'Startup India Seed Fund — Up to ₹50 lakh now available for early-stage startups.',
    time: '1 day ago',
    type: 'new',
    isRead: false,
    schemeId: '4',
  },
  {
    id: '3',
    title: '💰 PM Kisan Installment',
    body: 'The 16th installment of PM Kisan Samman Nidhi has been released. Check your bank account.',
    time: '3 days ago',
    type: 'update',
    isRead: true,
    schemeId: '1',
  },
  {
    id: '4',
    title: '🏥 Ayushman Bharat Update',
    body: 'New hospitals added to PM-JAY network in your state. Find empanelled hospitals near you.',
    time: '1 week ago',
    type: 'update',
    isRead: true,
    schemeId: '5',
  },
  {
    id: '5',
    title: '📋 Application Reminder',
    body: 'You saved Mudra Yojana scheme. Complete your application before the offer period ends.',
    time: '2 weeks ago',
    type: 'reminder',
    isRead: true,
    schemeId: '6',
  },
];

// ─── Languages ────────────────────────────────────────────────────────────

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];
