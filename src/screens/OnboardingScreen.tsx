import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { useApp, type UserProfileData } from '../context/AppContext';
import { OCCUPATIONS, INDIAN_STATES, type Occupation } from '../types/profile';

const stepVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

interface Option {
  value: string;
  label: string;
}

function SelectField({ label, value, options, onChange, isDark }: {
  label: string; value: string; options: Option[]; onChange: (v: string) => void; isDark: boolean;
}) {
  return (
    <div>
      <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map(o => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`py-3 px-3 rounded-2xl text-sm font-medium text-left transition-all active:scale-[0.97] ${
              value === o.value
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : isDark
                  ? 'bg-gray-800 text-gray-300 border border-gray-700'
                  : 'bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, isDark, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; isDark: boolean; type?: string;
}) {
  return (
    <div>
      <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</p>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3.5 rounded-2xl text-sm font-medium outline-none border-2 transition-all focus:border-orange-400/50 ${
          isDark
            ? 'bg-gray-800 text-white border-gray-700 placeholder:text-gray-500'
            : 'bg-gray-50 text-gray-800 border-gray-200 placeholder:text-gray-400'
        }`}
      />
    </div>
  );
}

function buildQuestions(occupation: Occupation): { key: string; label: string; type: 'select' | 'input'; options?: Option[]; placeholder?: string }[] {
  const base = [
    { key: 'state', label: 'State', type: 'select' as const, options: INDIAN_STATES.map(s => ({ value: s, label: s })) },
  ];
  const incomeOptions = [
    { value: 'below-1lakh', label: 'Below ₹1 Lakh' },
    { value: '1-2.5lakh', label: '₹1 - 2.5 Lakh' },
    { value: '2.5-5lakh', label: '₹2.5 - 5 Lakh' },
    { value: '5-10lakh', label: '₹5 - 10 Lakh' },
    { value: 'above-10lakh', label: 'Above ₹10 Lakh' },
  ];

  switch (occupation) {
    case 'student':
      return [
        { key: 'course', label: 'Class / Course', type: 'input', placeholder: 'e.g., Class 12, B.Sc, Engineering' },
        { key: 'collegeType', label: 'College Type', type: 'select', options: [
          { value: 'government', label: 'Government' }, { value: 'private', label: 'Private' }, { value: 'aided', label: 'Aided' },
        ]},
        ...base,
        { key: 'marks', label: 'Marks / Percentage / CGPA', type: 'input', placeholder: 'e.g., 85%, 8.5 CGPA' },
        { key: 'entranceExamScore', label: 'Entrance Exam Score (optional)', type: 'input', placeholder: 'e.g., JEE 95%ile, NEET 600' },
        { key: 'familyIncome', label: 'Family Income', type: 'select', options: incomeOptions },
        { key: 'category', label: 'Category', type: 'select', options: [
          { value: 'general', label: 'General' }, { value: 'obc', label: 'OBC' }, { value: 'sc', label: 'SC' },
          { value: 'st', label: 'ST' }, { value: 'ews', label: 'EWS' },
        ]},
        { key: 'gender', label: 'Gender', type: 'select', options: [
          { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' },
        ]},
        { key: 'disability', label: 'Disability Status', type: 'select', options: [
          { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' },
        ]},
        { key: 'hosteller', label: 'Hosteller or Day Scholar', type: 'select', options: [
          { value: 'day-scholar', label: 'Day Scholar' }, { value: 'hosteller', label: 'Hosteller' },
        ]},
      ];
    case 'farmer':
      return [
        ...base,
        { key: 'landSize', label: 'Land Ownership Size', type: 'input', placeholder: 'e.g., 2 acres, 5 hectares' },
        { key: 'annualIncome', label: 'Annual Income', type: 'select', options: incomeOptions },
        { key: 'irrigation', label: 'Irrigation Availability', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'partial', label: 'Partial' },
        ]},
        { key: 'cropType', label: 'Crop Type', type: 'input', placeholder: 'e.g., Wheat, Rice, Sugarcane' },
        { key: 'farmerCategory', label: 'Farmer Category', type: 'select', options: [
          { value: 'marginal', label: 'Marginal (<1 ha)' }, { value: 'small', label: 'Small (1-2 ha)' },
          { value: 'medium', label: 'Medium (2-10 ha)' }, { value: 'large', label: 'Large (>10 ha)' },
        ]},
        { key: 'aadhaarLinkedBank', label: 'Aadhaar Linked Bank Account?', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
        ]},
        { key: 'pmKisanRegistered', label: 'PM-Kisan Registered?', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
        ]},
      ];
    case 'business-owner':
      return [
        { key: 'businessType', label: 'Business Type', type: 'input', placeholder: 'e.g., Retail, Manufacturing, Services' },
        { key: 'annualTurnover', label: 'Annual Turnover', type: 'select', options: [
          { value: 'below-10lakh', label: 'Below ₹10 Lakh' },
          { value: '10-50lakh', label: '₹10 - 50 Lakh' },
          { value: '50lakh-2cr', label: '₹50 Lakh - 2 Cr' },
          { value: 'above-2cr', label: 'Above ₹2 Crore' },
        ]},
        ...base,
        { key: 'msmeRegistered', label: 'MSME Registered?', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
        ]},
        { key: 'gstRegistered', label: 'GST Registered?', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
        ]},
        { key: 'startupAge', label: 'Startup Age', type: 'select', options: [
          { value: '0-1', label: '0-1 Year' }, { value: '1-3', label: '1-3 Years' },
          { value: '3-5', label: '3-5 Years' }, { value: 'above-5', label: 'Above 5 Years' },
        ]},
        { key: 'womenOwned', label: 'Women-Owned Business?', type: 'select', options: [
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
        ]},
      ];
    case 'job-seeker':
      return [
        { key: 'highestQualification', label: 'Highest Qualification', type: 'input', placeholder: 'e.g., B.Tech, MA, ITI' },
        { key: 'skills', label: 'Skills', type: 'input', placeholder: 'e.g., Coding, Teaching, Plumbing' },
        ...base,
        { key: 'employmentStatus', label: 'Employment Status', type: 'select', options: [
          { value: 'employed', label: 'Employed' }, { value: 'unemployed', label: 'Unemployed' },
          { value: 'freelancer', label: 'Freelancer' },
        ]},
          { key: 'age', label: 'Age', type: 'input', placeholder: 'e.g., 25' },
        { key: 'experienceLevel', label: 'Experience Level', type: 'select', options: [
          { value: 'fresher', label: 'Fresher (0-1 yr)' }, { value: 'mid-level', label: 'Mid-Level (2-5 yrs)' },
          { value: 'experienced', label: 'Experienced (5+ yrs)' },
        ]},
      ];
    default:
      return [
        ...base,
        { key: 'additionalInfo', label: 'Tell us more about yourself (optional)', type: 'input', placeholder: 'Any relevant details...' },
      ];
  }
}

export function OnboardingScreen() {
  const { isDark, setScreen, user, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = useMemo(() => occupation ? buildQuestions(occupation) : [], [occupation]);

  const totalSteps = occupation ? 1 + questions.length : 1;
  const currentStep = occupation ? 1 + questions.filter((_, i) => answers[_.key] !== undefined).length : 0;
  const progress = totalSteps > 0 ? Math.min((step / (totalSteps)) * 100, 100) : 0;

  const canProceed = () => {
    if (step === 0) return occupation !== null;
    const q = questions[step - 1];
    if (!q) return true;
    return answers[q.key]?.trim().length > 0;
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    } else {
      setScreen('home');
    }
  };

  const handleComplete = async () => {
    await completeOnboarding(occupation!, answers);
  };

  const updateAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background: 'linear-gradient(160deg, #1A3A6B 0%, #2E5BA8 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <div className="flex-1">
            <p className="text-white/60 text-xs font-medium">
              Step {step + 1} of {totalSteps}
            </p>
            <div className="w-full h-1.5 rounded-full mt-1.5" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%`, background: '#FF6B35' }}
              />
            </div>
          </div>
        </div>

        <h1 className="text-white font-black text-xl mt-2">
          {step === 0 ? 'Set Up Your Profile' : 'Tell Us More'}
        </h1>
        <p className="text-white/60 text-sm mt-1">
          {step === 0
            ? 'Help us find the best schemes for you'
            : `Answer a few questions about yourself`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="occupation"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <p className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                What best describes you?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {OCCUPATIONS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setOccupation(o.id)}
                    className={`relative p-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.97] ${
                      occupation === o.id
                        ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30 scale-[1.02]'
                        : isDark
                          ? 'bg-gray-800 text-gray-200 border border-gray-700 hover:border-orange-500/30'
                          : 'bg-white text-gray-800 border border-gray-100 hover:border-orange-200 shadow-sm'
                    }`}
                  >
                    {occupation === o.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Check size={12} color="white" strokeWidth={3} />
                      </div>
                    )}
                    <div className="text-2xl mb-2">{o.emoji}</div>
                    <p className="font-bold text-sm">{o.label}</p>
                    <p className={`text-[11px] mt-0.5 ${occupation === o.id ? 'text-white/70' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {o.description}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            questions.map((q, i) => (
              step - 1 === i && (
                <motion.div
                  key={q.key}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div
                    className={`rounded-2xl p-5 ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-sm`}
                  >
                    {q.type === 'select' ? (
                      <SelectField
                        label={q.label}
                        value={answers[q.key] || ''}
                        options={q.options || []}
                        onChange={v => updateAnswer(q.key, v)}
                        isDark={isDark}
                      />
                    ) : (
                      <InputField
                        label={q.label}
                        value={answers[q.key] || ''}
                        onChange={v => updateAnswer(q.key, v)}
                        placeholder={q.placeholder}
                        isDark={isDark}
                      />
                    )}
                  </div>

                  <div className="flex justify-center gap-2 flex-wrap">
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {answers[questions[i]?.key] && (
                        <span className="inline-flex items-center gap-1">
                          ✓ Answered
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            ))
          )}
        </AnimatePresence>
      </div>

      <div className={`px-4 py-4 border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            canProceed()
              ? 'text-white shadow-lg'
              : isDark ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400'
          }`}
          style={canProceed() ? { background: 'linear-gradient(135deg, #FF6B35, #E55A25)' } : {}}
        >
          {step < questions.length ? (
            <>
              Continue
              <ChevronRight size={18} />
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Complete Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
}
