export type Occupation =
  | 'student'
  | 'farmer'
  | 'job-seeker'
  | 'business-owner'
  | 'woman'
  | 'senior-citizen'
  | 'homemaker'
  | 'disabled-person'
  | 'worker-labourer'
  | 'other';

export const OCCUPATIONS: { id: Occupation; label: string; labelHi: string; emoji: string; description: string }[] = [
  { id: 'student',         label: 'Student',        labelHi: 'छात्र',          emoji: '📚', description: 'School, college or vocational student' },
  { id: 'farmer',          label: 'Farmer',          labelHi: 'किसान',          emoji: '🌾', description: 'Agricultural worker or landowner' },
  { id: 'job-seeker',      label: 'Job Seeker',      labelHi: 'नौकरी चाहने वाला', emoji: '💼', description: 'Looking for employment' },
  { id: 'business-owner',  label: 'Business Owner',  labelHi: 'व्यवसायी',       emoji: '🏪', description: 'Own a business or startup' },
  { id: 'woman',           label: 'Woman',           labelHi: 'महिला',          emoji: '👩', description: 'Women-specific schemes' },
  { id: 'senior-citizen',  label: 'Senior Citizen',  labelHi: 'वरिष्ठ नागरिक',   emoji: '👴', description: 'Age 60 years or above' },
  { id: 'homemaker',       label: 'Homemaker',       labelHi: 'गृहिणी',         emoji: '🏠', description: 'Household management' },
  { id: 'disabled-person', label: 'Disabled Person', labelHi: 'दिव्यांग व्यक्ति', emoji: '♿', description: 'Person with disability' },
  { id: 'worker-labourer', label: 'Worker/Labourer', labelHi: 'मजदूर',          emoji: '🔧', description: 'Daily wage or skilled worker' },
  { id: 'other',           label: 'Other',           labelHi: 'अन्य',           emoji: '👤', description: 'Prefer not to specify' },
];

export interface StudentProfile {
  course: string;
  collegeType: 'government' | 'private' | 'aided';
  state: string;
  marks: string;
  entranceExamScore: string;
  familyIncome: string;
  category: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  gender: 'male' | 'female' | 'other';
  disability: 'yes' | 'no';
  hosteller: 'yes' | 'no';
}

export interface FarmerProfile {
  state: string;
  landSize: string;
  annualIncome: string;
  irrigation: 'yes' | 'no' | 'partial';
  cropType: string;
  farmerCategory: 'marginal' | 'small' | 'medium' | 'large';
  aadhaarLinkedBank: 'yes' | 'no';
  pmKisanRegistered: 'yes' | 'no';
}

export interface BusinessProfile {
  businessType: string;
  annualTurnover: string;
  state: string;
  msmeRegistered: 'yes' | 'no';
  gstRegistered: 'yes' | 'no';
  startupAge: string;
  womenOwned: 'yes' | 'no';
}

export interface JobSeekerProfile {
  highestQualification: string;
  skills: string;
  state: string;
  employmentStatus: 'employed' | 'unemployed' | 'freelancer';
  age: string;
  experienceLevel: 'fresher' | 'mid-level' | 'experienced';
}

export type ProfileDetails =
  | { occupation: 'student'; details: StudentProfile }
  | { occupation: 'farmer'; details: FarmerProfile }
  | { occupation: 'business-owner'; details: BusinessProfile }
  | { occupation: 'job-seeker'; details: JobSeekerProfile }
  | { occupation: 'woman' | 'senior-citizen' | 'homemaker' | 'disabled-person' | 'worker-labourer' | 'other'; details: Record<string, string> };

export interface UserProfile {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  photoURL?: string;
  occupation?: Occupation;
  profileDetails?: ProfileDetails['details'];
  completedOnboarding: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli',
  'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const INCOME_OPTIONS = [
  { value: 'below-1lakh', label: 'Below ₹1 Lakh' },
  { value: '1-2.5lakh', label: '₹1 - 2.5 Lakh' },
  { value: '2.5-5lakh', label: '₹2.5 - 5 Lakh' },
  { value: '5-10lakh', label: '₹5 - 10 Lakh' },
  { value: 'above-10lakh', label: 'Above ₹10 Lakh' },
];

export function getRecommendedCategories(occupation: Occupation): string[] {
  const map: Record<Occupation, string[]> = {
    student:            ['students', 'education', 'skill-development', 'health'],
    farmer:             ['farmers', 'subsidy', 'pension', 'health'],
    'job-seeker':       ['jobs', 'skill-development', 'education', 'health'],
    'business-owner':   ['business', 'startup', 'subsidy', 'skill-development'],
    woman:              ['women', 'health', 'education', 'housing'],
    'senior-citizen':   ['senior', 'pension', 'health', 'housing'],
    homemaker:          ['women', 'health', 'education', 'housing'],
    'disabled-person':  ['disability', 'health', 'education', 'skill-development'],
    'worker-labourer':  ['jobs', 'skill-development', 'health', 'housing'],
    other:              ['health', 'education', 'jobs', 'housing'],
  };
  return map[occupation] || ['health', 'education'];
}
