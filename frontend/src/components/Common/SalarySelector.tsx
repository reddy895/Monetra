import React from 'react';
import { formatINR } from '../../utils/formatters';

interface SalarySelectorProps {
  currentSalary: number;
  onSalaryChange: (salary: number) => void;
  label?: string;
}

const SALARY_PRESETS = [20000, 25000, 30000, 35000, 40000, 45000, 50000];

export const SalarySelector: React.FC<SalarySelectorProps> = ({
  currentSalary,
  onSalaryChange,
  label = 'Monthly Salary Bracket'
}) => {
  return (
    <div className="bg-surface rounded-card border border-border p-4 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">{label}</span>
          <p className="text-xs text-charcoal-light">Designed specifically for Indian salaried professionals (₹20K - ₹50K)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal-muted">Active:</span>
          <span className="text-base font-bold text-teal-muted tabular-nums bg-teal-subtle px-3 py-1 rounded-md border border-teal-muted/20">
            {formatINR(currentSalary)}/mo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {SALARY_PRESETS.map((sal) => {
          const isSelected = currentSalary === sal;
          return (
            <button
              key={sal}
              type="button"
              onClick={() => onSalaryChange(sal)}
              className={`py-2 px-2 text-center rounded-card text-xs font-semibold transition-all duration-150 border ${
                isSelected
                  ? 'bg-teal-muted text-white border-teal-muted shadow-sm'
                  : 'bg-background hover:bg-slate-subtle text-charcoal border-border'
              }`}
            >
              {formatINR(sal)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
