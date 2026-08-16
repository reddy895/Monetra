import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'teal' | 'slate' | 'amber' | 'green' | 'rose';
  height?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  color = 'teal',
  height = 'md',
  showPercentage = true,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorStyles = {
    teal: 'bg-teal-muted',
    slate: 'bg-slate-warm',
    amber: 'bg-amber-soft',
    green: 'bg-success',
    rose: 'bg-danger',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1 text-xs">
          <div>
            {label && <span className="font-medium text-charcoal">{label}</span>}
            {sublabel && <span className="text-charcoal-muted ml-2">{sublabel}</span>}
          </div>
          {showPercentage && <span className="font-medium text-charcoal tabular-nums">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-subtle rounded-full overflow-hidden ${heightStyles[height]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
