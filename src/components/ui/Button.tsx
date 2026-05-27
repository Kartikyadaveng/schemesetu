// ============================================================
// SchemeSetu - Button Component
// Reusable button with multiple variants and states
// ============================================================

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'google';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {

  // ── Variant styles ────────────────────────────────────────────────────────

  const variants = {
    primary:
      'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-orange-700 active:scale-95',
    secondary:
      'bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg shadow-blue-900/30 hover:from-blue-800 hover:to-blue-600 active:scale-95',
    outline:
      'border-2 border-orange-500 text-orange-500 bg-transparent hover:bg-orange-50 dark:hover:bg-orange-950/30 active:scale-95',
    ghost:
      'text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95',
    danger:
      'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:from-red-600 hover:to-rose-700 active:scale-95',
    google:
      'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-750 active:scale-95',
  };

  // ── Size styles ───────────────────────────────────────────────────────────

  const sizes = {
    sm:  'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md:  'px-4 py-2.5 text-sm rounded-2xl gap-2',
    lg:  'px-6 py-3 text-base rounded-2xl gap-2.5',
    xl:  'px-8 py-4 text-lg rounded-2xl gap-3',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-200 select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Left icon or loading spinner */}
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}

      {children}

      {/* Right icon */}
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
