import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-700 hover:bg-blue-800 text-white shadow-sm hover:shadow-md border border-blue-700',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-red-600',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent',
  outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-600',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-sm gap-2',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-150 cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${className}
    `}
  >
    {loading ? (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    ) : icon}
    {children}
    {iconRight}
  </button>
);
