import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 text-xs font-mono tracking-wider uppercase border rounded-none';

  const variantStyles = {
    default: 'bg-stone-100 text-stone-800 border-stone-300',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    warning: 'bg-amber-50 text-amber-800 border-amber-300',
    error: 'bg-rose-50 text-rose-800 border-rose-300',
  };

  const combinedClassNames = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  return (
    <span className={combinedClassNames} {...props}>
      {children}
    </span>
  );
};
