export type QuestionType = 'text' | 'number' | 'select' | 'yesno' | 'percentage' | 'age';

export interface SelectOption {
  value: string;
  label: string;
}

export interface Question {
  key: string;
  label: string;
  labelHi: string;
  type: QuestionType;
  options?: SelectOption[];
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
  };
  section: string;
  dependsOn?: { key: string; value: string };
}

export type QuestionMap = Record<OccupationKey, Question[]>;

export type OccupationKey =
  | 'student' | 'farmer' | 'job-seeker' | 'business-owner'
  | 'woman' | 'senior-citizen' | 'homemaker' | 'disabled-person'
  | 'worker-labourer' | 'other';

export interface AnswerMap {
  [key: string]: string;
}

export interface MatchCheck {
  key: string;
  label: string;
  passed: boolean;
  weight: number;
}

export interface MatchBreakdown {
  score: number;
  label: MatchLabel;
  checks: MatchCheck[];
  missingFields: string[];
}

export type MatchLabel = 'perfect' | 'high' | 'partial' | 'low' | 'none';

export interface EligibilityRuleSet {
  eligibleOccupations?: string[];
  eligibleStates?: string[];
  eligibleCategories?: string[];
  maxIncome?: number;
  minIncome?: number;
  minAge?: number;
  maxAge?: number;
  minimumMarks?: number;
  genderEligibility?: string[];
  disabilityEligible?: boolean;
  courseTypes?: string[];
  degreeTypes?: string[];
  streams?: string[];
  hostelRequired?: boolean;
  singleGirlChild?: boolean;
  exServicemanFamily?: boolean;
  orphanEligible?: boolean;
  ruralRequired?: boolean;
  govtSchoolRequired?: boolean;
  bplRequired?: boolean;
  minorityEligible?: boolean;
  professionalCourse?: boolean;
}

const INDIAN_STATES: SelectOption[] = [
  { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
  { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Bihar', label: 'Bihar' },
  { value: 'Chhattisgarh', label: 'Chhattisgarh' },
  { value: 'Goa', label: 'Goa' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Haryana', label: 'Haryana' },
  { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
  { value: 'Jharkhand', label: 'Jharkhand' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Kerala', label: 'Kerala' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Manipur', label: 'Manipur' },
  { value: 'Meghalaya', label: 'Meghalaya' },
  { value: 'Mizoram', label: 'Mizoram' },
  { value: 'Nagaland', label: 'Nagaland' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Sikkim', label: 'Sikkim' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
  { value: 'Telangana', label: 'Telangana' },
  { value: 'Tripura', label: 'Tripura' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  { value: 'Uttarakhand', label: 'Uttarakhand' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Jammu & Kashmir', label: 'Jammu & Kashmir' },
  { value: 'Ladakh', label: 'Ladakh' },
];

const INCOME_OPTIONS: SelectOption[] = [
  { value: 'below-1lakh', label: 'Below ₹1,00,000' },
  { value: '1-2.5lakh', label: '₹1,00,000 – 2,50,000' },
  { value: '2.5-5lakh', label: '₹2,50,000 – 5,00,000' },
  { value: '5-10lakh', label: '₹5,00,000 – 10,00,000' },
  { value: 'above-10lakh', label: 'Above ₹10,00,000' },
];

const COURSE_OPTIONS: SelectOption[] = [
  { value: 'class-1-5', label: 'Class 1–5' },
  { value: 'class-6-8', label: 'Class 6–8' },
  { value: 'class-9-10', label: 'Class 9–10' },
  { value: 'class-11-12', label: 'Class 11–12' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD / Research' },
  { value: 'vocational', label: 'Vocational Training' },
];

const STREAM_OPTIONS: SelectOption[] = [
  { value: 'science', label: 'Science' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'arts', label: 'Arts / Humanities' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'medical', label: 'Medical' },
  { value: 'law', label: 'Law' },
  { value: 'management', label: 'Management' },
  { value: 'it-cs', label: 'IT / Computer Science' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
];

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const OCCUPATION_QUESTIONS: QuestionMap = {
  student: [
    // Academic Details
    { key: 'course', label: 'Current Class / Course', labelHi: 'वर्तमान कक्षा / पाठ्यक्रम', type: 'select', options: COURSE_OPTIONS, section: 'Academic Details', validation: { required: true } },
    { key: 'degreeType', label: 'Degree Type', labelHi: 'डिग्री प्रकार', type: 'select', options: [
      { value: 'school', label: 'School Level' },
      { value: 'undergraduate', label: 'Undergraduate' },
      { value: 'postgraduate', label: 'Postgraduate' },
      { value: 'doctoral', label: 'Doctoral' },
      { value: 'diploma', label: 'Diploma / Certificate' },
    ], section: 'Academic Details' },
    { key: 'stream', label: 'Stream', labelHi: 'संकाय', type: 'select', options: STREAM_OPTIONS, section: 'Academic Details' },
    { key: 'yearSemester', label: 'Current Year / Semester', labelHi: 'वर्तमान वर्ष / सेमेस्टर', type: 'text', placeholder: 'e.g., 1st Year, 2nd Semester', section: 'Academic Details' },
    { key: 'collegeType', label: 'Institution Type', labelHi: 'संस्थान का प्रकार', type: 'select', options: [
      { value: 'government', label: 'Government' },
      { value: 'private', label: 'Private' },
      { value: 'aided', label: 'Government-Aided' },
    ], section: 'Academic Details' },
    { key: 'professionalCourse', label: 'Are you pursuing a professional course?', labelHi: 'क्या आप व्यावसायिक पाठ्यक्रम कर रहे हैं?', type: 'yesno', section: 'Academic Details' },
    // Academic Performance
    { key: 'marks', label: 'Last Exam Percentage', labelHi: 'पिछली परीक्षा में प्रतिशत', type: 'percentage', placeholder: 'e.g., 85', section: 'Academic Performance', validation: { required: true, min: 0, max: 100 } },
    { key: 'cgpa', label: 'CGPA (if applicable)', labelHi: 'CGPA (यदि लागू हो)', type: 'number', placeholder: 'e.g., 8.5', section: 'Academic Performance', validation: { min: 0, max: 10 } },
    { key: 'entranceScore', label: 'Entrance Exam Score (JEE/NEET/GATE etc.)', labelHi: 'प्रवेश परीक्षा स्कोर', type: 'text', placeholder: 'e.g., JEE 95 percentile', section: 'Academic Performance' },
    // Personal Details
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 18', section: 'Personal Details', validation: { required: true, min: 3, max: 100 } },
    { key: 'gender', label: 'Gender', labelHi: 'लिंग', type: 'select', options: GENDER_OPTIONS, section: 'Personal Details', validation: { required: true } },
    { key: 'state', label: 'State of Residence', labelHi: 'निवास का राज्य', type: 'select', options: INDIAN_STATES, section: 'Personal Details', validation: { required: true } },
    { key: 'district', label: 'District', labelHi: 'जिला', type: 'text', placeholder: 'e.g., Patna', section: 'Personal Details' },
    { key: 'category', label: 'Category (Caste)', labelHi: 'श्रेणी (जाति)', type: 'select', options: CATEGORY_OPTIONS, section: 'Personal Details', validation: { required: true } },
    { key: 'minority', label: 'Do you belong to a minority community?', labelHi: 'क्या आप अल्पसंख्यक समुदाय से हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'disability', label: 'Do you have a disability?', labelHi: 'क्या आप दिव्यांग हैं?', type: 'yesno', section: 'Personal Details' },
    // Financial Background
    { key: 'familyIncome', label: 'Annual Family Income', labelHi: 'वार्षिक पारिवारिक आय', type: 'select', options: INCOME_OPTIONS, section: 'Financial Background', validation: { required: true } },
    { key: 'bpl', label: 'Is your family Below Poverty Line (BPL)?', labelHi: 'क्या आपका परिवार गरीबी रेखा से नीचे है?', type: 'yesno', section: 'Financial Background' },
    { key: 'parentOccupation', label: 'Parent / Guardian Occupation', labelHi: 'माता-पिता / अभिभावक का व्यवसाय', type: 'text', placeholder: 'e.g., Farmer, Government Employee', section: 'Financial Background' },
    // Special Conditions
    { key: 'exServiceman', label: 'Are you from an ex-serviceman family?', labelHi: 'क्या आप पूर्व सैनिक परिवार से हैं?', type: 'yesno', section: 'Special Conditions' },
    { key: 'singleGirlChild', label: 'Are you a single girl child?', labelHi: 'क्या आप एकमात्र बेटी हैं?', type: 'yesno', section: 'Special Conditions', dependsOn: { key: 'gender', value: 'female' } },
    { key: 'orphan', label: 'Are you an orphan?', labelHi: 'क्या आप अनाथ हैं?', type: 'yesno', section: 'Special Conditions' },
    { key: 'hosteller', label: 'Are you a hostel resident?', labelHi: 'क्या आप छात्रावास में रहते हैं?', type: 'yesno', section: 'Special Conditions' },
    { key: 'rural', label: 'Do you live in a rural area?', labelHi: 'क्या आप ग्रामीण क्षेत्र में रहते हैं?', type: 'yesno', section: 'Special Conditions' },
    { key: 'govtSchool', label: 'Do you study in a government school/college?', labelHi: 'क्या आप सरकारी स्कूल/कॉलेज में पढ़ते हैं?', type: 'yesno', section: 'Special Conditions' },
    // Documents
    { key: 'aadhaarAvailable', label: 'Do you have an Aadhaar card?', labelHi: 'क्या आपके पास आधार कार्ड है?', type: 'yesno', section: 'Documents' },
    { key: 'incomeCertificate', label: 'Do you have an income certificate?', labelHi: 'क्या आपके पास आय प्रमाण पत्र है?', type: 'yesno', section: 'Documents' },
    { key: 'casteCertificate', label: 'Do you have a caste certificate?', labelHi: 'क्या आपके पास जाति प्रमाण पत्र है?', type: 'yesno', section: 'Documents' },
    { key: 'bonafide', label: 'Do you have a bonafide / student certificate?', labelHi: 'क्या आपके पास छात्र प्रमाण पत्र है?', type: 'yesno', section: 'Documents' },
    { key: 'scholarshipBefore', label: 'Have you received a scholarship before?', labelHi: 'क्या आपने पहले छात्रवृत्ति प्राप्त की है?', type: 'yesno', section: 'Academic Details' },
  ],

  farmer: [
    { key: 'landOwnership', label: 'Land Ownership Status', labelHi: 'भूमि स्वामित्व स्थिति', type: 'select', options: [
      { value: 'own', label: 'Own Land' },
      { value: 'leased', label: 'Leased Land' },
      { value: 'sharecropping', label: 'Sharecropping' },
      { value: 'landless', label: 'Landless Labourer' },
    ], section: 'Farming Details', validation: { required: true } },
    { key: 'landSize', label: 'Total Land Area (in acres)', labelHi: 'कुल भूमि क्षेत्र (एकड़ में)', type: 'number', placeholder: 'e.g., 2.5', section: 'Farming Details', validation: { required: true, min: 0, max: 1000 } },
    { key: 'irrigation', label: 'Irrigation Status', labelHi: 'सिंचाई की स्थिति', type: 'select', options: [
      { value: 'fully-irrigated', label: 'Fully Irrigated' },
      { value: 'partially-irrigated', label: 'Partially Irrigated' },
      { value: 'rainfed', label: 'Rainfed / No Irrigation' },
    ], section: 'Farming Details' },
    { key: 'mainCrop', label: 'Main Crop Type', labelHi: 'मुख्य फसल प्रकार', type: 'text', placeholder: 'e.g., Wheat, Rice, Sugarcane', section: 'Farming Details', validation: { required: true } },
    { key: 'annualIncome', label: 'Annual Farming Income', labelHi: 'वार्षिक कृषि आय', type: 'select', options: INCOME_OPTIONS, section: 'Farming Details', validation: { required: true } },
    { key: 'livestock', label: 'Do you own livestock?', labelHi: 'क्या आपके पास पशुधन है?', type: 'yesno', section: 'Farming Details' },
    { key: 'kisanCreditCard', label: 'Do you have a Kisan Credit Card?', labelHi: 'क्या आपके पास किसान क्रेडिट कार्ड है?', type: 'yesno', section: 'Farming Details' },
    { key: 'pmKisanRegistered', label: 'Are you registered under PM-Kisan?', labelHi: 'क्या आप PM-किसान में पंजीकृत हैं?', type: 'yesno', section: 'Farming Details' },
    { key: 'tractorEquipment', label: 'Do you own tractor / farm equipment?', labelHi: 'क्या आपके पास ट्रैक्टर / कृषि उपकरण है?', type: 'yesno', section: 'Farming Details' },
    { key: 'organicFarming', label: 'Are you practicing organic farming?', labelHi: 'क्या आप जैविक खेती कर रहे हैं?', type: 'yesno', section: 'Farming Details' },
    { key: 'farmerCategory', label: 'Farmer Category', labelHi: 'किसान श्रेणी', type: 'select', options: [
      { value: 'marginal', label: 'Marginal (< 1 acre)' },
      { value: 'small', label: 'Small (1–2 acres)' },
      { value: 'medium', label: 'Medium (2–5 acres)' },
      { value: 'large', label: 'Large (> 5 acres)' },
    ], section: 'Farming Details' },
    { key: 'cropInsurance', label: 'Have you taken crop insurance?', labelHi: 'क्या आपने फसल बीमा कराया है?', type: 'yesno', section: 'Farming Details' },
    { key: 'fpoMember', label: 'Are you a member of a Farmer Producer Organization?', labelHi: 'क्या आप किसान उत्पादक संगठन के सदस्य हैं?', type: 'yesno', section: 'Farming Details' },
    { key: 'soilHealthCard', label: 'Do you have a Soil Health Card?', labelHi: 'क्या आपके पास मृदा स्वास्थ्य कार्ड है?', type: 'yesno', section: 'Farming Details' },
    { key: 'bankAadhaarLinked', label: 'Is your bank account linked with Aadhaar?', labelHi: 'क्या आपका बैंक खाता आधार से लिंक है?', type: 'yesno', section: 'Farming Details' },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Personal & Eligibility', validation: { required: true } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Personal & Eligibility' },
  ],

  'job-seeker': [
    { key: 'highestQualification', label: 'Highest Qualification', labelHi: 'उच्चतम योग्यता', type: 'select', options: [
      { value: 'below-10th', label: 'Below 10th' },
      { value: '10th', label: '10th Pass' },
      { value: '12th', label: '12th Pass' },
      { value: 'diploma', label: 'Diploma' },
      { value: 'graduate', label: 'Graduate' },
      { value: 'postgraduate', label: 'Postgraduate' },
      { value: 'phd', label: 'PhD' },
      { value: 'iti', label: 'ITI / Vocational' },
    ], section: 'Employment Details', validation: { required: true } },
    { key: 'skills', label: 'Your Skills (comma separated)', labelHi: 'आपके कौशल (अल्पविराम से अलग)', type: 'text', placeholder: 'e.g., MS Office, Tally, Driving', section: 'Employment Details' },
    { key: 'preferredSector', label: 'Preferred Job Sector', labelHi: 'पसंदीदा नौकरी क्षेत्र', type: 'select', options: [
      { value: 'government', label: 'Government' },
      { value: 'private', label: 'Private Sector' },
      { value: 'both', label: 'Both' },
      { value: 'self-employed', label: 'Self-Employed' },
    ], section: 'Employment Details' },
    { key: 'experienceLevel', label: 'Are you a fresher or experienced?', labelHi: 'आप नए हैं या अनुभवी?', type: 'select', options: [
      { value: 'fresher', label: 'Fresher' },
      { value: 'experienced-1-3', label: '1–3 Years Experience' },
      { value: 'experienced-3-5', label: '3–5 Years Experience' },
      { value: 'experienced-5-plus', label: '5+ Years Experience' },
    ], section: 'Employment Details' },
    { key: 'unemployed', label: 'Are you currently unemployed?', labelHi: 'क्या आप वर्तमान में बेरोजगार हैं?', type: 'yesno', section: 'Employment Details' },
    { key: 'employmentExchange', label: 'Are you registered with Employment Exchange?', labelHi: 'क्या आप रोजगार कार्यालय में पंजीकृत हैं?', type: 'yesno', section: 'Employment Details' },
    { key: 'skillTraining', label: 'Have you completed any skill training?', labelHi: 'क्या आपने कोई कौशल प्रशिक्षण पूरा किया है?', type: 'yesno', section: 'Employment Details' },
    { key: 'resumeAvailable', label: 'Do you have a resume/CV?', labelHi: 'क्या आपके पास रिज्यूमे/सीवी है?', type: 'yesno', section: 'Employment Details' },
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 25', section: 'Personal & Eligibility', validation: { required: true, min: 14, max: 100 } },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Personal & Eligibility', validation: { required: true } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Personal & Eligibility' },
    { key: 'gender', label: 'Gender', labelHi: 'लिंग', type: 'select', options: GENDER_OPTIONS, section: 'Personal & Eligibility' },
    { key: 'relocate', label: 'Willing to relocate?', labelHi: 'क्या आप स्थानांतरण के लिए तैयार हैं?', type: 'yesno', section: 'Personal & Eligibility' },
    { key: 'expectedSalary', label: 'Monthly Expected Salary', labelHi: 'अपेक्षित मासिक वेतन', type: 'select', options: [
      { value: 'below-10k', label: 'Below ₹10,000' },
      { value: '10-25k', label: '₹10,000 – 25,000' },
      { value: '25-50k', label: '₹25,000 – 50,000' },
      { value: '50k-1lakh', label: '₹50,000 – 1,00,000' },
      { value: 'above-1lakh', label: 'Above ₹1,00,000' },
    ], section: 'Personal & Eligibility' },
    { key: 'apprenticeshipInterest', label: 'Interested in apprenticeship?', labelHi: 'क्या आप अप्रेंटिसशिप में रुचि रखते हैं?', type: 'yesno', section: 'Personal & Eligibility' },
    { key: 'disability', label: 'Do you have a disability?', labelHi: 'क्या आप दिव्यांग हैं?', type: 'yesno', section: 'Personal & Eligibility' },
  ],

  'business-owner': [
    { key: 'businessType', label: 'Business Type', labelHi: 'व्यवसाय प्रकार', type: 'select', options: [
      { value: 'retail', label: 'Retail Shop' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'services', label: 'Services' },
      { value: 'food', label: 'Food & Hospitality' },
      { value: 'agriculture-business', label: 'Agriculture-based Business' },
      { value: 'handicraft', label: 'Handicraft' },
      { value: 'tech-startup', label: 'Tech Startup' },
      { value: 'other', label: 'Other' },
    ], section: 'Business Details', validation: { required: true } },
    { key: 'msmeRegistered', label: 'Is your business MSME registered?', labelHi: 'क्या आपका व्यवसाय MSME पंजीकृत है?', type: 'yesno', section: 'Business Details' },
    { key: 'gstRegistered', label: 'Is your business GST registered?', labelHi: 'क्या आपका व्यवसाय GST पंजीकृत है?', type: 'yesno', section: 'Business Details' },
    { key: 'annualTurnover', label: 'Annual Turnover', labelHi: 'वार्षिक कारोबार', type: 'select', options: [
      { value: 'below-5lakh', label: 'Below ₹5 Lakh' },
      { value: '5-25lakh', label: '₹5 – 25 Lakh' },
      { value: '25lakh-1cr', label: '₹25 Lakh – 1 Crore' },
      { value: '1-5cr', label: '₹1 – 5 Crore' },
      { value: 'above-5cr', label: 'Above ₹5 Crore' },
    ], section: 'Business Details', validation: { required: true } },
    { key: 'employees', label: 'Number of Employees', labelHi: 'कर्मचारियों की संख्या', type: 'select', options: [
      { value: '0', label: 'Only me' },
      { value: '1-5', label: '1–5' },
      { value: '6-20', label: '6–20' },
      { value: '21-100', label: '21–100' },
      { value: '100-plus', label: '100+' },
    ], section: 'Business Details' },
    { key: 'startupStage', label: 'Business Stage', labelHi: 'व्यवसाय चरण', type: 'select', options: [
      { value: 'idea', label: 'Idea / Planning Stage' },
      { value: 'startup', label: 'Startup (< 3 years)' },
      { value: 'growth', label: 'Growth Stage (3–7 years)' },
      { value: 'established', label: 'Established (> 7 years)' },
    ], section: 'Business Details' },
    { key: 'womenOwned', label: 'Is this a women-led business?', labelHi: 'क्या यह महिला नेतृत्व वाला व्यवसाय है?', type: 'yesno', section: 'Business Details' },
    { key: 'digitalPayments', label: 'Do you accept digital payments?', labelHi: 'क्या आप डिजिटल भुगतान स्वीकार करते हैं?', type: 'yesno', section: 'Business Details' },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Financial Details', validation: { required: true } },
    { key: 'loanRequired', label: 'Do you require a business loan?', labelHi: 'क्या आपको व्यवसाय ऋण की आवश्यकता है?', type: 'yesno', section: 'Financial Details' },
    { key: 'existingLoan', label: 'Do you have an existing business loan?', labelHi: 'क्या आपके पास मौजूदा व्यावसायिक ऋण है?', type: 'yesno', section: 'Financial Details' },
    { key: 'mudraLoanBefore', label: 'Have you taken a Mudra loan before?', labelHi: 'क्या आपने पहले मुद्रा ऋण लिया है?', type: 'yesno', section: 'Financial Details' },
    { key: 'udyamRegistered', label: 'Do you have Udyam registration?', labelHi: 'क्या आपके पास उद्यम पंजीकरण है?', type: 'yesno', section: 'Financial Details' },
    { key: 'ruralUrban', label: 'Is your business in a rural or urban area?', labelHi: 'क्या आपका व्यवसाय ग्रामीण या शहरी क्षेत्र में है?', type: 'select', options: [
      { value: 'rural', label: 'Rural' },
      { value: 'urban', label: 'Urban' },
      { value: 'semi-urban', label: 'Semi-Urban' },
    ], section: 'Financial Details' },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Financial Details' },
  ],

  woman: [
    { key: 'maritalStatus', label: 'Marital Status', labelHi: 'वैवाहिक स्थिति', type: 'select', options: [
      { value: 'unmarried', label: 'Unmarried' },
      { value: 'married', label: 'Married' },
      { value: 'widow', label: 'Widow' },
      { value: 'divorced', label: 'Divorced / Separated' },
    ], section: 'Personal Details', validation: { required: true } },
    { key: 'pregnantLactating', label: 'Are you pregnant or lactating?', labelHi: 'क्या आप गर्भवती या स्तनपान करा रही हैं?', type: 'yesno', section: 'Personal Details', dependsOn: { key: 'maritalStatus', value: 'married' } },
    { key: 'working', label: 'Are you currently working?', labelHi: 'क्या आप वर्तमान में काम कर रही हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'shgMember', label: 'Are you a Self-Help Group member?', labelHi: 'क्या आप स्वयं सहायता समूह की सदस्य हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'skillTrainingInterest', label: 'Are you interested in skill training?', labelHi: 'क्या आप कौशल प्रशिक्षण में रुचि रखती हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'businessInterest', label: 'Are you interested in starting a business?', labelHi: 'क्या आप व्यवसाय शुरू करने में रुचि रखती हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'singleMother', label: 'Are you a single mother?', labelHi: 'क्या आप एकल माता हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'girlChildEducation', label: 'Do you need support for girl child education?', labelHi: 'क्या आपको बालिका शिक्षा के लिए सहायता चाहिए?', type: 'yesno', section: 'Personal Details' },
    { key: 'ruralUrban', label: 'Do you live in a rural or urban area?', labelHi: 'क्या आप ग्रामीण या शहरी क्षेत्र में रहती हैं?', type: 'select', options: [
      { value: 'rural', label: 'Rural' },
      { value: 'urban', label: 'Urban' },
    ], section: 'Personal Details' },
    { key: 'govtSchemeBefore', label: 'Have you used any government scheme before?', labelHi: 'क्या आपने पहले कोई सरकारी योजना का उपयोग किया है?', type: 'yesno', section: 'Personal Details' },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Personal Details', validation: { required: true } },
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 30', section: 'Personal Details', validation: { min: 18, max: 100 } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Personal Details' },
    { key: 'familyIncome', label: 'Annual Family Income', labelHi: 'वार्षिक पारिवारिक आय', type: 'select', options: INCOME_OPTIONS, section: 'Financial Details' },
  ],

  'senior-citizen': [
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 65', section: 'Personal Details', validation: { required: true, min: 50, max: 120 } },
    { key: 'receivingPension', label: 'Are you currently receiving a pension?', labelHi: 'क्या आप वर्तमान में पेंशन प्राप्त कर रहे हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'livingAlone', label: 'Are you living alone?', labelHi: 'क्या आप अकेले रहते हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'healthInsurance', label: 'Do you have health insurance?', labelHi: 'क्या आपके पास स्वास्थ्य बीमा है?', type: 'yesno', section: 'Personal Details' },
    { key: 'seniorCitizenCard', label: 'Do you have a Senior Citizen Card?', labelHi: 'क्या आपके पास वरिष्ठ नागरिक कार्ड है?', type: 'yesno', section: 'Personal Details' },
    { key: 'monthlyIncome', label: 'Monthly Income', labelHi: 'मासिक आय', type: 'select', options: INCOME_OPTIONS, section: 'Personal Details' },
    { key: 'dependentOnFamily', label: 'Are you dependent on family for support?', labelHi: 'क्या आप सहायता के लिए परिवार पर निर्भर हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'disability', label: 'Do you have any disability?', labelHi: 'क्या आपको कोई विकलांगता है?', type: 'yesno', section: 'Personal Details' },
    { key: 'medicalAssistance', label: 'Do you need medical assistance?', labelHi: 'क्या आपको चिकित्सा सहायता की आवश्यकता है?', type: 'yesno', section: 'Personal Details' },
    { key: 'bpl', label: 'Is your family Below Poverty Line?', labelHi: 'क्या आपका परिवार गरीबी रेखा से नीचे है?', type: 'yesno', section: 'Personal Details' },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Personal Details', validation: { required: true } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Personal Details' },
  ],

  homemaker: [
    { key: 'selfEmploymentInterest', label: 'Are you interested in self-employment?', labelHi: 'क्या आप स्वरोजगार में रुचि रखती हैं?', type: 'yesno', section: 'Personal Details', validation: { required: true } },
    { key: 'skillTrainingInterest', label: 'Are you interested in skill training?', labelHi: 'क्या आप कौशल प्रशिक्षण में रुचि रखती हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'householdIncome', label: 'Annual Household Income', labelHi: 'वार्षिक घरेलू आय', type: 'select', options: INCOME_OPTIONS, section: 'Personal Details' },
    { key: 'shgMember', label: 'Are you a Self-Help Group member?', labelHi: 'क्या आप स्वयं सहायता समूह की सदस्य हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'homeBusinessInterest', label: 'Are you interested in a home-based business?', labelHi: 'क्या आप गृह-आधारित व्यवसाय में रुचि रखती हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'skillsAvailable', label: 'What skills do you have?', labelHi: 'आपके पास कौन से कौशल हैं?', type: 'select', options: [
      { value: 'sewing', label: 'Sewing / Tailoring' },
      { value: 'cooking', label: 'Cooking / Catering' },
      { value: 'handicraft', label: 'Handicraft' },
      { value: 'beauty', label: 'Beauty & Wellness' },
      { value: 'teaching', label: 'Teaching / Tutoring' },
      { value: 'none', label: 'None of the above' },
    ], section: 'Personal Details' },
    { key: 'digitalLiteracy', label: 'What is your digital literacy level?', labelHi: 'आपकी डिजिटल साक्षरता स्तर क्या है?', type: 'select', options: [
      { value: 'none', label: 'No digital skills' },
      { value: 'basic', label: 'Basic (can use phone)' },
      { value: 'intermediate', label: 'Intermediate (can use internet)' },
      { value: 'advanced', label: 'Advanced (computer skills)' },
    ], section: 'Personal Details' },
    { key: 'loanRequired', label: 'Do you need a loan?', labelHi: 'क्या आपको ऋण की आवश्यकता है?', type: 'yesno', section: 'Personal Details' },
    { key: 'childrenStudying', label: 'Are your children studying?', labelHi: 'क्या आपके बच्चे पढ़ रहे हैं?', type: 'yesno', section: 'Personal Details' },
    { key: 'ruralUrban', label: 'Rural or Urban household?', labelHi: 'ग्रामीण या शहरी परिवार?', type: 'select', options: [
      { value: 'rural', label: 'Rural' },
      { value: 'urban', label: 'Urban' },
    ], section: 'Personal Details' },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Personal Details', validation: { required: true } },
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 35', section: 'Personal Details', validation: { min: 18, max: 100 } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Personal Details' },
  ],

  'disabled-person': [
    { key: 'disabilityType', label: 'Disability Type', labelHi: 'विकलांगता प्रकार', type: 'select', options: [
      { value: 'visual', label: 'Visual Impairment' },
      { value: 'hearing', label: 'Hearing Impairment' },
      { value: 'speech', label: 'Speech Disability' },
      { value: 'locomotor', label: 'Locomotor Disability' },
      { value: 'intellectual', label: 'Intellectual Disability' },
      { value: 'mental', label: 'Mental Illness' },
      { value: 'multiple', label: 'Multiple Disabilities' },
      { value: 'other', label: 'Other' },
    ], section: 'Disability Details', validation: { required: true } },
    { key: 'disabilityPercentage', label: 'Disability Percentage', labelHi: 'विकलांगता प्रतिशत', type: 'number', placeholder: 'e.g., 40', section: 'Disability Details', validation: { required: true, min: 0, max: 100 } },
    { key: 'udidCard', label: 'Do you have a UDID card?', labelHi: 'क्या आपके पास यूडीआईडी कार्ड है?', type: 'yesno', section: 'Disability Details' },
    { key: 'medicalCertificate', label: 'Do you have a medical certificate?', labelHi: 'क्या आपके पास चिकित्सा प्रमाण पत्र है?', type: 'yesno', section: 'Disability Details' },
    { key: 'employmentStatus', label: 'Employment Status', labelHi: 'रोजगार की स्थिति', type: 'select', options: [
      { value: 'employed', label: 'Employed' },
      { value: 'unemployed', label: 'Unemployed' },
      { value: 'self-employed', label: 'Self-Employed' },
      { value: 'student', label: 'Student' },
      { value: 'homemaker', label: 'Homemaker' },
    ], section: 'Disability Details' },
    { key: 'assistiveDevices', label: 'Do you require assistive devices?', labelHi: 'क्या आपको सहायक उपकरणों की आवश्यकता है?', type: 'yesno', section: 'Disability Details' },
    { key: 'educationStatus', label: 'Education Status', labelHi: 'शिक्षा की स्थिति', type: 'select', options: [
      { value: 'no-formal', label: 'No Formal Education' },
      { value: 'school', label: 'School Level' },
      { value: 'graduate', label: 'Graduate' },
      { value: 'postgraduate', label: 'Postgraduate' },
    ], section: 'Disability Details' },
    { key: 'monthlyIncome', label: 'Monthly Income', labelHi: 'मासिक आय', type: 'select', options: INCOME_OPTIONS, section: 'Disability Details' },
    { key: 'caregiverSupport', label: 'Do you need caregiver support?', labelHi: 'क्या आपको देखभाल करने वाले की आवश्यकता है?', type: 'yesno', section: 'Disability Details' },
    { key: 'skillTrainingInterest', label: 'Interested in skill training?', labelHi: 'क्या आप कौशल प्रशिक्षण में रुचि रखते हैं?', type: 'yesno', section: 'Disability Details' },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Personal Details', validation: { required: true } },
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 30', section: 'Personal Details', validation: { required: true, min: 1, max: 120 } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Personal Details' },
  ],

  'worker-labourer': [
    { key: 'workerType', label: 'Worker Type', labelHi: 'श्रमिक प्रकार', type: 'select', options: [
      { value: 'construction', label: 'Construction Worker' },
      { value: 'agricultural', label: 'Agricultural Labourer' },
      { value: 'factory', label: 'Factory Worker' },
      { value: 'domestic', label: 'Domestic Worker' },
      { value: 'transport', label: 'Transport Worker' },
      { value: 'gig', label: 'Gig Worker' },
      { value: 'other', label: 'Other' },
    ], section: 'Work Details', validation: { required: true } },
    { key: 'wageType', label: 'Are you a daily-wage or salaried worker?', labelHi: 'क्या आप दैनिक मजदूरी या वेतनभोगी हैं?', type: 'select', options: [
      { value: 'daily-wage', label: 'Daily Wage' },
      { value: 'monthly-salaried', label: 'Monthly Salaried' },
      { value: 'contract', label: 'Contract Based' },
    ], section: 'Work Details' },
    { key: 'labourCard', label: 'Do you have a registered labour card?', labelHi: 'क्या आपके पास पंजीकृत श्रम कार्ड है?', type: 'yesno', section: 'Work Details' },
    { key: 'constructionWorker', label: 'Are you a construction worker?', labelHi: 'क्या आप निर्माण श्रमिक हैं?', type: 'yesno', section: 'Work Details' },
    { key: 'migrantWorker', label: 'Are you a migrant worker?', labelHi: 'क्या आप प्रवासी श्रमिक हैं?', type: 'yesno', section: 'Work Details' },
    { key: 'eshramCard', label: 'Do you have an e-Shram card?', labelHi: 'क्या आपके पास ई-श्रम कार्ड है?', type: 'yesno', section: 'Work Details' },
    { key: 'skillCertified', label: 'Do you have any skill certification?', labelHi: 'क्या आपके पास कोई कौशल प्रमाणन है?', type: 'yesno', section: 'Work Details' },
    { key: 'healthInsurance', label: 'Do you have health insurance?', labelHi: 'क्या आपके पास स्वास्थ्य बीमा है?', type: 'yesno', section: 'Work Details' },
    { key: 'seasonalWorker', label: 'Are you a seasonal worker?', labelHi: 'क्या आप मौसमी श्रमिक हैं?', type: 'yesno', section: 'Work Details' },
    { key: 'dependents', label: 'Number of family dependents', labelHi: 'परिवार में आश्रितों की संख्या', type: 'number', placeholder: 'e.g., 3', section: 'Work Details', validation: { min: 0, max: 20 } },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'Work Details', validation: { required: true } },
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 35', section: 'Work Details', validation: { required: true, min: 14, max: 100 } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'Work Details' },
    { key: 'familyIncome', label: 'Annual Family Income', labelHi: 'वार्षिक पारिवारिक आय', type: 'select', options: INCOME_OPTIONS, section: 'Work Details' },
  ],

  other: [
    { key: 'currentOccupation', label: 'Your Current Occupation', labelHi: 'आपका वर्तमान व्यवसाय', type: 'text', placeholder: 'e.g., Retired, Volunteer', section: 'General Details', validation: { required: true } },
    { key: 'mainRequirement', label: 'Your Main Requirement', labelHi: 'आपकी मुख्य आवश्यकता', type: 'select', options: [
      { value: 'financial-help', label: 'Financial Assistance' },
      { value: 'education', label: 'Education Support' },
      { value: 'health', label: 'Healthcare' },
      { value: 'housing', label: 'Housing' },
      { value: 'employment', label: 'Employment' },
      { value: 'business', label: 'Business Support' },
      { value: 'pension', label: 'Pension' },
      { value: 'other', label: 'Other' },
    ], section: 'General Details', validation: { required: true } },
    { key: 'educationLevel', label: 'Education Level', labelHi: 'शिक्षा स्तर', type: 'select', options: [
      { value: 'no-formal', label: 'No Formal Education' },
      { value: 'primary', label: 'Primary (5th Pass)' },
      { value: 'secondary', label: 'Secondary (10th Pass)' },
      { value: 'higher-secondary', label: 'Higher Secondary (12th Pass)' },
      { value: 'graduate', label: 'Graduate' },
      { value: 'postgraduate', label: 'Postgraduate' },
    ], section: 'General Details' },
    { key: 'incomeRange', label: 'Annual Income Range', labelHi: 'वार्षिक आय सीमा', type: 'select', options: INCOME_OPTIONS, section: 'General Details' },
    { key: 'interestedSchemeTypes', label: 'Which scheme types interest you?', labelHi: 'आपको किस प्रकार की योजनाओं में रुचि है?', type: 'select', options: [
      { value: 'education', label: 'Education / Scholarship' },
      { value: 'health', label: 'Health / Medical' },
      { value: 'housing', label: 'Housing' },
      { value: 'employment', label: 'Employment / Skill' },
      { value: 'business', label: 'Business / Startup' },
      { value: 'pension', label: 'Pension / Social Security' },
      { value: 'subsidy', label: 'Subsidy / Financial' },
    ], section: 'General Details' },
    { key: 'govtBenefitsBefore', label: 'Have you used government benefits before?', labelHi: 'क्या आपने पहले सरकारी लाभों का उपयोग किया है?', type: 'yesno', section: 'General Details' },
    { key: 'ruralUrban', label: 'Rural or Urban area?', labelHi: 'ग्रामीण या शहरी क्षेत्र?', type: 'select', options: [
      { value: 'rural', label: 'Rural' },
      { value: 'urban', label: 'Urban' },
    ], section: 'General Details' },
    { key: 'skillTrainingInterest', label: 'Are you interested in skill training?', labelHi: 'क्या आप कौशल प्रशिक्षण में रुचि रखते हैं?', type: 'yesno', section: 'General Details' },
    { key: 'businessEmploymentInterest', label: 'Are you interested in business or employment?', labelHi: 'क्या आप व्यवसाय या रोजगार में रुचि रखते हैं?', type: 'yesno', section: 'General Details' },
    { key: 'specialAssistance', label: 'Do you need any special assistance?', labelHi: 'क्या आपको किसी विशेष सहायता की आवश्यकता है?', type: 'text', placeholder: 'e.g., Medical equipment, Legal aid', section: 'General Details' },
    { key: 'state', label: 'State', labelHi: 'राज्य', type: 'select', options: INDIAN_STATES, section: 'General Details' },
    { key: 'age', label: 'Your Age', labelHi: 'आपकी आयु', type: 'age', placeholder: 'e.g., 40', section: 'General Details', validation: { min: 1, max: 120 } },
    { key: 'category', label: 'Category', labelHi: 'श्रेणी', type: 'select', options: CATEGORY_OPTIONS, section: 'General Details' },
    { key: 'gender', label: 'Gender', labelHi: 'लिंग', type: 'select', options: GENDER_OPTIONS, section: 'General Details' },
  ],
};

export function getQuestionsForOccupation(occupation: OccupationKey): Question[] {
  return OCCUPATION_QUESTIONS[occupation] || OCCUPATION_QUESTIONS.other;
}

export function getSectionsForOccupation(occupation: OccupationKey): string[] {
  const questions = getQuestionsForOccupation(occupation);
  const sections = [...new Set(questions.map(q => q.section))];
  return sections;
}

export function getQuestionsForSection(occupation: OccupationKey, section: string): Question[] {
  return getQuestionsForOccupation(occupation).filter(q => q.section === section);
}

export function parseIncomeValue(key: string): number {
  const map: Record<string, number> = {
    'below-1lakh': 100000,
    '1-2.5lakh': 250000,
    '2.5-5lakh': 500000,
    '5-10lakh': 1000000,
    'above-10lakh': 1500000,
  };
  return map[key] || 0;
}

export function parseIncomeMinMax(key: string): { min: number; max: number } {
  const map: Record<string, { min: number; max: number }> = {
    'below-1lakh': { min: 0, max: 100000 },
    '1-2.5lakh': { min: 100000, max: 250000 },
    '2.5-5lakh': { min: 250000, max: 500000 },
    '5-10lakh': { min: 500000, max: 1000000 },
    'above-10lakh': { min: 1000000, max: Infinity },
  };
  return map[key] || { min: 0, max: Infinity };
}

export function parseMarksValue(marksStr: string): number {
  const cleaned = marksStr.replace(/%/g, '').trim();
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (num <= 10 && cleaned.includes('.')) return num * 10;
  return num;
}
