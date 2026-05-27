// ============================================================
// SchemeSetu - Input Component
// Reusable form input with label, icon, and error states
// ============================================================

import { InputHTMLAttributes, ReactNode, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  hint?: string;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  hint,
  type = 'text',
  className = '',
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Label */}
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      {/* Input container */}
      <div className="relative flex items-center">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0">
            {leftIcon}
          </div>
        )}

        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full rounded-2xl px-4 py-3.5
            bg-gray-50 dark:bg-gray-800
            border-2 transition-all duration-200
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-600
            text-sm font-medium
            outline-none
            ${error
              ? 'border-red-400 focus:border-red-500'
              : 'border-gray-100 dark:border-gray-700 focus:border-orange-400 dark:focus:border-orange-500'
            }
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon || isPassword ? 'pr-11' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Right icon or password toggle */}
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3.5 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Hint */}
      {hint && !error && (
        <p className="text-xs text-gray-400 dark:text-gray-600">{hint}</p>
      )}
    </div>
  );
}
