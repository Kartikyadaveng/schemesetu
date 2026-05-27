// ============================================================
// SchemeSetu - BottomNav Component
// App bottom navigation bar with badges and active states
// ============================================================

import { Home, MessageCircle, Bookmark, Bell, User } from 'lucide-react';
import { useApp, type Screen } from '../../context/AppContext';

interface NavItem {
  id: Screen;
  label: string;
  labelHi: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',          label: 'Home',    labelHi: 'होम',      icon: Home           },
  { id: 'chat',          label: 'AI Chat', labelHi: 'AI चैट',   icon: MessageCircle  },
  { id: 'saved',         label: 'Saved',   labelHi: 'सेव्ड',    icon: Bookmark       },
  { id: 'notifications', label: 'Alerts',  labelHi: 'अलर्ट',    icon: Bell           },
  { id: 'profile',       label: 'Profile', labelHi: 'प्रोफाइल', icon: User           },
];

export function BottomNav() {
  const { currentScreen, setScreen, isDark, language, unreadCount } = useApp();

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        flex items-center justify-around
        px-2 pb-safe-area-inset-bottom
        border-t
        ${isDark
          ? 'bg-gray-900 border-gray-800'
          : 'bg-white border-gray-100'
        }
      `}
      style={{
        height: '68px',
        boxShadow: isDark
          ? '0 -4px 20px rgba(0,0,0,0.4)'
          : '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {NAV_ITEMS.map(({ id, label, labelHi, icon: Icon }) => {
        const isActive = currentScreen === id;
        const showBadge = id === 'notifications' && unreadCount > 0;

        return (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className={`
              relative flex flex-col items-center justify-center
              gap-0.5 py-1 px-3 rounded-2xl
              transition-all duration-200
              min-w-[56px]
              ${isActive ? 'scale-105' : 'scale-100 opacity-70 hover:opacity-90'}
            `}
          >
            {/* Active indicator pill */}
            {isActive && (
              <div
                className="absolute -top-0 rounded-b-full"
                style={{
                  width: '32px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #FF6B35, #E55A25)',
                }}
              />
            )}

            {/* Icon container */}
            <div
              className={`
                relative flex items-center justify-center rounded-xl
                transition-all duration-200
                ${isActive ? 'w-9 h-9' : 'w-7 h-7'}
              `}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(229,90,37,0.05))',
                    }
                  : {}
              }
            >
              <Icon
                size={isActive ? 22 : 20}
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? '#FF6B35' : isDark ? '#6B7280' : '#9CA3AF'}
              />

              {/* Badge */}
              {showBadge && (
                <div
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1"
                  style={{ background: '#FF6B35' }}
                >
                  {unreadCount}
                </div>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-[10px] font-semibold transition-colors duration-200 leading-none`}
              style={{ color: isActive ? '#FF6B35' : isDark ? '#6B7280' : '#9CA3AF' }}
            >
              {language === 'hi' ? labelHi : label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
