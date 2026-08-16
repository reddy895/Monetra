import React from 'react';
import { Card } from '../../../components/UI/Card';
import { Badge } from '../../../components/UI/Badge';
import { AdvisorTip } from '../../../types';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { AppIcon } from '../../../components/UI/AppIcon';

interface TipsListProps {
  tips: AdvisorTip[];
  salary: number;
}

export const TipsList: React.FC<TipsListProps> = ({ tips, salary }) => {
  return (
    <Card className="shadow-subtle">
      <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-soft" />
          <div>
            <h3 className="text-sm font-bold text-charcoal">Actionable Saving Recommendations</h3>
            <p className="text-xs text-charcoal-muted">
              Rule-based money moves matched to your ₹{(salary / 1000).toFixed(0)}k salary bracket
            </p>
          </div>
        </div>
        <Badge variant="warning" size="sm">
          {tips.length} Tips
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="p-4 bg-background rounded-card border border-border flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-8 h-8 rounded-card bg-teal-subtle text-teal-muted flex items-center justify-center font-bold">
                  <AppIcon name={tip.category || tip.title} className="w-4 h-4" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-muted bg-surface px-2 py-0.5 rounded border border-border">
                  {tip.category}
                </span>
              </div>
              <h4 className="text-xs font-bold text-charcoal">{tip.title}</h4>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">{tip.description}</p>
            </div>

            {tip.actionItem && (
              <div className="mt-3 pt-3 border-t border-border/80">
                <p className="text-[11px] text-teal-muted font-medium flex items-start gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-muted" />
                  <span>
                    <strong className="text-charcoal">Action:</strong> {tip.actionItem}
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
