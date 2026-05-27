import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Mic, ChevronLeft, RefreshCcw,
  Trash2, AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { ChatBubble } from '../components/chat/ChatBubble';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { SuggestedPrompts } from '../components/chat/SuggestedPrompts';
import { sendMessage, resetChat } from '../services/ai/openrouterService';
import { AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'ai',
  text: 'Namaste! 🙏 I am **Seetu**, your AI Government Scheme Assistant. I can help you find schemes based on your eligibility, explain benefits, and guide you through the application process. What would you like to know today?',
  timestamp: new Date(),
};

export function ChatScreen() {
  const { isDark, setScreen, userProfile } = useApp();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('seetu_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch {
        return [WELCOME_MESSAGE];
      }
    }
    return [WELCOME_MESSAGE];
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatHistoryKey = 'seetu_chat_history';

  useEffect(() => {
    try {
      sessionStorage.setItem(chatHistoryKey, JSON.stringify(messages));
    } catch {
      // Storage full - ignore
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text: string = inputText) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    const result = await sendMessage(text.trim(), {
      occupation: userProfile?.occupation,
      details: userProfile?.profileDetails,
    });

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      text: result.error || result.text,
      timestamp: new Date(),
      isError: !!result.error,
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  }, [inputText, isTyping]);

  const handleRetry = useCallback(async (messageText: string) => {
    setIsTyping(true);
    const result = await sendMessage(messageText, {
      occupation: userProfile?.occupation,
      details: userProfile?.profileDetails,
    });
    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: 'ai',
      text: result.error || result.text,
      timestamp: new Date(),
      isError: !!result.error,
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  }, []);

  const handlePromptSelect = useCallback((prompt: string) => {
    handleSend(prompt);
  }, [handleSend]);

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    resetChat();
    try {
      sessionStorage.removeItem(chatHistoryKey);
    } catch {
      // ignore
    }
  };

  const showSuggestedPrompts = messages.length === 1 && messages[0].id === 'welcome';

  const showApiKeyWarning = messages.some(m => m.isError && m.text.includes('API key'));

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      <div
        className="flex-shrink-0 px-4 pt-12 pb-4 flex items-center gap-3"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #0D1F4E, #1A3A6B)'
            : 'linear-gradient(160deg, #1A3A6B, #2E5BA8)',
        }}
      >
        <button
          onClick={() => setScreen('home')}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <ChevronLeft size={20} color="white" />
        </button>

        <div className="relative">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #E55A25)' }}
          >
            <img
              src="/images/ai-avatar.png"
              alt="Seetu AI"
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{
              background: isTyping ? '#FF6B35' : '#00C896',
              borderColor: isDark ? '#0D1F4E' : '#1A3A6B',
            }}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-white font-bold text-base">Seetu AI</h1>
          <p className="text-white/50 text-xs">
            {isTyping ? 'Thinking...' : 'Scheme Assistant • Online'}
          </p>
        </div>

        <button
          onClick={clearChat}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.12)' }}
          title="Clear chat"
        >
          <Trash2 size={16} color="white" />
        </button>
      </div>

      {showApiKeyWarning && (
        <div className={`px-4 py-2 flex items-center gap-2 text-xs ${
          isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
        }`}>
          <AlertTriangle size={12} />
          <span>
            OpenRouter API key not configured.{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Get your free key
            </a>{' '}
            and add it to <code className="px-1 rounded bg-black/10">.env</code>
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide"
        style={{ paddingBottom: '140px' }}
      >
        {showSuggestedPrompts && (
          <SuggestedPrompts isDark={isDark} onSelect={handlePromptSelect} />
        )}

        <AnimatePresence>
          {messages.map(msg => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isDark={isDark}
              hasError={msg.isError}
              onRetry={msg.isError && msg.role === 'ai'
                ? () => {
                    const userMsgIndex = messages.findLastIndex(
                      (m, i) => m.role === 'user' && i < messages.indexOf(msg)
                    );
                    if (userMsgIndex >= 0) {
                      handleRetry(messages[userMsgIndex].text);
                    }
                  }
                : undefined
              }
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping && <TypingIndicator isDark={isDark} />}
        </AnimatePresence>

        {!showSuggestedPrompts && messages.length >= 2 && (
          <div className="flex justify-center">
            <button
              onClick={clearChat}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
                isDark
                  ? 'text-gray-500 border-gray-700 hover:border-gray-600'
                  : 'text-gray-400 border-gray-200 hover:border-gray-300'
              }`}
            >
              <RefreshCcw size={12} />
              New Chat
            </button>
          </div>
        )}
      </div>

      <div
        className={`
          fixed bottom-16 left-0 right-0 px-4 pb-3 pt-2
          ${isDark ? 'bg-gray-900/95' : 'bg-white/95'}
          backdrop-blur-md border-t
          ${isDark ? 'border-gray-800' : 'border-gray-100'}
        `}
      >
        <div className="flex items-end gap-2">
          <button
            onClick={() => setIsMicActive(!isMicActive)}
            className={`
              flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
              transition-all active:scale-90
              ${isMicActive
                ? 'bg-red-500 shadow-lg shadow-red-500/30'
                : isDark ? 'bg-gray-800' : 'bg-gray-100'
              }
            `}
            title="Voice input (coming soon)"
          >
            <Mic size={20} color={isMicActive ? 'white' : isDark ? '#9CA3AF' : '#6B7280'} />
          </button>

          <div
            className={`
              flex-1 flex items-end gap-2 rounded-2xl px-4 py-2
              border-2 transition-all
              ${isDark
                ? 'bg-gray-800 border-gray-700 focus-within:border-orange-500/50'
                : 'bg-gray-50 border-gray-200 focus-within:border-orange-300'
              }
            `}
          >
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about any government scheme..."
              rows={1}
              className={`
                flex-1 resize-none outline-none bg-transparent text-sm
                leading-relaxed max-h-24
                ${isDark ? 'text-white placeholder:text-gray-600' : 'text-gray-800 placeholder:text-gray-400'}
              `}
              style={{ scrollbarWidth: 'none' }}
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            className={`
              flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center
              transition-all active:scale-90
              ${inputText.trim() && !isTyping
                ? 'shadow-lg shadow-orange-500/30'
                : 'opacity-50'
              }
            `}
            style={{
              background: inputText.trim() && !isTyping
                ? 'linear-gradient(135deg, #FF6B35, #E55A25)'
                : isDark ? '#374151' : '#E5E7EB',
            }}
          >
            <Send size={18} color={inputText.trim() && !isTyping ? 'white' : isDark ? '#6B7280' : '#9CA3AF'} />
          </button>
        </div>

        {isMicActive && (
          <p className="text-center text-xs mt-1" style={{ color: '#FF6B35' }}>
            🎤 Voice input coming soon in the next update
          </p>
        )}

        <p className={`text-center text-[10px] mt-1 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
          Seetu may make mistakes. Verify on official government websites.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
