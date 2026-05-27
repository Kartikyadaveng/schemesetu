import { useState } from 'react';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { MarkdownText } from '../../utils/markdown';

interface ChatBubbleProps {
  message: {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
  };
  isDark: boolean;
  onRetry?: () => void;
  hasError?: boolean;
}

export function ChatBubble({ message, isDark, onRetry, hasError }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = message.text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden relative"
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
      )}

      <div className={`max-w-[80%] relative ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`
            rounded-2xl px-4 py-3
            ${isUser
              ? 'rounded-tr-sm text-white'
              : `rounded-tl-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'}`
            }
            ${hasError ? (isDark ? 'border-red-500/50' : 'border-red-300') : ''}
          `}
          style={isUser ? {
            background: 'linear-gradient(135deg, #FF6B35, #E55A25)',
          } : {}}
        >
          <div className={`text-sm leading-relaxed ${hasError ? (isDark ? 'text-red-300' : 'text-red-600') : ''}`}>
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            ) : (
              <MarkdownText text={message.text} isDark={isDark} />
            )}
          </div>

          <div className={`flex items-center justify-between mt-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <p className={`text-[10px] ${isUser ? 'text-white/50' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {message.timestamp.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            {!isUser && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className={`p-1 rounded-md transition-all active:scale-90 ${
                    isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                  title="Copy response"
                >
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>

                {onRetry && hasError && (
                  <button
                    onClick={onRetry}
                    className={`p-1 rounded-md transition-all active:scale-90 ${
                      isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
                    }`}
                    title="Retry"
                  >
                    <RefreshCw size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
