// ============================================================
// SchemeSetu - CategoryCard Component
// Category grid card with emoji and scheme count
// ============================================================

import { useApp } from '../../context/AppContext';
import { CATEGORY_COLORS } from '../../constants/colors';

interface CategoryCardProps {
  id: string;
  label: string;
  emoji: string;
  count: number;
}

export function CategoryCard({ id, label, emoji, count }: CategoryCardProps) {
  const { setScreen, isDark } = useApp();
  const catColor = CATEGORY_COLORS[id] || CATEGORY_COLORS['health'];

  return (
    <button
      onClick={() => setScreen('categorySchemes', { category: id, label })}
      className={`
        relative flex flex-col items-center gap-2
        p-3 rounded-2xl
        transition-all duration-200
        active:scale-95 hover:scale-[1.02]
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        border
        ${isDark ? 'border-gray-700/50' : 'border-gray-100'}
        shadow-sm hover:shadow-md
        w-full
      `}
    >
      {/* Emoji bubble */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
        style={{
          background: `linear-gradient(135deg, ${catColor.border}, ${catColor.border}88)`,
        }}
      >
        {emoji}
      </div>

      {/* Label */}
      <span
        className={`text-xs font-bold leading-tight text-center ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
      >
        {label}
      </span>

      {/* Count pill */}
      <span
        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: catColor.border, color: catColor.text }}
      >
        {count} schemes
      </span>
    </button>
  );
}
