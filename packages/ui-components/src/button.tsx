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
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 disabled:opacity-50 disabled:pointer-events-none';
  
  const variantStyles = {
    primary: 'bg-stone-900 text-white hover:bg-stone-800',
    secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200',
    outline: 'border border-stone-300 text-stone-900 hover:bg-stone-50',
    ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs rounded',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-md',
  };

  const combinedClassNames = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  return (
    <button className={combinedClassNames} {...props}>
      {children}
    </button>
  );
};
