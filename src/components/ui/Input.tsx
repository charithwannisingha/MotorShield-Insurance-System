import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Input = ({ label, error, hint, icon, required, className = '', ...props }: InputProps) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`
          w-full rounded-lg border px-3 py-2 text-sm text-slate-800
          placeholder:text-slate-400 outline-none transition-all
          ${icon ? 'pl-9' : ''}
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          }
          disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${className}
        `}
      />
    </div>
    {error && <p className="text-xs text-red-600">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

export const Select = ({ label, error, hint, required, options, className = '', ...props }: SelectProps) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <select
      {...props}
      className={`
        w-full rounded-lg border px-3 py-2 text-sm text-slate-800
        outline-none transition-all bg-white cursor-pointer
        ${error
          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        }
        disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);

export const Textarea = ({ label, error, hint, required, className = '', ...props }: TextareaProps) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    <textarea
      {...props}
      rows={props.rows ?? 3}
      className={`
        w-full rounded-lg border px-3 py-2 text-sm text-slate-800
        placeholder:text-slate-400 outline-none transition-all resize-y
        ${error
          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
          : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        }
        ${className}
      `}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
    {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
  </div>
);
