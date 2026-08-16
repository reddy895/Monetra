import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Badge } from '../../../components/UI/Badge';
import { formatINR } from '../../../utils/formatters';
import { ExpenseSummaryCategory } from '../../../types';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { AppIcon } from '../../../components/UI/AppIcon';

interface CategoryComparisonProps {
  categories: ExpenseSummaryCategory[];
  salary: number;
}

const CATEGORY_LIMITS: Record<string, number> = {
  'Rent': 30,
  'Groceries': 10,
  'Food': 10,
  'Bills': 10,
  'Shopping': 10,
  'Entertainment': 8,
  'Transport': 5,
  'Healthcare': 5,
  'Education': 5,
  'Other': 7,
};

export const CategoryComparison: React.FC<CategoryComparisonProps> = ({ categories, salary }) => {
  return (
    <Card className="shadow-subtle">
      <div className="border-b border-border pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-charcoal">Pre-defined Category Spending Limits</h3>
          <p className="text-xs text-charcoal-muted">
            Benchmark thresholds tailored to protect monthly savings on a {formatINR(salary)} salary
          </p>
        </div>
        <span className="text-xs bg-slate-subtle px-2.5 py-1 rounded text-charcoal-muted font-medium self-start sm:self-auto">
          Rule-Based Guardrails
        </span>
      </div>

      {/* Mobile Cards View */}
      <div className="space-y-3 block sm:hidden">
        {categories.map((cat) => {
          const maxPct = CATEGORY_LIMITS[cat.categoryName] || cat.maxBudgetPercentage || 10;
          const maxAmount = Math.round((salary * maxPct) / 100);
          const isOver = cat.percentageOfSalary > maxPct;
          const diff = cat.totalSpent - maxAmount;
          const progress = Math.min(100, Math.round((cat.totalSpent / (maxAmount || 1)) * 100));

          return (
            <div key={cat.categoryId} className="p-3 bg-background rounded-card border border-border text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-charcoal">
                  <div className="w-6 h-6 rounded bg-slate-subtle text-slate-warm flex items-center justify-center">
                    <AppIcon name={cat.categoryName} className="w-3.5 h-3.5" />
                  </div>
                  <span>{cat.categoryName}</span>
                </div>
                {isOver ? (
                  <Badge variant="danger" size="sm">Over by {formatINR(diff)}</Badge>
                ) : (
                  <Badge variant="success" size="sm">Within Limit</Badge>
                )}
              </div>

              <div className="flex justify-between text-[11px] text-charcoal-muted my-1">
                <span>Spent: <strong className="text-charcoal">{formatINR(cat.totalSpent)}</strong> ({cat.percentageOfSalary}%)</span>
                <span>Cap: <strong className="text-charcoal">{formatINR(maxAmount)}</strong> ({maxPct}%)</span>
              </div>

              <div className="w-full bg-slate-subtle rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isOver ? 'bg-danger' : 'bg-teal-muted'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-left text-xs">
          <thead className="bg-background text-charcoal-muted uppercase text-[10px] tracking-wider border-b border-border">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Category</th>
              <th className="px-4 py-2.5 font-semibold">Recommended Limit</th>
              <th className="px-4 py-2.5 font-semibold">Max Budget Cap</th>
              <th className="px-4 py-2.5 font-semibold text-right">Actual Spent</th>
              <th className="px-4 py-2.5 font-semibold text-right">% of Salary</th>
              <th className="px-4 py-2.5 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((cat) => {
              const maxPct = CATEGORY_LIMITS[cat.categoryName] || cat.maxBudgetPercentage || 10;
              const maxAmount = Math.round((salary * maxPct) / 100);
              const isOver = cat.percentageOfSalary > maxPct;
              const diff = cat.totalSpent - maxAmount;

              return (
                <tr key={cat.categoryId} className="hover:bg-background/60 transition-colors">
                  <td className="px-4 py-3 font-medium text-charcoal flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-subtle text-slate-warm flex items-center justify-center shrink-0">
                      <AppIcon name={cat.categoryName} className="w-3.5 h-3.5" />
                    </div>
                    <span>{cat.categoryName}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal-muted">
                    Max {maxPct}% of salary
                  </td>
                  <td className="px-4 py-3 font-semibold text-charcoal tabular-nums">
                    {formatINR(maxAmount)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-charcoal tabular-nums">
                    {formatINR(cat.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <span className={`font-semibold ${isOver ? 'text-danger-dark' : 'text-charcoal'}`}>
                      {cat.percentageOfSalary}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isOver ? (
                      <Badge variant="danger" size="sm" className="inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Over by {formatINR(diff)}</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm" className="inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Within Limit</span>
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
