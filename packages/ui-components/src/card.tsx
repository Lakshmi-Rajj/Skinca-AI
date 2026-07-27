import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-lg bg-white p-6 font-sans';
  
  const variantStyles = {
    default: 'shadow-sm border border-stone-200',
    bordered: 'border border-stone-300',
    flat: 'bg-stone-50 border border-transparent',
  };

  const combinedClassNames = `${baseStyles} ${variantStyles[variant]} ${className}`.trim();

  return (
    <div className={combinedClassNames} {...props}>
      {children}
    </div>
  );
};
