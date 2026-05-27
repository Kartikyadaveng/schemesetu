// ============================================================
// SchemeSetu - Notifications Screen
// Deadline reminders, new scheme alerts
// ============================================================

import { Bell, CheckCheck, Clock, Sparkles, RefreshCcw, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { DUMMY_NOTIFICATIONS, type Notification } from '../constants/dummyData';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Map notification type to color/icon
function getNotifStyle(type: Notification['type']) {
  switch (type) {
    case 'deadline': return { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', icon: '⏰' };
    case 'new':      return { color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: '✨' };
    case 'update':   return { color: '#FF6B35', bg: 'rgba(255,107,53,0.1)', icon: '📢' };
    case 'reminder': return { color: '#6366F1', bg: 'rgba(99,102,241,0.1)', icon: '🔔' };
    default:         return { color: '#6B7280', bg: 'rgba(107,114,128,0.1)', icon: '📋' };
  }
}

export function NotificationsScreen() {
  const { isDark, setScreen, setUnreadCount } = useApp();
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const unread = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    const remaining = notifications.filter(n => !n.isRead && n.id !== id).length;
    setUnreadCount(remaining);
  };

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
      {/* Header */}
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
            <h1 className="text-white font-black text-2xl">Notifications</h1>
            <p className="text-white/60 text-sm mt-0.5">
              {unread > 0 ? `${unread} unread alert${unread > 1 ? 's' : ''}` : 'All caught up! ✓'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <CheckCheck size={14} />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div className="px-4 pt-4 space-y-3">
        {/* AdMob placeholder */}
        <div
          className={`
            rounded-2xl p-3 flex items-center justify-center gap-2
            border-dashed border-2
            ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}
          `}
        >
          <span>📢</span>
          <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            AdMob Banner — 320×50
          </p>
        </div>

        <AnimatePresence>
          {notifications.length === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-16 gap-4"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: isDark ? 'rgba(255,107,53,0.1)' : 'rgba(255,107,53,0.08)' }}
              >
                <Bell size={40} color="#FF6B35" />
              </div>
              <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                No Notifications
              </h2>
              <p className={`text-sm text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                We'll notify you about new schemes and deadlines
              </p>
            </motion.div>
          ) : (
            notifications.map((notif, i) => {
              const style = getNotifStyle(notif.type);
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    markRead(notif.id);
                    if (notif.schemeId) setScreen('schemeDetail', { schemeId: notif.schemeId });
                  }}
                  className={`
                    relative flex gap-3 p-4 rounded-2xl cursor-pointer
                    transition-all active:scale-[0.98]
                    ${isDark ? 'bg-gray-800' : 'bg-white'}
                    border
                    ${!notif.isRead
                      ? isDark ? 'border-orange-500/30' : 'border-orange-200'
                      : isDark ? 'border-gray-700/50' : 'border-gray-100'
                    }
                    shadow-sm
                  `}
                >
                  {/* Unread indicator */}
                  {!notif.isRead && (
                    <div
                      className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
                      style={{ background: '#FF6B35' }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: style.bg }}
                  >
                    {style.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {notif.title}
                    </h3>
                    <p className={`text-xs mt-0.5 leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock size={11} color={isDark ? '#6B7280' : '#9CA3AF'} />
                      <span className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {notif.time}
                      </span>
                      {!notif.isRead && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: style.bg, color: style.color }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                    className={`
                      self-start p-1 rounded-lg
                      ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500'}
                      transition-colors
                    `}
                  >
                    ✕
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Notification types legend */}
        {notifications.length > 0 && (
          <div className={`rounded-2xl p-3 mt-4 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
            <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Notification Types
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <AlertCircle size={12} color="#EF4444" />, label: 'Deadline Reminders', color: '#EF4444' },
                { icon: <Sparkles size={12} color="#10B981" />, label: 'New Schemes', color: '#10B981' },
                { icon: <RefreshCcw size={12} color="#FF6B35" />, label: 'Scheme Updates', color: '#FF6B35' },
                { icon: <Bell size={12} color="#6366F1" />, label: 'Apply Reminders', color: '#6366F1' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1.5">
                  {item.icon}
                  <span className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
