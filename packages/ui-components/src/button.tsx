import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-all focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:opacity-50 disabled:pointer-events-none rounded-none';

  const variantStyles = {
    primary: 'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-md hover:shadow-lg',
    secondary: 'bg-stone-200 text-stone-900 hover:bg-stone-300',
    outline: 'border border-stone-300 text-stone-900 hover:bg-stone-100/80',
    ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
  };

  const sizeStyles = {
    sm: 'h-9 px-4 text-xs font-semibold uppercase tracking-wider',
    md: 'h-11 px-6 text-sm font-medium',
    lg: 'h-13 px-8 text-base font-normal',
  };

  const combinedClassNames = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  return (
    <button className={combinedClassNames} {...props}>
      {children}
    </button>
  );
};
