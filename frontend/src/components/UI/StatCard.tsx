import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon?: React.ReactNode;
  iconBgColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = 'bg-teal-subtle text-teal-muted',
  className = '',
}) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-charcoal-muted uppercase tracking-wider">{title}</p>
          <h4 className="text-2xl font-bold text-charcoal mt-1.5 tabular-nums tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-charcoal-light mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span
                className={`font-semibold ${
                  trend.isNeutral
                    ? 'text-charcoal-muted'
                    : trend.isPositive
                    ? 'text-success-dark'
                    : 'text-danger-dark'
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-2.5 rounded-card flex items-center justify-center shrink-0 ${iconBgColor}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};
