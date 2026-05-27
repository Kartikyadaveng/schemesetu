import { useState, useMemo } from 'react';
import { Bookmark, Trash2, Search, SlidersHorizontal, X, Clock, Target, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { SchemeCard } from '../components/ui/SchemeCard';
import { motion, AnimatePresence } from 'framer-motion';

type SortMode = 'recent' | 'match' | 'deadline';

export function SavedScreen() {
  const { savedSchemes, schemes, isDark, toggleSave } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Derive categories from saved schemes
  const categories = useMemo(() => {
    const cats = new Set<string>();
    savedSchemes.forEach(id => {
      const scheme = schemes.find(s => s.id === id);
      if (scheme) cats.add(scheme.category);
    });
    return Array.from(cats);
  }, [savedSchemes, schemes]);

  // Filtered + sorted saved schemes
  const saved = useMemo(() => {
    let list = savedSchemes
      .map(id => schemes.find(s => s.id === id))
      .filter(Boolean) as typeof schemes;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      list = list.filter(s => s.category === selectedCategory);
    }

    // Sort
    switch (sortMode) {
      case 'match':
        list = [...list].sort((a, b) => {
          const scoreA = (a as any).matchScore || 0;
          const scoreB = (b as any).matchScore || 0;
          return scoreB - scoreA;
        });
        break;
      case 'deadline':
        list = [...list].sort((a, b) => {
          const da = a.deadline || 'zzzz';
          const db = b.deadline || 'zzzz';
          return da.localeCompare(db);
        });
        break;
      case 'recent':
      default:
        break;
    }

    return list;
  }, [savedSchemes, schemes, searchQuery, selectedCategory, sortMode]);

  const clearAll = () => {
    saved.forEach(s => toggleSave(s.id));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortMode('recent');
  };

  const hasActiveFilters = searchQuery || selectedCategory || sortMode !== 'recent';

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
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
                ? `${saved.length} scheme${saved.length > 1 ? 's' : ''} saved`
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

        {/* Search bar */}
        <div className="relative mt-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search saved schemes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm font-medium outline-none text-white placeholder:text-white/40"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: showFilters ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.1)',
              color: showFilters ? '#FF6B35' : 'rgba(255,255,255,0.7)',
            }}
          >
            <SlidersHorizontal size={12} />
            Sort
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
              style={{
                background: selectedCategory === cat ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.1)',
                color: selectedCategory === cat ? '#FF6B35' : 'rgba(255,255,255,0.7)',
              }}
            >
              {cat}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Sort options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {([
                  { mode: 'recent' as SortMode, label: 'Recently Saved', icon: Clock },
                  { mode: 'match' as SortMode, label: 'Highest Match', icon: Target },
                  { mode: 'deadline' as SortMode, label: 'Deadline', icon: Calendar },
                ]).map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setSortMode(mode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: sortMode === mode ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.08)',
                      color: sortMode === mode ? '#FF6B35' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {saved.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-8"
            >
              <div className="relative mb-6">
                <div
                  className="w-40 h-40 rounded-full flex items-center justify-center"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(30,58,168,0.1))'
                      : 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(30,58,168,0.08))',
                  }}
                >
                  <span className="text-6xl absolute">
                    {hasActiveFilters ? '🔍' : '🔖'}
                  </span>
                </div>
                {!hasActiveFilters && ['🎓', '🌾', '💼'].map((emoji, i) => (
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
                {hasActiveFilters ? 'No Results Found' : 'No Saved Schemes Yet'}
              </h2>
              <p className={`text-sm text-center leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {hasActiveFilters
                  ? 'Try adjusting your search or filters'
                  : 'Browse schemes and tap the bookmark icon to save them here for quick access.'
                }
              </p>

              {!hasActiveFilters && (
                <div className="mt-6 w-full space-y-2">
                  {[
                    { emoji: '🔍', text: 'Search for schemes on the Home screen' },
                    { emoji: '🤖', text: 'Ask Seetu AI to find schemes for you' },
                    { emoji: '🏷️', text: 'Browse by category — Students, Farmers, etc.' },
                  ].map(tip => (
                    <div
                      key={tip.text}
                      className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-100'}`}
                    >
                      <span className="text-xl">{tip.emoji}</span>
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tip.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {saved.length} saved
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {saved.map((scheme, i) => (
                    <motion.div
                      key={scheme.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: i * 0.03 }}
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
