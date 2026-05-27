// ============================================================
// SchemeSetu - Saved Schemes Screen
// Bookmarked schemes list with empty state
// ============================================================

import { Bookmark, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { SchemeCard } from '../components/ui/SchemeCard';
import { motion, AnimatePresence } from 'framer-motion';

export function SavedScreen() {
  const { savedSchemes, schemes, isDark, toggleSave } = useApp();

  const saved = schemes.filter(s => savedSchemes.includes(s.id));

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #0D1F4E, #1A3A6B)'
            : 'linear-gradient(160deg, #1A3A6B, #2E5BA8)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-black text-2xl">Saved Schemes</h1>
            <p className="text-white/60 text-sm mt-0.5">
              {saved.length > 0
                ? `${saved.length} scheme${saved.length > 1 ? 's' : ''} bookmarked`
                : 'Your bookmark collection'}
            </p>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <Bookmark size={20} color="white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {saved.length === 0 ? (
            /* ── Empty State ──────────────────────────────────────────────── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-8"
            >
              <div className="relative mb-6">
                {/* Illustration background */}
                <div
                  className="w-40 h-40 rounded-full flex items-center justify-center"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(30,58,168,0.1))'
                      : 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(30,58,168,0.08))',
                  }}
                >
                  <img
                    src="/images/empty-saved.png"
                    alt="No saved schemes"
                    className="w-28 h-28 object-contain"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Fallback emoji */}
                  <span className="text-6xl absolute">🔖</span>
                </div>

                {/* Floating emojis */}
                {['🎓', '🌾', '💼'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-xl"
                    style={{
                      top: `${['-10%', '70%', '-5%'][i]}`,
                      right: `${['-10%', '-15%', '80%'][i]}`,
                    }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.5, ease: 'easeInOut' }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>

              <h2 className={`font-black text-xl text-center mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                No Saved Schemes Yet
              </h2>
              <p className={`text-sm text-center leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Browse schemes and tap the{' '}
                <Bookmark size={14} className="inline" />{' '}
                bookmark icon to save them here for quick access.
              </p>

              {/* Tip cards */}
              <div className="mt-6 w-full space-y-2">
                {[
                  { emoji: '🔍', text: 'Search for schemes on the Home screen' },
                  { emoji: '🤖', text: 'Ask Seetu AI to find schemes for you' },
                  { emoji: '🏷️', text: 'Browse by category — Students, Farmers, etc.' },
                ].map(tip => (
                  <div
                    key={tip.text}
                    className={`
                      flex items-center gap-3 p-3 rounded-2xl
                      ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-100'}
                    `}
                  >
                    <span className="text-xl">{tip.emoji}</span>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── Saved List ──────────────────────────────────────────────── */
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Clear all button */}
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {saved.length} saved
                </p>
                <button
                  onClick={() => saved.forEach(s => toggleSave(s.id))}
                  className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={12} />
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {saved.map((scheme, i) => (
                    <motion.div
                      key={scheme.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <SchemeCard scheme={scheme} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
