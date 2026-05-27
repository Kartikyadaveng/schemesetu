import { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, TrendingUp, ChevronRight, Target, Bookmark, BookmarkCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { SchemeCard } from '../components/ui/SchemeCard';
import { CategoryCard } from '../components/ui/CategoryCard';
import { SchemeCardSkeleton, CategorySkeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';
import { OCCUPATIONS } from '../types/profile';
import {
  getCategories, getFeaturedSchemes, getStats, searchSchemes, getScoredSchemes,
  getMatchColor, getMatchBg,
} from '../services/schemeService';
import type { AppStats, Scheme, CategoryStats } from '../services/firestoreService';
import type { ScoredScheme } from '../services/schemeService';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const OCCUPATION_EMOJIS: Record<string, string> = {
  student: '📚', farmer: '🌾', 'job-seeker': '💼', 'business-owner': '🏪',
  woman: '👩', 'senior-citizen': '👴', homemaker: '🏠', 'disabled-person': '♿',
  'worker-labourer': '🔧', other: '👤',
};

export function HomeScreen() {
  const { user, userProfile, isDark, setScreen, unreadCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [featured, setFeatured] = useState<Scheme[]>([]);
  const [scoredSchemes, setScoredSchemes] = useState<ScoredScheme[]>([]);
  const [searchResults, setSearchResults] = useState<Scheme[] | null>(null);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);

  const occupation = userProfile?.occupation;
  const details = userProfile?.profileDetails;
  const occLabel = OCCUPATIONS.find(o => o.id === occupation)?.label;
  const occEmoji = OCCUPATION_EMOJIS[occupation || ''] || '👤';

  // Perfect match (100%), high match (75-99%), partial (40-74%), low (<40%)
  const highMatch = scoredSchemes.filter(s => s.match.label === 'perfect' || s.match.label === 'high');
  const mediumMatch = scoredSchemes.filter(s => s.match.label === 'partial');
  const lowMatch = scoredSchemes.filter(s => s.match.label === 'low' || s.match.label === 'none');

  useEffect(() => {
    async function load() {
      try {
        const [cats, featuredData, statsData, scored] = await Promise.all([
          getCategories(),
          getFeaturedSchemes(),
          getStats(),
          occupation ? getScoredSchemes(occupation, details || {}) : Promise.resolve([]),
        ]);
        setCategories(cats);
        setFeatured(featuredData);
        setStats(statsData);
        setScoredSchemes(scored);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [occupation, details]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchSchemes(searchQuery);
      setSearchResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  const totalSchemes = stats?.totalSchemes || 20;
  const totalCategories = stats?.totalCategories || 8;

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      <div
        className="px-5 pt-12 pb-6"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #0D1F4E 0%, #1A3A6B 100%)'
            : 'linear-gradient(160deg, #1A3A6B 0%, #2E5BA8 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/60 text-sm font-medium">{greeting} 👋</p>
            <h1 className="text-white font-black text-xl mt-0.5">
              {user?.isGuest ? 'Welcome, Guest!' : `Hi, ${firstName}!`}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {occupation && (
              <button
                onClick={() => setScreen('editProfile')}
                className="h-11 px-3 rounded-2xl flex items-center gap-1.5 transition-all active:scale-95 text-xs font-bold text-white/80"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                <span>{occEmoji}</span>
                <span>{occLabel}</span>
              </button>
            )}
            <button
              onClick={() => setScreen('notifications')}
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Bell size={20} color="white" />
              {unreadCount > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: '#FF6B35' }}
                >
                  {unreadCount}
                </div>
              )}
            </button>
          </div>
        </div>

        <div
          className="rounded-2xl p-3 flex items-center gap-3 mb-4 cursor-pointer active:scale-[0.98] transition-all"
          style={{ background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.3)' }}
          onClick={() => setScreen('chat')}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FF6B35' }}>
            <Sparkles size={18} color="white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Ask Seetu AI 🤖</p>
            <p className="text-white/60 text-xs">Find schemes you qualify for instantly</p>
          </div>
          <ChevronRight size={16} color="rgba(255,255,255,0.5)" />
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes, scholarships, pensions…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`
              w-full pl-11 pr-4 py-3.5 rounded-2xl
              text-sm font-medium outline-none border-2 border-transparent
              transition-all duration-200 focus:border-orange-400/50
              ${isDark ? 'bg-gray-800 text-white placeholder:text-gray-500' : 'bg-white text-gray-800 placeholder:text-gray-400'}
            `}
          />
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {searchResults !== null ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Results for "{searchQuery}"
              </h2>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {searchResults.length} found
              </span>
            </div>
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map(scheme => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>No schemes found</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Try different keywords</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {occupation && scoredSchemes.length > 0 && (
              <>
                {/* High Match Schemes */}
                {highMatch.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={16} color="#00C896" />
                      <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {highMatch.length >= 3 ? 'High Match Schemes' : 'Best For You'}
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,200,150,0.12)', color: '#00C896' }}>
                        {highMatch[0]?.match.score}%+
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {highMatch.slice(0, 4).map(entry => (
                        <SchemeCardWithMatch key={entry.scheme.id} scored={entry} isDark={isDark} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Medium Match Schemes */}
                {mediumMatch.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} color="#FFB800" />
                      <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        You May Qualify
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,184,0,0.12)', color: '#FFB800' }}>
                        {mediumMatch[0]?.match.score}%+
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {mediumMatch.slice(0, 3).map(entry => (
                        <SchemeCardWithMatch key={entry.scheme.id} scored={entry} isDark={isDark} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Profile match summary */}
                {highMatch.length + mediumMatch.length > 0 && (
                  <div
                    className={`rounded-2xl p-3 flex items-center gap-3 border ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-100 bg-white'} shadow-sm`}
                  >
                    <span className="text-2xl">{occEmoji}</span>
                    <div className="flex-1">
                      <p className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Profile: {occLabel}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {highMatch.length} high match · {mediumMatch.length} partial match · {lowMatch.length} low match
                      </p>
                    </div>
                    <button
                      onClick={() => setScreen('editProfile')}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35' }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </>
            )}

            {occupation && scoredSchemes.length === 0 && !loading && (
              <div
                className={`rounded-2xl p-4 text-center border-2 border-dashed ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50'}`}
              >
                <p className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Complete your profile setup to get personalized recommendations
                </p>
                <button
                  onClick={() => setScreen('editProfile')}
                  className="mt-3 text-xs font-bold px-4 py-2 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
                >
                  Complete Profile
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Schemes', value: `${totalSchemes}+`, emoji: '📋', action: 'allSchemes' as const },
                { label: 'Categories', value: `${totalCategories}`, emoji: '🗂️', action: null },
                { label: 'States', value: '28+', emoji: '🗺️', action: null },
              ].map(stat => (
                <div
                  key={stat.label}
                  onClick={stat.action ? () => setScreen(stat.action!) : undefined}
                  className={`rounded-2xl p-3 text-center ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700/50' : 'border-gray-100'} shadow-sm ${stat.action ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
                >
                  <div className="text-xl mb-1">{stat.emoji}</div>
                  <p className="font-black text-base" style={{ color: '#FF6B35' }}>{stat.value}</p>
                  <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Browse Categories</h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => <CategorySkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <CategoryCard {...cat} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`rounded-2xl p-3 flex items-center justify-center gap-2 border-dashed border-2 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}
              style={{ minHeight: '60px' }}
            >
              <span className="text-lg">📢</span>
              <div>
                <p className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Advertisement</p>
                <p className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>AdMob Banner — 320×50</p>
              </div>
            </div>

            {featured.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} color="#FF6B35" />
                    <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Featured Schemes</h2>
                  </div>
                </div>
                <div className="space-y-3">
                  {loading
                    ? [...Array(3)].map((_, i) => <SchemeCardSkeleton key={i} />)
                    : featured.map((scheme, i) => (
                        <motion.div
                          key={scheme.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <SchemeCard scheme={scheme} />
                        </motion.div>
                      ))
                  }
                </div>
              </div>
            )}

            <div className="h-4" />
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

// ── Scheme Card with Match Badge ─────────────────────────────────────────────

function SchemeCardWithMatch({ scored, isDark }: { scored: ScoredScheme; isDark: boolean }) {
  const { setScreen, toggleSave, isSaved } = useApp();
  const { scheme, match } = scored;
  const saved = isSaved(scheme.id);

  const badgeStyle = {
    background: getMatchBg(match.label),
    color: getMatchColor(match.label),
  };

  const isHighMatch = match.label === 'perfect' || match.label === 'high';

  return (
    <div
      onClick={() => setScreen('schemeDetail', { schemeId: scheme.id })}
      className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 active:scale-[0.98] ${
        isDark ? 'bg-gray-800 border border-gray-700/50 hover:border-orange-500/30' : 'bg-white border border-gray-100 hover:border-orange-200'
      } shadow-sm hover:shadow-md`}
    >
      <div
        className="h-1 w-full"
        style={{ background: isHighMatch ? 'linear-gradient(90deg, #00C896, #00A37A)' : match.label === 'partial' ? 'linear-gradient(90deg, #FFB800, #F59E0B)' : 'linear-gradient(90deg, #FF6B35, #E55A25)' }}
      />
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className={`font-bold text-sm leading-tight line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {scheme.name}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Match badge */}
                <div className="text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-0.5" style={badgeStyle}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {match.score}%
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleSave(scheme.id); }}
                  className={`p-1.5 rounded-xl transition-all ${saved ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
                >
                  {saved ? <BookmarkCheck size={14} strokeWidth={2.5} /> : <Bookmark size={14} />}
                </button>
              </div>
            </div>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {scheme.ministry}
            </p>
            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {scheme.shortDesc}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {scheme.amount && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {scheme.amount}
                </span>
              )}
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {match.matched.length > 0 && match.matched[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
