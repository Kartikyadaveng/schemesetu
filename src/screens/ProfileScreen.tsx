// ============================================================
// SchemeSetu - Profile Screen
// User profile, settings, language, dark mode, logout
// ============================================================

import {
  User, Globe, Moon, Sun, LogOut, ChevronRight,
  Shield, HelpCircle, Share2, Star, Info,
  Bell, Bookmark, Sparkles, Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { LANGUAGES } from '../constants/dummyData';
import { OCCUPATIONS } from '../types/profile';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function ProfileScreen() {
  const {
    user, userProfile, logout, isDark, toggleTheme,
    language, setLanguage, isDark: dark,
    savedSchemes, setScreen
  } = useApp();

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const occupation = userProfile?.occupation;
  const occLabel = OCCUPATIONS.find(o => o.id === occupation)?.label;
  const occEmoji = OCCUPATIONS.find(o => o.id === occupation)?.emoji || '👤';

  // Generate avatar initials
  const initials = user?.name
    ?.split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'G';

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      {/* Header with avatar */}
      <div
        className="px-5 pt-12 pb-8"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #0D1F4E, #1A3A6B)'
            : 'linear-gradient(160deg, #1A3A6B, #2E5BA8)',
          borderBottomLeftRadius: '40px',
          borderBottomRightRadius: '40px',
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="w-20 h-20 rounded-3xl object-cover"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
              >
                {initials}
              </div>
            )}

            {/* Guest badge */}
            {user?.isGuest && (
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-white text-[10px] font-bold whitespace-nowrap"
                style={{ background: 'rgba(255,107,53,0.8)' }}
              >
                GUEST
              </div>
            )}

            {/* Provider badge */}
            {user?.provider === 'google' && (
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'white' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            )}
          </motion.div>

          {/* Name & email */}
          <div className="text-center">
            <h1 className="text-white font-black text-xl">{user?.name || 'Guest User'}</h1>
            <p className="text-white/60 text-sm mt-0.5">{user?.email}</p>
          </div>

          {/* Quick stats */}
          {occupation && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,107,53,0.2)', color: '#FFD4B8' }}>
              <span>{occEmoji}</span>
              <span>{occLabel}</span>
            </div>
          )}

          <div className="flex gap-8 mt-3">
            {[
              { value: savedSchemes.length, label: 'Saved' },
              { value: userProfile?.completedOnboarding ? '✓' : '--', label: 'Profile' },
              { value: occLabel || '--', label: 'Type' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-white font-black text-lg">{stat.value}</span>
                <span className="text-white/50 text-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="px-4 pt-5 space-y-4">

        {/* Onboarding incomplete prompt */}
        {!userProfile?.completedOnboarding && !user?.isGuest && (
          <button
            onClick={() => setScreen('onboarding')}
            className="w-full rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98] shadow-lg"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <Sparkles size={20} color="white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-bold text-sm">Complete Your Profile</p>
              <p className="text-white/70 text-xs">Get personalized scheme recommendations</p>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,0.7)" />
          </button>
        )}

        {/* Account section */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest px-1 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Account
          </p>
          <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
            <SettingRow
              icon={<Edit3 size={18} color="#FF6B35" />}
              iconBg="rgba(255,107,53,0.1)"
              label="Edit Profile"
              subtitle={occupation ? `${occEmoji} ${occLabel}` : 'Not set up'}
              isDark={isDark}
              onClick={() => setScreen('editProfile')}
            />
            <SettingRow
              icon={<Bell size={18} color="#6366F1" />}
              iconBg="rgba(99,102,241,0.1)"
              label="Notification Settings"
              isDark={isDark}
            />
            <SettingRow
              icon={<Bookmark size={18} color="#10B981" />}
              iconBg="rgba(16,185,129,0.1)"
              label={`Saved Schemes (${savedSchemes.length})`}
              isDark={isDark}
              onClick={() => setScreen('saved')}
              isLast
            />
          </div>
        </div>

        {/* Preferences section */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest px-1 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Preferences
          </p>
          <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
            {/* Language selector */}
            <button
              onClick={() => setShowLanguageModal(true)}
              className={`
                w-full flex items-center gap-3 p-4
                border-b ${isDark ? 'border-gray-700/50' : 'border-gray-50'}
                transition-all active:bg-gray-50 dark:active:bg-gray-700/50
              `}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <Globe size={18} color="#3B82F6" />
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Language</p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {LANGUAGES.find(l => l.code === language)?.nativeName || 'English'}
                </p>
              </div>
              <ChevronRight size={16} color={isDark ? '#4B5563' : '#9CA3AF'} />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className={`
                w-full flex items-center gap-3 p-4
                transition-all active:bg-gray-50 dark:active:bg-gray-700/50
              `}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: isDark ? 'rgba(251,191,36,0.1)' : 'rgba(30,58,168,0.1)' }}
              >
                {isDark
                  ? <Sun size={18} color="#FBBF24" />
                  : <Moon size={18} color="#1A3A6B" />
                }
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </p>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Currently: {isDark ? 'Dark' : 'Light'} theme
                </p>
              </div>
              {/* Toggle switch */}
              <div
                className={`
                  relative w-12 h-6 rounded-full transition-all duration-300
                  ${dark ? 'bg-orange-500' : 'bg-gray-200'}
                `}
              >
                <div
                  className={`
                    absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm
                    transition-all duration-300
                    ${dark ? 'left-6' : 'left-0.5'}
                  `}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Support section */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest px-1 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Support
          </p>
          <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
            <SettingRow icon={<HelpCircle size={18} color="#6366F1" />} iconBg="rgba(99,102,241,0.1)" label="Help & Support" isDark={isDark} />
            <SettingRow icon={<Share2 size={18} color="#10B981" />} iconBg="rgba(16,185,129,0.1)" label="Share App" isDark={isDark} />
            <SettingRow icon={<Star size={18} color="#F59E0B" />} iconBg="rgba(245,158,11,0.1)" label="Rate Us on Play Store" isDark={isDark} />
            <SettingRow icon={<Shield size={18} color="#6B7280" />} iconBg="rgba(107,114,128,0.1)" label="Privacy Policy" isDark={isDark} />
            <SettingRow icon={<Info size={18} color="#6B7280" />} iconBg="rgba(107,114,128,0.1)" label="Terms of Service" isDark={isDark} isLast />
          </div>
        </div>

        {/* App version */}
        <div className={`text-center py-2`}>
          <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            SchemeSetu v1.0.0 • Made with ❤️ in India 🇮🇳
          </p>
        </div>

        {/* Logout button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`
            w-full flex items-center justify-center gap-2
            py-4 rounded-2xl border-2
            transition-all active:scale-[0.98]
            text-sm font-bold text-red-500
            ${isDark ? 'border-red-900/40 bg-red-900/10' : 'border-red-100 bg-red-50'}
          `}
        >
          <LogOut size={18} />
          Sign Out
        </button>

        <div className="h-4" />
      </div>

      {/* ── Language Modal ─────────────────────────────────────────────────── */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowLanguageModal(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            onClick={e => e.stopPropagation()}
            className={`w-full rounded-t-3xl ${isDark ? 'bg-gray-900' : 'bg-white'} p-5`}
          >
            <div className="w-10 h-1 rounded-full bg-gray-300 mx-auto mb-4" />
            <h2 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Select Language
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code as 'en' | 'hi'); setShowLanguageModal(false); }}
                  className={`
                    p-3 rounded-2xl border-2 text-left
                    transition-all active:scale-[0.98]
                    ${language === lang.code
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'
                    }
                  `}
                >
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {lang.nativeName}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {lang.name}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Logout Confirm Modal ──────────────────────────────────────────── */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-xs rounded-3xl p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          >
            <div className="text-4xl text-center mb-3">👋</div>
            <h2 className={`font-bold text-lg text-center mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Sign Out?
            </h2>
            <p className={`text-sm text-center mb-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              You'll need to login again to access your saved schemes.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 py-3 rounded-2xl font-semibold text-sm ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); logout(); }}
                className="flex-1 py-3 rounded-2xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

// ── Helper: Setting Row ────────────────────────────────────────────────────

interface SettingRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  isDark: boolean;
  subtitle?: string;
  isLast?: boolean;
  onClick?: () => void;
}

function SettingRow({ icon, iconBg, label, isDark, subtitle, isLast, onClick }: SettingRowProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-4
        ${!isLast ? `border-b ${isDark ? 'border-gray-700/50' : 'border-gray-50'}` : ''}
        transition-all active:bg-gray-50 dark:active:bg-gray-700/50
      `}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{label}</p>
        {subtitle && <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>}
      </div>
      <ChevronRight size={16} color={isDark ? '#4B5563' : '#9CA3AF'} />
    </button>
  );
}
