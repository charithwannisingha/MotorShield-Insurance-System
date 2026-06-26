import { Bell, Search, Menu, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TopBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  vehicles: 'Vehicles',
  policies: 'Policies',
  payments: 'Payments',
  claims: 'Claims',
  reports: 'Reports',
  settings: 'Settings',
  notifications: 'Notifications',
  profile: 'My Profile',
};

export const TopBar = ({ currentPage, onNavigate }: TopBarProps) => {
  const { notifications, setSidebarOpen, sidebarOpen } = useApp();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors md:hidden"
        >
          <Menu size={18} />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <span className="text-slate-400">MotorShield LK</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-700 font-semibold">{PAGE_LABELS[currentPage] ?? currentPage}</span>
        </nav>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search (decorative, wired to global search would need more state) */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Quick search…"
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700
              placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400
              w-52 transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Date */}
        <div className="hidden lg:block text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Colombo'
          })}
        </div>
      </div>
    </header>
  );
};
