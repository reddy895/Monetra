import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Badge } from '../../../components/UI/Badge';
import { formatINR } from '../../../utils/formatters';
import { ShieldCheck, FileCheck2, ArrowRight } from 'lucide-react';

interface TaxSavingGuideProps {
  salary: number;
}

export const TaxSavingGuide: React.FC<TaxSavingGuideProps> = ({ salary }) => {
  const annualIncome = salary * 12;

  const sections = [
    {
      title: 'Section 80C (Deduction limit: ₹1,50,000)',
      category: 'Equity & Compounding',
      badge: 'Up to ₹1.5L',
      items: [
        {
          name: 'ELSS Mutual Funds (Top Pick)',
          detail: 'Lowest 3-year lock-in with historical 13-16% compounding. Eligible for 80C tax deduction while growing wealth.',
        },
        {
          name: 'PPF (Public Provident Fund)',
          detail: '15-year government-backed lock-in with guaranteed tax-free interest (7.1%).',
        },
        {
          name: 'EPF (Employee Provident Fund)',
          detail: 'Mandatory 12% deduction from basic salary by employers.',
        },
      ],
      recommendation:
        'For individuals earning ₹20K-₹50K, start an ELSS SIP of ₹1,000 to ₹2,500/month. It builds a disciplined wealth corpus with minimal 36-month lock-in.',
    },
    {
      title: 'Section 80D (Health Insurance Premium)',
      category: 'Emergency Protection',
      badge: 'Up to ₹25,000',
      items: [
        {
          name: 'Individual / Family Floater Health Policy',
          detail: 'Deductions up to ₹25,000 for self, spouse, and dependent children.',
        },
        {
          name: 'Parents Medical Cover',
          detail: 'Additional ₹25,000 (or ₹50,000 for senior citizen parents).',
        },
      ],
      recommendation:
        'A single hospitalization without health insurance can wipe out an entire year of savings. A ₹5-10 Lakh base health cover costs only ~₹500-₹700/month.',
    },
    {
      title: 'Section 80CCD(1B) (National Pension System - NPS)',
      category: 'Retirement Security',
      badge: 'Additional ₹50,000',
      items: [
        {
          name: 'NPS Tier-1 Account',
          detail: 'Exclusive deduction of up to ₹50,000 over and above the ₹1.5 Lakh 80C ceiling.',
        },
      ],
      recommendation:
        'NPS invests in a mix of equity and government debt with low fund management charges (0.09%).',
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="shadow-subtle border-l-4 border-l-slate-warm">
        <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-muted" />
            <div>
              <h3 className="text-sm font-bold text-charcoal">Tax Planning & 80C/80D Guidance</h3>
              <p className="text-xs text-charcoal-muted">
                Annual In-Hand Projection: <strong className="text-charcoal">{formatINR(annualIncome)}/year</strong>
              </p>
            </div>
          </div>
          <Badge variant="info" size="sm">
            Indian Tax Code
          </Badge>
        </div>

        <div className="space-y-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-background rounded-card p-4 border border-border">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-xs font-bold text-charcoal">{sec.title}</h4>
                <span className="text-[10px] font-semibold bg-teal-subtle text-teal-muted px-2 py-0.5 rounded border border-teal-muted/30">
                  {sec.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
                {sec.items.map((it, i) => (
                  <div key={i} className="bg-surface p-3 rounded-sm border border-border text-xs">
                    <p className="font-semibold text-charcoal">{it.name}</p>
                    <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">{it.detail}</p>
                  </div>
                ))}
              </div>

              <div className="bg-surface/80 p-2.5 rounded-sm border border-border text-[11px] text-teal-muted flex items-start gap-1.5 font-medium">
                <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-muted" />
                <span>
                  <strong className="text-charcoal">Salaried Recommendation:</strong> {sec.recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
