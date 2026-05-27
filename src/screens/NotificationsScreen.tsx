import { useMemo } from 'react';
import { Bell, CheckCheck, Clock, Trash2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/ui/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import type { NotificationData } from '../services/firestoreService';

const NOTIF_STYLES: Record<string, { color: string; bg: string }> = {
  'new_match':            { color: '#00C896', bg: 'rgba(0,200,150,0.12)' },
  'deadline':             { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  'eligibility_update':   { color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'application_reminder': { color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
  'scheme_bookmarked':    { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  'govt_update':          { color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
};

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function groupNotifications(notifs: NotificationData[]): {
  label: string;
  items: NotificationData[];
}[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const groups: { label: string; items: NotificationData[] }[] = [];

  const today = notifs.filter(n => n.createdAt >= todayStart);
  const week = notifs.filter(n => n.createdAt < todayStart && n.createdAt >= weekStart);
  const earlier = notifs.filter(n => n.createdAt < weekStart);

  if (today.length) groups.push({ label: 'Today', items: today });
  if (week.length) groups.push({ label: 'This Week', items: week });
  if (earlier.length) groups.push({ label: 'Earlier', items: earlier });

  return groups;
}

function NotificationCard({
  notif,
  isDark,
  onMarkRead,
  onDelete,
  onClick,
}: {
  notif: NotificationData;
  isDark: boolean;
  onMarkRead: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const style = NOTIF_STYLES[notif.type] || NOTIF_STYLES['govt_update'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      layout
      onClick={onClick}
      className={`
        relative flex gap-3 p-4 rounded-2xl cursor-pointer
        transition-all active:scale-[0.98]
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        border
        ${!notif.read
          ? isDark ? 'border-orange-500/30' : 'border-orange-200'
          : isDark ? 'border-gray-700/50' : 'border-gray-100'
        }
        shadow-sm
      `}
    >
      {!notif.read && (
        <div
          className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
          style={{ background: '#FF6B35' }}
        />
      )}

      <div
        className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
        style={{ background: style.bg }}
      >
        {notif.icon}
      </div>

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
            {formatTime(notif.createdAt)}
          </span>
          {!notif.read && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: style.bg, color: style.color }}
            >
              NEW
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {!notif.read && (
            <button
              onClick={e => { e.stopPropagation(); onMarkRead(); }}
              className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors"
              style={{ background: 'rgba(0,200,150,0.1)', color: '#00C896' }}
            >
              <CheckCheck size={10} />
              Mark Read
            </button>
          )}
          <button
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
          >
            <Trash2 size={10} />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationsScreen() {
  const {
    isDark, setScreen,
    notifications, markAllNotificationsRead,
    markNotificationRead, deleteNotification, clearAllNotifications,
    getSchemeById,
  } = useApp();

  const grouped = useMemo(() => groupNotifications(notifications), [notifications]);
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const handleNotifClick = (notif: NotificationData) => {
    if (notif.schemeId) {
      setScreen('schemeDetail', { schemeId: notif.schemeId });
    }
  };

  return (
    <div
      className="min-h-screen pb-20"
      style={{ background: isDark ? '#0D1117' : '#F8F9FF' }}
    >
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
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up! ✓'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <CheckCheck size={14} />
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-300"
                style={{ background: 'rgba(239,68,68,0.2)' }}
              >
                <Trash2 size={14} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        <AnimatePresence mode="wait">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                We'll notify you about matching schemes, deadlines, and updates.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {grouped.map(group => (
                <div key={group.label}>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Sparkles size={12} color={isDark ? '#6B7280' : '#9CA3AF'} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {group.label}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {group.items.map(notif => (
                        <NotificationCard
                          key={notif.id}
                          notif={notif}
                          isDark={isDark}
                          onMarkRead={() => markNotificationRead(notif.id)}
                          onDelete={() => deleteNotification(notif.id)}
                          onClick={() => handleNotifClick(notif)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
