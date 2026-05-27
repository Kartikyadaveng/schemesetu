// ============================================================
// SchemeSetu - SchemeCard Component
// Card component for displaying scheme summary
// ============================================================

import { Bookmark, BookmarkCheck, ArrowRight, IndianRupee } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { type Scheme } from '../../constants/dummyData';
import { CATEGORY_COLORS } from '../../constants/colors';
import { Badge } from './Badge';

interface SchemeCardProps {
  scheme: Scheme;
  compact?: boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  students:  '🎓',
  farmers:   '🌾',
  women:     '👩',
  jobs:      '💼',
  business:  '🏪',
  health:    '🏥',
  senior:    '👴',
  housing:   '🏠',
};

export function SchemeCard({ scheme, compact = false }: SchemeCardProps) {
  const { setScreen, toggleSave, isSaved, isDark } = useApp();
  const saved = isSaved(scheme.id);
  const catColor = CATEGORY_COLORS[scheme.category] || CATEGORY_COLORS['health'];
  const emoji = CATEGORY_EMOJIS[scheme.category] || '📋';

  const handleOpen = () => {
    setScreen('schemeDetail', { schemeId: scheme.id });
  };

  return (
    <div
      onClick={handleOpen}
      className={`
        relative cursor-pointer group
        rounded-2xl overflow-hidden
        transition-all duration-200
        active:scale-[0.98]
        ${isDark
          ? 'bg-gray-800 border border-gray-700/50 hover:border-orange-500/30'
          : 'bg-white border border-gray-100 hover:border-orange-200'
        }
        shadow-sm hover:shadow-md
      `}
    >
      {/* Gradient top bar */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${catColor.bg}`}
      />

      <div className={compact ? 'p-3' : 'p-4'}>
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Emoji icon */}
          <div
            className={`
              flex-shrink-0 flex items-center justify-center rounded-2xl
              text-2xl
              ${compact ? 'w-10 h-10' : 'w-12 h-12'}
            `}
            style={{ background: `${catColor.border}` }}
          >
            {emoji}
          </div>

          {/* Title and ministry */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`
                  font-bold leading-tight line-clamp-2
                  ${isDark ? 'text-white' : 'text-gray-900'}
                  ${compact ? 'text-sm' : 'text-base'}
                `}
              >
                {scheme.name}
              </h3>

              {/* Bookmark button */}
              <button
                onClick={e => { e.stopPropagation(); toggleSave(scheme.id); }}
                className={`
                  flex-shrink-0 p-1.5 rounded-xl transition-all duration-200
                  ${saved
                    ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/30'
                    : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                  }
                `}
              >
                {saved
                  ? <BookmarkCheck size={16} strokeWidth={2.5} />
                  : <Bookmark size={16} strokeWidth={1.8} />
                }
              </button>
            </div>

            <p className={`text-xs mt-0.5 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {scheme.ministry}
            </p>
          </div>
        </div>

        {/* Description */}
        {!compact && (
          <p className={`text-sm mt-3 line-clamp-2 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {scheme.shortDesc}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Amount badge */}
            {scheme.amount && (
              <div
                className="flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-xl"
                style={{ background: `${catColor.border}`, color: catColor.text }}
              >
                <IndianRupee size={10} strokeWidth={2.5} />
                {scheme.amount.replace('₹', '')}
              </div>
            )}

            {/* NEW / POPULAR badge */}
            {scheme.isNew && <Badge variant="new" size="xs">NEW</Badge>}
            {scheme.isPopular && <Badge variant="popular" size="xs">POPULAR</Badge>}
          </div>

          {/* View details */}
          <div
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color: '#FF6B35' }}
          >
            Details <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
