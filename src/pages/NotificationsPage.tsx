import React from 'react';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, SectionHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/helpers';
import { Notification } from '../types';

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; badgeColor: string }> = {
  info: { icon: <Info size={16} className="text-blue-600" />, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  success: { icon: <CheckCircle size={16} className="text-emerald-600" />, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  warning: { icon: <AlertTriangle size={16} className="text-amber-600" />, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  error: { icon: <XCircle size={16} className="text-red-600" />, color: 'text-red-700', bg: 'bg-red-50 border-red-200', badgeColor: 'bg-red-100 text-red-800 border-red-200' },
};

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const unread = notifications.filter(n => !n.read).length;
  const sorted = [...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Notifications"
        subtitle={`${unread} unread notification${unread !== 1 ? 's' : ''}`}
        action={
          unread > 0 && (
            <Button variant="outline" icon={<CheckCheck size={15} />} onClick={markAllNotificationsRead}>
              Mark All as Read
            </Button>
          )
        }
      />

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <Card className="text-center py-12">
            <Bell size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No notifications</p>
            <p className="text-slate-400 text-sm">You're all caught up!</p>
          </Card>
        ) : sorted.map((n: Notification) => {
          const cfg = typeConfig[n.type] ?? typeConfig.info;
          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`
                relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                ${n.read ? 'bg-white border-slate-200 hover:bg-slate-50' : `${cfg.bg} border hover:opacity-90`}
              `}
            >
              {/* Unread dot */}
              {!n.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600" />
              )}

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-slate-100' : 'bg-white/80'}`}>
                {cfg.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className={`font-semibold text-sm ${n.read ? 'text-slate-700' : cfg.color}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={cfg.badgeColor}>{n.type.charAt(0).toUpperCase() + n.type.slice(1)}</Badge>
                  {!n.read && <span className="text-xs text-blue-600 font-medium">Click to mark as read</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
