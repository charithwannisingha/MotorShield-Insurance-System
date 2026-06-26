import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export const Card = ({ children, className = '', padding = 'md', hover = false }: CardProps) => {
  const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div className={`
      bg-white rounded-2xl border border-slate-200 shadow-sm
      ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
      ${paddingMap[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export const StatCard = ({ title, value, subValue, icon, iconBg, trend, className = '' }: StatCardProps) => (
  <Card className={className}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        {subValue && <p className="text-xs text-slate-400 mt-0.5">{subValue}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
            <span>{trend.positive ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} flex-shrink-0`}>
        {icon}
      </div>
    </div>
  </Card>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex items-center gap-3">{action}</div>}
  </div>
);
