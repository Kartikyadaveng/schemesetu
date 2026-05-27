import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  isDark: boolean;
}

export function TypingIndicator({ isDark }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex gap-2 items-end"
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
      >
        <img
          src="/images/ai-avatar.png"
          alt="Seetu"
          className="w-full h-full object-cover"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <Sparkles size={14} color="white" className="absolute" />
      </div>
      <div
        className={`
          px-4 py-3 rounded-2xl rounded-tl-sm
          ${isDark ? 'bg-gray-800' : 'bg-white'}
          border ${isDark ? 'border-gray-700' : 'border-gray-100'}
          shadow-sm
        `}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: '#FF6B35',
                animation: `typing-bounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
