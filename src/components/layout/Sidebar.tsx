import React from 'react';
import {
  LayoutDashboard, Car, FileText, CreditCard,
  AlertTriangle, Settings, LogOut, Shield, ChevronLeft,
  ChevronRight, Bell, UserCircle, BarChart2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  adminOnly?: boolean;
}

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

// ── මෙතනින් Customers පේළිය සම්පූර්ණයෙන්ම අයින් කළා ──
const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'vehicles', label: 'Vehicles', icon: <Car size={18} /> },
  { id: 'policies', label: 'Policies', icon: <FileText size={18} /> },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={18} /> },
  { id: 'claims', label: 'Claims', icon: <AlertTriangle size={18} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart2 size={18} />, adminOnly: true },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => {
  const { auth, logout, sidebarOpen, setSidebarOpen, notifications } = useApp();
  const unread = notifications.filter(n => !n.read).length;
  const isAdmin = auth.user?.role === 'admin';

  const visibleItems = NAV_ITEMS.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className={`
      flex flex-col h-screen bg-slate-900 text-white
      transition-all duration-300 ease-in-out flex-shrink-0
      ${sidebarOpen ? 'w-64' : 'w-20'}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-700/50">
        {sidebarOpen && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white leading-tight block">MotorShield</span>
              <span className="text-[10px] text-slate-400 font-medium">LK Insurance</span>
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <Shield size={16} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* User info */}
      <div className={`px-3 py-4 border-b border-slate-700/50 ${!sidebarOpen ? 'flex justify-center' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {auth.user?.name ? auth.user.name.charAt(0) : 'U'}
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{auth.user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{auth.user?.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={!sidebarOpen ? item.label : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all duration-150 group relative
                ${active
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60 font-medium'
                }
                ${!sidebarOpen ? 'justify-center' : ''}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'claims' && unread > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unread}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed state */}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md 
                  whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 space-y-1 border-t border-slate-700/50 pt-3">
        <button
          onClick={() => onNavigate('notifications')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 
            hover:text-white hover:bg-slate-700/60 transition-all relative
            ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <Bell size={18} className="flex-shrink-0" />
          {sidebarOpen && (
            <>
              <span className="flex-1 text-left">Notifications</span>
              {unread > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </>
          )}
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 
            hover:text-white hover:bg-slate-700/60 transition-all
            ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <UserCircle size={18} className="flex-shrink-0" />
          {sidebarOpen && <span className="flex-1 text-left">My Profile</span>}
        </button>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 
            hover:text-red-400 hover:bg-red-900/20 transition-all
            ${!sidebarOpen ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && <span className="flex-1 text-left">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};