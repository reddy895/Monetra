import React from 'react';
import { Card } from '../../../components/UI/Card';
import { formatINR } from '../../../utils/formatters';

interface SalaryProgressBarProps {
  salary: number;
  totalSpent: number;
  needsSpent: number;
  wantsSpent: number;
  savingsSpent: number;
}

export const SalaryProgressBar: React.FC<SalaryProgressBarProps> = ({
  salary,
  totalSpent,
  needsSpent,
  wantsSpent,
  savingsSpent,
}) => {
  const needsPct = Math.min(100, Math.round((needsSpent / salary) * 100));
  const wantsPct = Math.min(100 - needsPct, Math.round((wantsSpent / salary) * 100));
  const savingsPct = Math.max(0, 100 - (needsPct + wantsPct));
  const spentPct = Math.min(100, Math.round((totalSpent / salary) * 100));

  return (
    <Card className="bg-surface shadow-subtle border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted">
            Monthly In-Hand Salary Utilization
          </span>
          <h3 className="text-base font-bold text-charcoal mt-0.5">
            {formatINR(totalSpent)} spent out of {formatINR(salary)}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-charcoal-muted">Unspent / In Savings:</span>
            <p className="text-sm font-bold text-success-dark tabular-nums">{formatINR(savingsSpent)}</p>
          </div>
          <div className="bg-slate-subtle px-3 py-1 rounded-card text-xs font-bold text-charcoal tabular-nums border border-border">
            {spentPct}% Spent
          </div>
        </div>
      </div>

      {/* Multi-segment visual progress bar */}
      <div className="h-4 w-full bg-slate-subtle rounded-full overflow-hidden flex">
        {/* Needs segment */}
        <div
          style={{ width: `${needsPct}%` }}
          className="bg-slate-warm transition-all duration-500 ease-out"
          title={`Needs: ${formatINR(needsSpent)} (${needsPct}%)`}
        />
        {/* Wants segment */}
        <div
          style={{ width: `${wantsPct}%` }}
          className="bg-amber-soft transition-all duration-500 ease-out"
          title={`Wants: ${formatINR(wantsSpent)} (${wantsPct}%)`}
        />
        {/* Savings segment */}
        <div
          style={{ width: `${savingsPct}%` }}
          className="bg-teal-muted transition-all duration-500 ease-out"
          title={`Savings: ${formatINR(savingsSpent)} (${savingsPct}%)`}
        />
      </div>

      {/* Legend & Breakdown stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-slate-warm shrink-0" />
          <div>
            <p className="font-semibold text-charcoal">{formatINR(needsSpent)}</p>
            <p className="text-[11px] text-charcoal-muted">Needs ({needsPct}% / ideal 50%)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-amber-soft shrink-0" />
          <div>
            <p className="font-semibold text-charcoal">{formatINR(wantsSpent)}</p>
            <p className="text-[11px] text-charcoal-muted">Wants ({wantsPct}% / ideal 30%)</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-teal-muted shrink-0" />
          <div>
            <p className="font-semibold text-charcoal">{formatINR(savingsSpent)}</p>
            <p className="text-[11px] text-charcoal-muted">Savings ({savingsPct}% / ideal 20%)</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
