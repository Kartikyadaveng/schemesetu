import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { SchemeCard } from '../components/ui/SchemeCard';
import { SchemeCardSkeleton } from '../components/ui/Skeleton';
import { motion } from 'framer-motion';
import { getAllSchemes, searchSchemes } from '../services/schemeService';
import type { Scheme } from '../services/firestoreService';

export function AllSchemesScreen() {
  const { isDark, setScreen } = useApp();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAllSchemes();
        setSchemes(data);
      } catch (err) {
        console.error('Error loading all schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return schemes;
    const q = searchQuery.toLowerCase();
    return schemes.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.ministry.toLowerCase().includes(q) ||
      (s.categories || []).some(c => c.toLowerCase().includes(q))
    );
  }, [schemes, searchQuery]);

  return (
    <div className="min-h-screen pb-20" style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}>
      <div
        className="px-5 pt-12 pb-5"
        style={{
          background: 'linear-gradient(160deg, #1A3A6B 0%, #2E5BA8 100%)',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
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
            <h1 className="text-white font-black text-xl">All Schemes</h1>
            <p className="text-white/60 text-sm">
              {loading ? '...' : `${schemes.length} schemes available`}
            </p>
          </div>
          <div className="text-3xl">📋</div>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search within all schemes…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none border-2 border-transparent transition-all duration-200 focus:border-orange-400/50 ${isDark ? 'bg-gray-800 text-white placeholder:text-gray-500' : 'bg-white text-gray-800 placeholder:text-gray-400'}`}
          />
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <SchemeCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {searchQuery ? 'No matching schemes' : 'No schemes available'}
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {searchQuery ? 'Try different keywords' : 'Check back soon!'}
            </p>
          </div>
        ) : (
          filtered.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <SchemeCard scheme={scheme} />
            </motion.div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
