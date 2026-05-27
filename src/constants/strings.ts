// ============================================================
// SchemeSetu - String Constants
// Supports English and Hindi (placeholder translations)
// ============================================================

export const STRINGS = {
  en: {
    // App
    appName: 'SchemeSetu',
    tagline: 'Find Government Schemes You Qualify For',
    taglineHindi: 'अपनी योग्यता के अनुसार सरकारी योजनाएं खोजें',

    // Splash
    loading: 'Loading...',
    poweredBy: 'Powered by AI',

    // Auth
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    guestContinue: 'Continue as Guest',
    googleSignIn: 'Continue with Google',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    namePlaceholder: 'Enter your full name',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    loginHere: 'Login here',
    signupHere: 'Sign up here',

    // Home
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    searchPlaceholder: 'Search schemes, scholarships, pensions…',
    categories: 'Categories',
    featuredSchemes: 'Featured Schemes',
    seeAll: 'See All',
    newBadge: 'NEW',
    popularBadge: 'POPULAR',

    // Categories
    students: 'Students',
    farmers: 'Farmers',
    women: 'Women',
    jobs: 'Jobs',
    business: 'Business',
    health: 'Health',
    senior: 'Senior Citizens',
    housing: 'Housing',

    // Chat
    aiAssistant: 'AI Scheme Assistant',
    chatPlaceholder: 'Ask about any government scheme...',
    suggestedPrompts: 'Suggested Questions',
    typing: 'Seetu is typing...',

    // Scheme Details
    benefits: 'Benefits',
    eligibility: 'Eligibility Criteria',
    documents: 'Required Documents',
    applyNow: 'Apply Now',
    learnMore: 'Learn More',
    bookmark: 'Save Scheme',
    bookmarked: 'Saved!',
    deadline: 'Application Deadline',
    category: 'Category',
    ministry: 'Ministry',
    schemeId: 'Scheme ID',

    // Saved
    savedSchemes: 'Saved Schemes',
    noSaved: 'No Saved Schemes Yet',
    noSavedDesc: 'Bookmark schemes you like to find them easily later.',

    // Notifications
    notifications: 'Notifications',
    noNotifications: 'No new notifications',
    markAllRead: 'Mark All Read',

    // Profile
    profile: 'My Profile',
    language: 'Language',
    darkMode: 'Dark Mode',
    appVersion: 'App Version',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    helpSupport: 'Help & Support',
    shareApp: 'Share App',

    // Navigation
    home: 'Home',
    chat: 'AI Chat',
    saved: 'Saved',
    notifs: 'Alerts',
    profileNav: 'Profile',
  },

  hi: {
    // Hindi placeholder translations
    appName: 'स्कीमसेतु',
    tagline: 'अपनी योग्यता के अनुसार सरकारी योजनाएं खोजें',
    searchPlaceholder: 'योजनाएं, छात्रवृत्ति, पेंशन खोजें…',
    categories: 'श्रेणियाँ',
    featuredSchemes: 'प्रमुख योजनाएं',
    seeAll: 'सभी देखें',
    students: 'छात्र',
    farmers: 'किसान',
    women: 'महिलाएं',
    jobs: 'रोजगार',
    business: 'व्यापार',
    health: 'स्वास्थ्य',
    home: 'होम',
    chat: 'AI चैट',
    saved: 'सेव्ड',
    notifs: 'अलर्ट',
    profileNav: 'प्रोफाइल',
    applyNow: 'अभी आवेदन करें',
    benefits: 'लाभ',
    eligibility: 'पात्रता',
    documents: 'आवश्यक दस्तावेज',
  },
} as const;

export type Lang = keyof typeof STRINGS;
