// ============================================================
// SchemeSetu - Card Component
// Reusable card with shadow and optional press animation
// ============================================================

import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'flat' | 'gradient';
  pressable?: boolean;
  noPadding?: boolean;
}

export function Card({
  children,
  variant = 'default',
  pressable = false,
  noPadding = false,
  className = '',
  ...props
}: CardProps) {

  const variants = {
    default:
      'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm',
    elevated:
      'bg-white dark:bg-gray-800 shadow-xl shadow-black/5 dark:shadow-black/30',
    flat:
      'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50',
    gradient:
      'bg-gradient-to-br from-orange-500/5 to-blue-900/5 dark:from-orange-500/10 dark:to-blue-900/10 border border-orange-100 dark:border-orange-900/30',
  };

  return (
    <div
      className={`
        rounded-2xl overflow-hidden
        ${variants[variant]}
        ${noPadding ? '' : 'p-4'}
        ${pressable ? 'cursor-pointer transition-transform duration-150 active:scale-[0.98] hover:shadow-md' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
