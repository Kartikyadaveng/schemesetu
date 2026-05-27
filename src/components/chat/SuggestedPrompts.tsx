import { motion } from 'framer-motion';
import { SUGGESTED_PROMPTS } from '../../constants/dummyData';

interface SuggestedPromptsProps {
  isDark: boolean;
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ isDark, onSelect }: SuggestedPromptsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <p className={`text-xs font-semibold mb-2 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        💡 Try asking:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {SUGGESTED_PROMPTS.slice(0, 4).map(prompt => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className={`
              text-xs font-medium px-3 py-2 rounded-xl border
              transition-all active:scale-95
              text-left
              ${isDark
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-orange-500/50'
                : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
              }
            `}
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
