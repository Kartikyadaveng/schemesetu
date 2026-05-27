import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OCCUPATIONS, INDIAN_STATES, type Occupation } from '../types/profile';

function SelectField({ label, value, options, onChange, isDark }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; isDark: boolean;
}) {
  return (
    <div>
      <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${
              value === o.value
                ? 'bg-orange-500 text-white'
                : isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-50 text-gray-600 border border-gray-200'
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
      <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none border transition-all focus:border-orange-400/50 ${
          isDark ? 'bg-gray-800 text-white border-gray-700 placeholder:text-gray-500' : 'bg-gray-50 text-gray-800 border-gray-200 placeholder:text-gray-400'
        }`}
      />
    </div>
  );
}

export function EditProfileScreen() {
  const { isDark, setScreen, userProfile, refreshProfile, user } = useApp();
  const [occupation, setOccupation] = useState<Occupation | ''>(userProfile?.occupation || '');
  const [details, setDetails] = useState<Record<string, string>>(userProfile?.profileDetails || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !occupation) return;
    setSaving(true);
    try {
      const { saveOnboardingData } = await import('../services/firestoreService');
      await saveOnboardingData(user.uid, {
        occupation,
        profileDetails: details,
        completedOnboarding: true,
      });
      await refreshProfile();
      setScreen('profile');
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background: 'linear-gradient(160deg, #1A3A6B, #2E5BA8)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setScreen('profile')} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <ChevronLeft size={20} color="white" />
          </button>
          <div>
            <h1 className="text-white font-black text-lg">Edit Profile</h1>
            <p className="text-white/60 text-xs">Update your preferences</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4 pb-24">
        <div className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-sm`}>
          <p className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Occupation</p>
          <div className="grid grid-cols-2 gap-2">
            {OCCUPATIONS.map(o => (
              <button
                key={o.id}
                onClick={() => setOccupation(o.id)}
                className={`p-3 rounded-xl text-left transition-all active:scale-95 ${
                  occupation === o.id
                    ? 'bg-orange-500 text-white'
                    : isDark ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'
                }`}
              >
                <span className="text-lg">{o.emoji}</span>
                <p className="text-xs font-bold mt-0.5">{o.label}</p>
              </button>
            ))}
          </div>
        </div>

        {occupation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-4 space-y-4 ${isDark ? 'bg-gray-800 border border-gray-700/50' : 'bg-white border border-gray-100'} shadow-sm`}
          >
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Your Details</p>

            <SelectField
              label="State"
              value={details['state'] || ''}
              options={INDIAN_STATES.map(s => ({ value: s, label: s }))}
              onChange={v => setDetails(d => ({ ...d, state: v }))}
              isDark={isDark}
            />

            {Object.keys(details).filter(k => k !== 'state').map(key => (
              <InputField
                key={key}
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                value={details[key] || ''}
                onChange={v => setDetails(d => ({ ...d, [key]: v }))}
                placeholder={`Enter ${key}`}
                isDark={isDark}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
        <button
          onClick={handleSave}
          disabled={!occupation || saving}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            occupation && !saving
              ? 'text-white shadow-lg'
              : isDark ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400'
          }`}
          style={occupation && !saving ? { background: 'linear-gradient(135deg, #FF6B35, #E55A25)' } : {}}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
