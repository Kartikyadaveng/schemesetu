import { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, Bookmark, BookmarkCheck, Share2,
  CheckCircle2, FileText, Calendar, ExternalLink,
  IndianRupee, Building2, Tag, Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CATEGORY_COLORS } from '../constants/colors';
import { motion } from 'framer-motion';
import { getSchemeById } from '../services/schemeService';
import { calculateMatch, getEligibilityColor, getEligibilityBg } from '../services/eligibilityEngine';
import type { Scheme } from '../services/firestoreService';

const CATEGORY_EMOJIS: Record<string, string> = {
  students: '🎓', farmers: '🌾', women: '👩',
  jobs: '💼', business: '🏪', health: '🏥',
  senior: '👴', housing: '🏠',
};

export function SchemeDetailScreen() {
  const { screenParams, isDark, setScreen, toggleSave, isSaved, userProfile } = useApp();
  const schemeId = screenParams.schemeId as string;
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  const matchResult = useMemo(() => {
    if (!scheme || !userProfile?.occupation) return null;
    return calculateMatch(
      {
        eligibleStates: scheme.eligibleStates,
        eligibleOccupations: scheme.eligibleOccupations,
        maxIncome: scheme.maxIncome,
        minIncome: scheme.minIncome,
        eligibleCategories: scheme.eligibleCategories,
        minimumMarks: scheme.minimumMarks,
        genderEligibility: scheme.genderEligibility,
        ageRange: scheme.ageRange,
        disabilityEligible: scheme.disabilityEligible,
      },
      { occupation: userProfile.occupation, details: userProfile.profileDetails }
    );
  }, [scheme, userProfile]);

  useEffect(() => {
    async function load() {
      if (!schemeId) return;
      setLoading(true);
      try {
        const data = await getSchemeById(schemeId);
        setScheme(data || null);
      } catch {
        setScheme(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [schemeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 animate-pulse" style={{ background: isDark ? '#1F2937' : '#E5E7EB' }} />
          <div className="h-4 w-48 mx-auto rounded animate-pulse" style={{ background: isDark ? '#1F2937' : '#E5E7EB' }} />
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Scheme not found</p>
          <button onClick={() => setScreen('home')} className="mt-4 text-sm font-semibold" style={{ color: '#FF6B35' }}>Go Back Home</button>
        </div>
      </div>
    );
  }

  const saved = isSaved(scheme.id);
  const catColor = CATEGORY_COLORS[scheme.category] || CATEGORY_COLORS['health'];
  const emoji = CATEGORY_EMOJIS[scheme.category] || '📋';

  return (
    <div className="min-h-screen pb-24" style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}>
      <div className={`relative pt-12 pb-8 px-5 bg-gradient-to-br ${catColor.bg}`}>
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setScreen('home')}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.15)' }}
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.15)' }}
            >
              <Share2 size={16} color="white" />
            </button>
            <button
              onClick={() => toggleSave(scheme.id)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
              style={{ background: saved ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)' }}
            >
              {saved ? <BookmarkCheck size={18} color="white" strokeWidth={2.5} /> : <Bookmark size={18} color="white" />}
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.25)' }}>
            {emoji}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {scheme.isNew && <Badge variant="new">NEW</Badge>}
              {scheme.isPopular && <Badge variant="popular">POPULAR</Badge>}
            </div>
            <h1 className="text-white font-black text-xl leading-tight">{scheme.name}</h1>
            <p className="text-white/70 text-xs mt-1 font-medium">{scheme.nameHindi}</p>
          </div>
        </motion.div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {matchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl p-4 shadow-lg"
            style={{ background: matchResult.label === 'high' ? 'rgba(0,200,150,0.08)' : matchResult.label === 'medium' ? 'rgba(255,184,0,0.08)' : 'rgba(255,107,53,0.08)', border: `1px solid ${getEligibilityColor(matchResult.label)}33` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black"
                style={{ background: getEligibilityBg(matchResult.label), color: getEligibilityColor(matchResult.label) }}
              >
                {matchResult.score}%
              </div>
              <div className="flex-1">
                <p className={`font-black text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {matchResult.label === 'high' ? 'You likely qualify!' : matchResult.label === 'medium' ? 'You may qualify' : matchResult.label === 'low' ? 'Partial eligibility' : 'Check eligibility requirements'}
                </p>
                <div className="flex gap-2 mt-1">
                  {matchResult.matched.length > 0 && (
                    <span className="text-[10px] font-semibold" style={{ color: '#00C896' }}>
                      +{matchResult.matched.length} matched
                    </span>
                  )}
                  {matchResult.missed.length > 0 && (
                    <span className="text-[10px] font-semibold" style={{ color: '#EF4444' }}>
                      -{matchResult.missed.length} criteria
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-2xl">
                {matchResult.label === 'high' ? '✅' : matchResult.label === 'medium' ? '⚠️' : '📋'}
              </div>
            </div>
            {matchResult.matched.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3" style={{ borderTop: `1px solid ${getEligibilityColor(matchResult.label)}22` }}>
                {matchResult.matched.map((m, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-lg" style={{ background: 'rgba(0,200,150,0.1)', color: '#00C896' }}>
                    ✓ {m}
                  </span>
                ))}
                {matchResult.missed.map((m, i) => (
                  <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                    ✗ {m}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-4 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="grid grid-cols-3 gap-3">
            {scheme.amount && (
              <div className="flex flex-col items-center text-center gap-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.1)' }}>
                  <IndianRupee size={16} color="#FF6B35" />
                </div>
                <span className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{scheme.amount}</span>
                <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Benefit</span>
              </div>
            )}
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(30,58,168,0.1)' }}>
                <Tag size={16} color="#1A3A6B" />
              </div>
              <span className={`text-[10px] font-bold capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {(scheme.categories || [scheme.category]).slice(0, 2).join(', ')}
              </span>
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Categories</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,200,150,0.1)' }}>
                <Building2 size={16} color="#00C896" />
              </div>
              <span className={`text-[11px] font-bold text-center line-clamp-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Ministry</span>
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Govt. of India</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{scheme.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,200,150,0.1)' }}>
              <span className="text-base">💰</span>
            </div>
            <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Benefits</h2>
          </div>
          <div className="space-y-2.5">
            {scheme.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} color="#00C896" className="flex-shrink-0 mt-0.5" />
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{benefit}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.1)' }}>
              <span className="text-base">✅</span>
            </div>
            <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Eligibility Criteria</h2>
          </div>
          <div className="space-y-2.5">
            {scheme.eligibility.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white mt-0.5" style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}>
                  {i + 1}
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(30,58,168,0.1)' }}>
              <FileText size={16} color="#1A3A6B" />
            </div>
            <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Required Documents</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {scheme.documents.map((doc, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-600/30' : 'border-gray-100'}`}
              >
                <span className="text-sm">📄</span>
                <p className={`text-xs font-medium leading-tight ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{doc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-200 dark:border-orange-900/30"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,107,53,0.15)' }}>
            <Calendar size={18} color="#FF6B35" />
          </div>
          <div>
            <p className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>Application Deadline</p>
            <p className={`font-bold text-sm mt-0.5 ${isDark ? 'text-white' : 'text-gray-800'}`}>{scheme.deadline}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className={`rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        >
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wide font-semibold mb-1`}>Managed by</p>
          <p className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{scheme.ministry}</p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Government of India</p>
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {scheme.tags.map(tag => (
            <span
              key={tag}
              className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
            >
              #{tag}
            </span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-4"
        >
          <Button
            variant="primary"
            size="xl"
            fullWidth
            rightIcon={<ExternalLink size={18} />}
            onClick={() => window.open(scheme.applicationUrl, '_blank')}
          >
            Apply Now — Official Portal
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="mt-3"
            onClick={() => toggleSave(scheme.id)}
            leftIcon={saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          >
            {saved ? 'Saved to Bookmarks ✓' : 'Save for Later'}
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
