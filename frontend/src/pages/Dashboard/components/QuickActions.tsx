import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/UI/Card';
import {
  PlusCircle,
  Compass,
  TrendingUp,
  Sliders,
  FileText
} from 'lucide-react';

interface QuickActionsProps {
  onOpenAddExpense: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onOpenAddExpense }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Expense',
      desc: 'Record a UPI / card spend',
      icon: PlusCircle,
      color: 'bg-teal-muted text-white',
      onClick: onOpenAddExpense,
    },
    {
      label: '50/30/20 Advisor',
      desc: 'View salary blueprint',
      icon: Compass,
      color: 'bg-slate-warm text-white',
      onClick: () => navigate('/advisor'),
    },
    {
      label: 'SIP Suggestions',
      desc: 'Fund graphs & CAGR',
      icon: TrendingUp,
      color: 'bg-amber-soft text-white',
      onClick: () => navigate('/sips'),
    },
    {
      label: 'What-If Simulator',
      desc: 'Calculate spending cuts',
      icon: Sliders,
      color: 'bg-charcoal text-white',
      onClick: () => navigate('/advisor?tab=simulator'),
    },
    {
      label: 'Monthly Report',
      desc: 'Export financial review',
      icon: FileText,
      color: 'bg-success text-white',
      onClick: () => navigate('/reports'),
    },
  ];

  return (
    <Card className="p-4">
      <div className="mb-3">
        <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={act.onClick}
              className="p-3 bg-background hover:bg-slate-subtle rounded-card border border-border text-left transition-all duration-150 flex flex-col justify-between group"
            >
              <div className={`w-8 h-8 rounded-card ${act.color} flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal group-hover:text-teal-muted transition-colors">
                  {act.label}
                </p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
