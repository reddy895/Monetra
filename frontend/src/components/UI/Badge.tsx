import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-success-subtle text-success-dark border border-success/30',
    warning: 'bg-warning-subtle text-warning-dark border border-warning/30',
    danger: 'bg-danger-subtle text-danger-dark border border-danger/30',
    info: 'bg-teal-subtle text-teal-muted border border-teal-muted/30',
    neutral: 'bg-slate-subtle text-charcoal-muted border border-border',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-sm',
    md: 'text-xs px-2.5 py-1 font-medium rounded-md',
  };

  return (
    <span className={`inline-flex items-center gap-1 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
