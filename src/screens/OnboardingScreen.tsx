import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OCCUPATIONS } from '../types/profile';
import type { Occupation } from '../types/profile';
import type { AnswerMap, Question, OccupationKey } from '../types/eligibility';
import { getSectionsForOccupation, getQuestionsForSection, getQuestionsForOccupation, parseIncomeValue, parseMarksValue } from '../types/eligibility';

function SelectOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 rounded-xl text-left font-medium text-sm transition-all duration-200 ${
        selected
          ? 'shadow-md'
          : 'hover:shadow-sm'
      }`}
      style={{
        background: selected ? 'linear-gradient(135deg, #FF6B35, #E55A25)' : 'rgba(255,255,255,0.08)',
        color: selected ? 'white' : 'rgba(255,255,255,0.8)',
        border: selected ? 'none' : '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {label}
    </button>
  );
}

function YesNoOption({
  value,
  selected,
  onClick,
}: {
  value: string;
  selected: boolean;
  onClick: () => void;
}) {
  const label = value === 'yes' ? 'Yes' : 'No';
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
        selected
          ? 'shadow-md'
          : 'hover:shadow-sm opacity-70 hover:opacity-100'
      }`}
      style={{
        background: selected ? 'linear-gradient(135deg, #FF6B35, #E55A25)' : 'rgba(255,255,255,0.08)',
        color: selected ? 'white' : 'rgba(255,255,255,0.8)',
        border: selected ? 'none' : '1px solid rgba(255,255,255,0.12)',
      }}
    >
      {label}
    </button>
  );
}

function validateAnswer(question: Question, value: string): string | null {
  if (!question.validation) return null;
  if (question.validation.required && (!value || value.trim() === '')) {
    return 'This field is required';
  }
  if (value && value.trim() !== '') {
    if (question.type === 'percentage' || question.type === 'number' || question.type === 'age') {
      const num = parseFloat(value);
      if (isNaN(num)) return 'Please enter a valid number';
      if (question.validation.min !== undefined && num < question.validation.min) {
        return `Minimum value is ${question.validation.min}`;
      }
      if (question.validation.max !== undefined && num > question.validation.max) {
        return `Maximum value is ${question.validation.max}`;
      }
    }
  }
  return null;
}

export function OnboardingScreen() {
  const { completeOnboarding, setScreen } = useApp();

  const [step, setStep] = useState(0);
  const [occupation, setOccupation] = useState<Occupation | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const occKey = occupation as OccupationKey | null;

  const sections = useMemo(() => {
    if (!occKey) return [];
    return getSectionsForOccupation(occKey);
  }, [occKey]);

  // needs at least one statement before inline usage
  const questions = occKey ? getQuestionsForOccupation(occKey) : [];

  // Map sections to steps: step 0 is occupation, steps 1..N are sections
  const sectionIndex = step - 1; // 0-based index into sections array
  const currentSection = sections[sectionIndex] || '';
  const totalSteps = sections.length + 1; // +1 for occupation step

  const visibleQuestions = useMemo(() => {
    if (!currentSection) return [];
    const all = getQuestionsForSection(occKey!, currentSection);
    return all.filter(q => {
      if (!q.dependsOn) return true;
      const depVal = answers[q.dependsOn.key];
      return depVal === q.dependsOn.value;
    });
  }, [occKey, currentSection, answers]);

  const isLastStep = step === totalSteps - 1;
  const progress = ((step) / (totalSteps - 1)) * 100;
  const stepLabel = step === 0 ? 'Choose Occupation' : `${currentSection} (${step}/${totalSteps - 1})`;

  function setAnswer(key: string, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};
    for (const q of visibleQuestions) {
      const err = validateAnswer(q, answers[q.key] || '');
      if (err) newErrors[q.key] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (step === 0 && !occupation) return;
    if (step > 0 && !validateStep()) return;
    if (isLastStep) {
      handleComplete();
      return;
    }
    setStep(s => s + 1);
  }

  function handleBack() {
    if (step === 0) {
      setScreen('login');
      return;
    }
    setStep(s => s - 1);
  }

  async function handleComplete() {
    if (!occupation) return;
    // Validate all answers one more time
    for (const q of questions) {
      if (q.dependsOn) {
        const depVal = answers[q.dependsOn.key];
        if (depVal !== q.dependsOn.value) continue;
      }
      const err = validateAnswer(q, answers[q.key] || '');
      if (err) {
        setErrors(prev => ({ ...prev, [q.key]: err }));
        // Find which section this question belongs to and navigate there
        const secIdx = sections.indexOf(q.section);
        setStep(secIdx + 1);
        return;
      }
    }
    await completeOnboarding(occupation, answers);
  }

  function handleOccupationSelect(occ: Occupation) {
    setOccupation(occ);
    setStep(1);
  }

  const renderOccupationStep = () => (
    <div className="px-5 pt-6 pb-8">
      <h1 className="text-white font-black text-2xl mb-2">What describes you best?</h1>
      <p className="text-white/50 text-sm mb-6">Choose your occupation to find matching schemes</p>
      <div className="grid grid-cols-2 gap-3">
        {OCCUPATIONS.map(occ => (
          <button
            key={occ.id}
            onClick={() => handleOccupationSelect(occ.id)}
            className="group relative p-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.97] hover:-translate-y-0.5"
            style={{
              background: occupation === occ.id
                ? 'linear-gradient(135deg, rgba(255,107,53,0.3), rgba(229,90,37,0.2))'
                : 'rgba(255,255,255,0.06)',
              border: occupation === occ.id
                ? '2px solid #FF6B35'
                : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span className="text-2xl block mb-2">{occ.emoji}</span>
            <p className="text-white font-bold text-sm leading-tight">{occ.label}</p>
            <p className="text-white/40 text-[10px] mt-0.5 leading-tight">{occ.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderQuestionInput = (q: Question) => {
    const value = answers[q.key] || '';
    const error = errors[q.key];

    if (q.type === 'select' && q.options) {
      return (
        <div className="space-y-2">
          {q.options.map(opt => (
            <SelectOption
              key={opt.value}
              label={opt.label}
              selected={value === opt.value}
              onClick={() => setAnswer(q.key, opt.value)}
            />
          ))}
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    if (q.type === 'yesno') {
      return (
        <div className="space-y-2">
          <div className="flex gap-3">
            <YesNoOption
              value="yes"
              selected={value === 'yes'}
              onClick={() => setAnswer(q.key, 'yes')}
            />
            <YesNoOption
              value="no"
              selected={value === 'no'}
              onClick={() => setAnswer(q.key, 'no')}
            />
          </div>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <input
          type={q.type === 'age' || q.type === 'number' || q.type === 'percentage' ? 'number' : 'text'}
          inputMode={q.type === 'age' || q.type === 'number' || q.type === 'percentage' ? 'numeric' : 'text'}
          placeholder={q.placeholder || `Enter ${q.label.toLowerCase()}`}
          value={value}
          onChange={e => setAnswer(q.key, e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl text-white text-sm font-medium placeholder:text-white/30 outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/50"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  const renderQuestionStep = () => {
    if (!visibleQuestions.length) {
      // Section has no visible questions (all conditional), skip to next
      setTimeout(() => handleNext(), 0);
      return null;
    }

    return (
      <div className="px-5 pt-6 pb-32">
        <h2 className="text-white font-black text-xl mb-1">{currentSection}</h2>
        <p className="text-white/40 text-xs mb-6">
          Step {step} of {totalSteps - 1}
        </p>
        <div className="space-y-6">
          {visibleQuestions.map(q => (
            <div key={q.key}>
              <label className="block text-white font-semibold text-sm mb-2.5">
                {q.label}
                {q.validation?.required && <span className="text-orange-400 ml-0.5">*</span>}
              </label>
              {renderQuestionInput(q)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0D1F4E 0%, #1A3A6B 40%, #2E5BA8 100%)',
      }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #FF6B35, #FF8C5A)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <ChevronLeft size={20} color="white" />
        </button>
        <span className="text-white/50 text-xs font-medium">{stepLabel}</span>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {step === 0 ? renderOccupationStep() : renderQuestionStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      {step > 0 && (
        <div className="sticky bottom-0 px-5 py-4" style={{ background: 'linear-gradient(transparent, #0D1F4E 30%)' }}>
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all duration-200 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #E55A25)',
              color: 'white',
            }}
          >
            {isLastStep ? (
              <>
                <Check size={18} />
                Complete & Find Schemes
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
