import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../../context/AppContext';

interface MainLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export const MainLayout = ({ currentPage, onNavigate, children }: MainLayoutProps) => {
  const { sidebarOpen } = useApp();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile backdrop */}
      {!sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" />
      )}

      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar currentPage={currentPage} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
