import React from 'react';
import { Card } from '../../../components/UI/Card';
import { ComparisonBarChart } from '../../../components/Charts/ComparisonBarChart';
import { formatINR } from '../../../utils/formatters';
import { SalaryBlueprint, BudgetComparison } from '../../../types';
import {
  Home,
  Coffee,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface BudgetBreakdownProps {
  blueprint: SalaryBlueprint;
  comparison: BudgetComparison;
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ blueprint, comparison }) => {
  const needsDiff = comparison.actual.needs - blueprint.needs.amount;
  const wantsDiff = comparison.actual.wants - blueprint.wants.amount;
  const savingsDiff = comparison.actual.savings - blueprint.savings.amount;

  return (
    <div className="space-y-6">
      {/* Prominent Salary Blueprint Banner */}
      <div className="bg-surface rounded-card border-2 border-teal-muted/40 p-4 sm:p-5 shadow-subtle">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-card bg-teal-muted text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm mt-0.5">
            ₹
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-muted">
                Recommended 50/30/20 Allocation Plan
              </span>
              <span className="text-xs font-bold bg-teal-subtle text-teal-muted px-2.5 py-1 rounded border border-teal-muted/20 tabular-nums">
                Active Salary: {formatINR(blueprint.salary)}/month
              </span>
            </div>

            <p className="text-sm font-bold text-charcoal mt-1 leading-snug">
              For a <span className="text-teal-muted">{formatINR(blueprint.salary)} / month</span> salary, you should allocate:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3">
              <div className="bg-background p-2.5 rounded-card border border-border flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-card bg-slate-subtle text-slate-warm flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">50% Needs</span>
                  <span className="text-sm font-extrabold text-charcoal tabular-nums">
                    {formatINR(blueprint.needs.amount)}/mo
                  </span>
                </div>
              </div>

              <div className="bg-background p-2.5 rounded-card border border-border flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-card bg-amber-subtle text-amber-soft flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">30% Wants</span>
                  <span className="text-sm font-extrabold text-amber-soft tabular-nums">
                    {formatINR(blueprint.wants.amount)}/mo
                  </span>
                </div>
              </div>

              <div className="bg-teal-subtle/60 p-2.5 rounded-card border border-teal-muted/30 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-card bg-teal-muted text-white flex items-center justify-center shrink-0 shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-muted block">20% SIP & Savings</span>
                  <span className="text-sm font-black text-teal-muted tabular-nums">
                    {formatINR(blueprint.savings.amount)}/mo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillar Cards: 50% Needs, 30% Wants, 20% Savings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Needs Card */}
        <Card className="border-l-4 border-l-slate-warm bg-surface shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-warm uppercase tracking-wider">50% Essential Needs</span>
            <span className="text-[10px] font-bold bg-slate-subtle text-slate-warm px-2 py-0.5 rounded">
              Ideal Cap
            </span>
          </div>

          {/* Primary Target Allocation */}
          <div className="mt-2.5">
            <h4 className="text-2xl font-black text-charcoal tabular-nums">
              {formatINR(blueprint.needs.amount)}
              <span className="text-xs font-medium text-charcoal-muted"> / month</span>
            </h4>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              Covers rent, groceries, electricity, wifi & essential commute
            </p>
          </div>

          {/* Actual Spending Comparison */}
          <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-charcoal-muted">
              <span>Your Actual Spending:</span>
              <strong className="text-charcoal tabular-nums font-bold">{formatINR(comparison.actual.needs)}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted">Budget Status:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  needsDiff <= 0 ? 'text-success-dark' : 'text-danger-dark'
                }`}
              >
                {needsDiff <= 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Under cap by {formatINR(Math.abs(needsDiff))}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Over cap by {formatINR(needsDiff)}</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </Card>

        {/* Wants Card */}
        <Card className="border-l-4 border-l-amber-soft bg-surface shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-soft uppercase tracking-wider">30% Lifestyle Wants</span>
            <span className="text-[10px] font-bold bg-amber-subtle text-amber-soft px-2 py-0.5 rounded">
              Ideal Cap
            </span>
          </div>

          {/* Primary Target Allocation */}
          <div className="mt-2.5">
            <h4 className="text-2xl font-black text-charcoal tabular-nums">
              {formatINR(blueprint.wants.amount)}
              <span className="text-xs font-medium text-charcoal-muted"> / month</span>
            </h4>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              Covers dining out, weekend shopping, entertainment & hobbies
            </p>
          </div>

          {/* Actual Spending Comparison */}
          <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-charcoal-muted">
              <span>Your Actual Spending:</span>
              <strong className="text-charcoal tabular-nums font-bold">{formatINR(comparison.actual.wants)}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted">Budget Status:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  wantsDiff <= 0 ? 'text-success-dark' : 'text-danger-dark'
                }`}
              >
                {wantsDiff <= 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Under cap by {formatINR(Math.abs(wantsDiff))}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Over cap by {formatINR(wantsDiff)}</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </Card>

        {/* Savings & SIP Card */}
        <Card className="border-l-4 border-l-teal-muted bg-surface shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-muted uppercase tracking-wider">20% SIP & Savings</span>
            <span className="text-[10px] font-bold bg-teal-subtle text-teal-muted px-2 py-0.5 rounded">
              Wealth Target
            </span>
          </div>

          {/* Primary Target Allocation */}
          <div className="mt-2.5">
            <h4 className="text-2xl font-black text-teal-muted tabular-nums">
              {formatINR(blueprint.savings.amount)}
              <span className="text-xs font-medium text-charcoal-muted"> / month</span>
            </h4>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              Recommended monthly SIP in Index/Flexi-cap mutual funds & emergency fund
            </p>
          </div>

          {/* Actual Savings Comparison */}
          <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-charcoal-muted">
              <span>Your Achieved Savings:</span>
              <strong className="text-charcoal tabular-nums font-bold">{formatINR(comparison.actual.savings)}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted">Target Status:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  savingsDiff >= 0 ? 'text-success-dark' : 'text-amber-soft'
                }`}
              >
                {savingsDiff >= 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Target Met ({comparison.actual.savingsPercentage}%)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Deficit of {formatINR(Math.abs(savingsDiff))}</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Itemized Budget Breakdown Guide for the Selected Salary */}
      <Card className="shadow-subtle bg-surface border-border">
        <div className="border-b border-border pb-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-muted" />
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">
              Itemized Budget Rules for {formatINR(blueprint.salary)} Monthly Take-Home
            </h3>
          </div>
          <span className="text-xs text-charcoal-muted font-medium">Standard Indian Salary Guardrails</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-background rounded-card border border-border space-y-1">
            <span className="font-bold text-slate-warm flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5" /> Essential Needs ({formatINR(blueprint.needs.amount)})
            </span>
            <ul className="text-charcoal-muted space-y-1 text-[11px] list-disc list-inside">
              <li>House Rent: Max <strong>{formatINR(Math.round(blueprint.salary * 0.3))}</strong> (30%)</li>
              <li>Groceries & Food: Max <strong>{formatINR(Math.round(blueprint.salary * 0.1))}</strong> (10%)</li>
              <li>Bills & Utilities: Max <strong>{formatINR(Math.round(blueprint.salary * 0.1))}</strong> (10%)</li>
            </ul>
          </div>

          <div className="p-3 bg-background rounded-card border border-border space-y-1">
            <span className="font-bold text-amber-soft flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Lifestyle Wants ({formatINR(blueprint.wants.amount)})
            </span>
            <ul className="text-charcoal-muted space-y-1 text-[11px] list-disc list-inside">
              <li>Dining & Ordering: Max <strong>{formatINR(Math.round(blueprint.salary * 0.1))}</strong> (10%)</li>
              <li>Shopping & Clothes: Max <strong>{formatINR(Math.round(blueprint.salary * 0.1))}</strong> (10%)</li>
              <li>Entertainment & Outings: Max <strong>{formatINR(Math.round(blueprint.salary * 0.1))}</strong> (10%)</li>
            </ul>
          </div>

          <div className="p-3 bg-teal-subtle/50 rounded-card border border-teal-muted/30 space-y-1">
            <span className="font-bold text-teal-muted flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Wealth & SIP ({formatINR(blueprint.savings.amount)})
            </span>
            <ul className="text-charcoal-muted space-y-1 text-[11px] list-disc list-inside">
              <li>Mutual Fund SIP: <strong>{formatINR(Math.round(blueprint.salary * 0.15))}</strong> (15%)</li>
              <li>Emergency Reserve: <strong>{formatINR(Math.round(blueprint.salary * 0.05))}</strong> (5%)</li>
              <li>Compounded wealth in 10Y: <strong>~{formatINR(Math.round(blueprint.savings.amount * 230))}</strong></li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Visual Bar Comparison: Actual vs Ideal */}
      <Card className="shadow-subtle">
        <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-charcoal">Actual Spent vs. Ideal Benchmark Comparison</h3>
            <p className="text-xs text-charcoal-muted">
              Visual comparison against the {formatINR(blueprint.salary)} salary blueprint
            </p>
          </div>
          <div className="text-xs bg-slate-subtle px-3 py-1 rounded text-charcoal font-semibold">
            Health Score: {comparison.healthScore}/100
          </div>
        </div>

        <ComparisonBarChart
          actual={{
            needs: comparison.actual.needs,
            wants: comparison.actual.wants,
            savings: comparison.actual.savings,
          }}
          ideal={{
            needs: blueprint.needs.amount,
            wants: blueprint.wants.amount,
            savings: blueprint.savings.amount,
          }}
          height={240}
        />
      </Card>
    </div>
  );
};
