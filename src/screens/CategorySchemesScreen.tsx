import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { SchemeCard } from '../components/ui/SchemeCard';
import { SchemeCardSkeleton } from '../components/ui/Skeleton';
import { CATEGORY_COLORS } from '../constants/colors';
import { motion } from 'framer-motion';
import { getSchemesByCategoryWithScore } from '../services/schemeService';
import type { ScoredScheme } from '../services/schemeService';

const CATEGORY_EMOJIS: Record<string, string> = {
  students: '🎓', farmers: '🌾', women: '👩',
  jobs: '💼', business: '🏪', health: '🏥',
  senior: '👴', housing: '🏠', disability: '♿',
  startup: '🚀', education: '📖', pension: '💳',
  subsidy: '💰', 'skill-development': '🔧',
};

export function CategorySchemesScreen() {
  const { screenParams, isDark, setScreen, userProfile } = useApp();
  const category = screenParams.category as string;
  const label = screenParams.label as string;

  const [scored, setScored] = useState<ScoredScheme[]>([]);
  const [loading, setLoading] = useState(true);

  const catColor = CATEGORY_COLORS[category] || CATEGORY_COLORS['health'];
  const emoji = CATEGORY_EMOJIS[category] || '📋';

  const highMatch = useMemo(() => scored.filter(s => s.match.label === 'high'), [scored]);
  const mediumMatch = useMemo(() => scored.filter(s => s.match.label === 'medium'), [scored]);
  const lowMatch = useMemo(() => scored.filter(s => s.match.label === 'low' || s.match.label === 'none'), [scored]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const profile = userProfile?.occupation
          ? { occupation: userProfile.occupation, details: userProfile.profileDetails }
          : undefined;
        const data = await getSchemesByCategoryWithScore(category, profile);
        setScored(data);
      } catch (err) {
        console.error('Error loading category schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    if (category) load();
  }, [category, userProfile]);

  const renderScheme = (entry: ScoredScheme, i: number) => (
    <motion.div
      key={entry.scheme.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
    >
      <div className="relative">
        {entry.match.score >= 50 && (
          <div
            className="absolute -top-1 -right-1 z-10 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-0.5"
            style={{
              background: entry.match.label === 'high' ? 'rgba(0,200,150,0.15)' : 'rgba(255,184,0,0.15)',
              color: entry.match.label === 'high' ? '#00C896' : '#FFB800',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Target size={10} />
            {entry.match.score}% match
          </div>
        )}
        <SchemeCard scheme={entry.scheme} />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}>
      <div
        className={`px-5 pt-12 pb-6 bg-gradient-to-br ${catColor.bg}`}
        style={{ borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setScreen('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.12)' }}
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white font-black text-xl">{label} Schemes</h1>
            <p className="text-white/60 text-sm">
              {loading ? '...' : `${scored.length} schemes`}
              {highMatch.length > 0 && ` · ${highMatch.length} high match`}
            </p>
          </div>
          <div className="text-3xl">{emoji}</div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SchemeCardSkeleton key={i} />)}
          </div>
        ) : scored.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">{emoji}</div>
            <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
              No schemes in this category yet
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Check back soon — we're adding more!
            </p>
          </div>
        ) : (
          <>
            {highMatch.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} color="#00C896" />
                  <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Best Match ({highMatch.length})
                  </p>
                </div>
                {highMatch.map(renderScheme)}
              </div>
            )}
            {mediumMatch.length > 0 && (
              <div className="mt-2">
                <p className={`text-xs font-bold mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  You May Qualify ({mediumMatch.length})
                </p>
                {mediumMatch.map(renderScheme)}
              </div>
            )}
            {lowMatch.length > 0 && (
              <div className="mt-2">
                <p className={`text-xs font-bold mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                  Other Schemes ({lowMatch.length})
                </p>
                {lowMatch.map(renderScheme)}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
