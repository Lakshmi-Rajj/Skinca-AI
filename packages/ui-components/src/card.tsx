import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'flat';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-none transition-all';

  const variantStyles = {
    default: 'bg-white border border-stone-200 shadow-sm',
    bordered: 'bg-stone-50/50 border border-stone-200',
    flat: 'bg-stone-100 border border-transparent',
  };

  const combinedClassNames = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  return (
    <div className={combinedClassNames} {...props}>
      {children}
    </div>
  );
};
