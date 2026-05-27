// ============================================================
// SchemeSetu - Badge Component
// Small status labels for NEW, POPULAR, etc.
// ============================================================

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'new' | 'popular' | 'success' | 'warning' | 'info' | 'danger' | 'neutral';
  size?: 'xs' | 'sm';
}

export function Badge({ children, variant = 'info', size = 'sm' }: BadgeProps) {
  const variants = {
    new:     'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    popular: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    info:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    danger:  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-bold tracking-wide uppercase
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
}
