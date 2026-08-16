import React from 'react';
import { Modal } from '../../../components/UI/Modal';
import { Button } from '../../../components/UI/Button';
import { formatINR, getMonthName } from '../../../utils/formatters';
import { MonthlyReportData } from '../../../types';
import { Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

import { AppIcon } from '../../../components/UI/AppIcon';

interface MonthlySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: MonthlyReportData | null;
}

export const MonthlySummaryModal: React.FC<MonthlySummaryModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  if (!reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const summary = reportData.summary;
  const comparison = reportData.comparison;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Monthly Financial Review — ${getMonthName(reportData.month)} ${reportData.year}`}
      subtitle="Executive summary of your income, expenses, savings rate, and rule-based advice"
      maxWidth="3xl"
    >
      <div className="space-y-5 print:space-y-4 text-xs" id="printable-monthly-report">
        {/* User & Header Overview */}
        <div className="flex justify-between items-start bg-background p-4 rounded-card border border-border">
          <div>
            <h3 className="text-base font-bold text-charcoal">{reportData.user.fullName}</h3>
            <p className="text-charcoal-muted">{reportData.user.email}</p>
            <p className="text-[11px] text-teal-muted font-semibold mt-1">
              Monthly In-Hand Salary: {formatINR(reportData.user.monthlySalary)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-charcoal-muted">Health Score</span>
            <div className="text-xl font-black text-teal-muted">
              {comparison.healthScore} <span className="text-xs font-normal text-charcoal-light">/ 100</span>
            </div>
            <span className="text-[10px] text-charcoal-muted">
              {comparison.healthScore >= 80 ? 'Grade A (Excellent)' : 'Grade B (Fair)'}
            </span>
          </div>
        </div>

        {/* 50/30/20 Snapshot */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-surface p-3 rounded-card border border-border">
            <span className="text-[10px] font-semibold uppercase text-slate-warm">Needs (50%)</span>
            <p className="text-sm font-bold text-charcoal tabular-nums mt-1">{formatINR(summary.needsSpent)}</p>
            <p className="text-[10px] text-charcoal-muted">Budget: {formatINR(summary.idealNeeds)}</p>
          </div>

          <div className="bg-surface p-3 rounded-card border border-border">
            <span className="text-[10px] font-semibold uppercase text-amber-soft">Wants (30%)</span>
            <p className="text-sm font-bold text-charcoal tabular-nums mt-1">{formatINR(summary.wantsSpent)}</p>
            <p className="text-[10px] text-charcoal-muted">Budget: {formatINR(summary.idealWants)}</p>
          </div>

          <div className="bg-surface p-3 rounded-card border border-border">
            <span className="text-[10px] font-semibold uppercase text-teal-muted">Savings (20%)</span>
            <p className="text-sm font-bold text-teal-muted tabular-nums mt-1">{formatINR(summary.savingsSpent)}</p>
            <p className="text-[10px] text-charcoal-muted">Rate: {summary.savingsRate}%</p>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="border border-border rounded-card overflow-hidden">
          <div className="bg-background px-4 py-2 font-semibold text-charcoal text-[11px] border-b border-border">
            Category Spending Summary
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-surface text-charcoal-muted uppercase text-[10px] border-b border-border">
              <tr>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-right">% of Salary</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {summary.categories.map((c) => (
                <tr key={c.categoryId}>
                  <td className="px-4 py-2 font-medium text-charcoal flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-slate-subtle text-slate-warm flex items-center justify-center shrink-0">
                      <AppIcon name={c.categoryName} className="w-3 h-3" />
                    </div>
                    <span>{c.categoryName}</span>
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-charcoal tabular-nums">
                    {formatINR(c.totalSpent)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-charcoal-muted">
                    {c.percentageOfSalary}%
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        c.isOverLimit ? 'bg-danger-subtle text-danger-dark' : 'bg-success-subtle text-success-dark'
                      }`}
                    >
                      {c.isOverLimit ? 'Above Limit' : 'Balanced'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Insights & Advisor Advice */}
        {reportData.insights && reportData.insights.length > 0 && (
          <div className="bg-background p-4 rounded-card border border-border">
            <h4 className="text-xs font-bold text-charcoal mb-2">Tailored Advisor Insights</h4>
            <ul className="space-y-1.5">
              {reportData.insights.map((ins, i) => (
                <li key={i} className="flex items-start gap-2 text-charcoal leading-relaxed">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-muted shrink-0 mt-0.5" />
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-border no-print">
          <div className="flex items-center gap-1.5 text-[11px] text-charcoal-light">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Certified Deterministic 50/30/20 Report</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
              Print / Save PDF
            </Button>
            <Button size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
