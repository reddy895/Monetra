import React from 'react';
import { Card } from '../../../components/UI/Card';
import { CategoryDonut } from '../../../components/Charts/CategoryDonut';
import { SpendingTrendLine } from '../../../components/Charts/SpendingTrendLine';
import { ExpenseSummary, ExpenseTrend } from '../../../types';

interface SpendingSummaryProps {
  summary: ExpenseSummary;
  trend?: ExpenseTrend;
}

export const SpendingSummary: React.FC<SpendingSummaryProps> = ({ summary, trend }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Category Breakdown (Donut) */}
      <Card className="lg:col-span-5 flex flex-col justify-between">
        <div className="border-b border-border pb-3 mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Category Breakdown</h3>
            <p className="text-xs text-charcoal-muted">Distribution of this month's spending</p>
          </div>
          <span className="text-xs bg-slate-subtle px-2 py-0.5 rounded text-charcoal-muted font-medium">
            {summary.categories.length} categories
          </span>
        </div>

        <CategoryDonut data={summary.categories} height={230} />
      </Card>

      {/* Monthly Spending Trend */}
      <Card className="lg:col-span-7 flex flex-col justify-between">
        <div className="border-b border-border pb-3 mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Spending Velocity</h3>
            <p className="text-xs text-charcoal-muted">Daily expense timeline in current cycle</p>
          </div>
          <span className="text-xs font-semibold text-teal-muted bg-teal-subtle px-2.5 py-1 rounded">
            Live Updates
          </span>
        </div>

        <SpendingTrendLine data={trend?.dailySpending || []} height={230} />
      </Card>
    </div>
  );
};
