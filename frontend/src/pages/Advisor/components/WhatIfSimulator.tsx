import React, { useState } from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Badge } from '../../../components/UI/Badge';
import { formatINR } from '../../../utils/formatters';
import {
  useSimulateWhatIfMutation,
  useSaveScenarioMutation,
  useGetScenariosQuery,
  useDeleteScenarioMutation
} from '../../../store/apiSlice';
import { Sliders, Sparkles, TrendingUp, Bookmark, Trash2 } from 'lucide-react';

interface WhatIfSimulatorProps {
  salary: number;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ salary }) => {
  const [category, setCategory] = useState('Dining Out / Food Delivery');
  const [reductionAmount, setReductionAmount] = useState(1000);
  const [returnRate, setReturnRate] = useState(12);
  const [tenureYears, setTenureYears] = useState(5);

  const [saveScenario, { isLoading: isSaving }] = useSaveScenarioMutation();
  const { data: scenariosData } = useGetScenariosQuery();
  const [deleteScenario] = useDeleteScenarioMutation();

  const savedScenarios = scenariosData?.data || [];

  // Local real-time calculation
  const yearlySaving = reductionAmount * 12;
  const i = (returnRate / 100) / 12;
  const n = tenureYears * 12;
  const futureValue = reductionAmount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const totalInvested = reductionAmount * n;
  const wealthCreated = futureValue - totalInvested;

  const handleSaveCurrentScenario = async () => {
    try {
      await saveScenario({
        name: `Cut ${category} by ₹${reductionAmount}/mo`,
        category: category.toLowerCase().includes('dining') ? 'dining' : 'shopping',
        reductionAmount,
        returnRate,
        tenureYears,
        description: `Save ₹${yearlySaving.toLocaleString('en-IN')}/year and grow ₹${Math.round(futureValue).toLocaleString('en-IN')} in ${tenureYears} years.`,
      }).unwrap();
    } catch (err) {
      console.error('Failed to save scenario', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulator Interactive Card */}
      <Card className="shadow-subtle border-l-4 border-l-amber-soft">
        <div className="border-b border-border pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-soft" />
              <span>What-If Spending Optimization Simulator</span>
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              See how small daily trims in discretionary wants snowball into substantial compounding wealth
            </p>
          </div>
          <Badge variant="warning" size="sm">
            Compound Wealth Engine
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1.5">
                Target Discretionary Spend Area
              </label>
              <select
                className="w-full rounded-card border border-border bg-surface px-3 py-2 text-xs text-charcoal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Dining Out / Food Delivery">🍽️ Dining Out / Swiggy / Zomato</option>
                <option value="Online Impulse Shopping">🛍️ Online Shopping & Sales</option>
                <option value="OTT & App Subscriptions">🎬 Unused App & OTT Subscriptions</option>
                <option value="Daily Cabs & Auto">🚗 Cabs & Private Commute</option>
                <option value="Weekend Entertainment">🍿 Weekend Cinema & Cafes</option>
              </select>
            </div>

            {/* Slider 1: Monthly Reduction */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-charcoal">Monthly Spend Reduction:</span>
                <span className="font-bold text-teal-muted text-sm tabular-nums">
                  {formatINR(reductionAmount)}/month
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="5000"
                step="100"
                value={reductionAmount}
                onChange={(e) => setReductionAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-subtle rounded-lg appearance-none cursor-pointer accent-teal-muted"
              />
              <div className="flex justify-between text-[10px] text-charcoal-light mt-1">
                <span>₹200/mo</span>
                <span>₹2,500/mo</span>
                <span>₹5,000/mo</span>
              </div>
            </div>

            {/* Slider 2: Investment Horizon */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-charcoal">Investment Horizon:</span>
                <span className="font-bold text-charcoal text-sm tabular-nums">
                  {tenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-subtle rounded-lg appearance-none cursor-pointer accent-slate-warm"
              />
              <div className="flex justify-between text-[10px] text-charcoal-light mt-1">
                <span>1 Year</span>
                <span>5 Years</span>
                <span>15 Years</span>
              </div>
            </div>

            {/* Return Rate Selection */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-charcoal">Expected SIP Return CAGR:</span>
                <span className="font-bold text-amber-soft text-sm tabular-nums">
                  {returnRate}% p.a.
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[10, 12, 15].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setReturnRate(rate)}
                    className={`py-1.5 px-2 rounded-card text-xs font-semibold border ${
                      returnRate === rate
                        ? 'bg-amber-soft text-white border-amber-soft'
                        : 'bg-background text-charcoal border-border'
                    }`}
                  >
                    {rate}% {rate === 10 ? '(Conservative)' : rate === 12 ? '(Index 50)' : '(Aggressive)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Visual & Impact */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-background p-5 rounded-card border border-border">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">
                Calculated Wealth Impact
              </span>

              <div className="mt-3 space-y-3">
                <div className="bg-surface p-3.5 rounded-card border border-border">
                  <span className="text-xs text-charcoal-muted">Direct Cash Kept in Bank</span>
                  <p className="text-xl font-bold text-charcoal tabular-nums mt-0.5">
                    {formatINR(yearlySaving)} <span className="text-xs font-normal text-charcoal-light">/ year</span>
                  </p>
                </div>

                <div className="bg-teal-subtle/70 p-4 rounded-card border border-teal-muted/30">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-muted">
                    <TrendingUp className="w-4 h-4" />
                    <span>Projected SIP Value in {tenureYears} Years</span>
                  </div>
                  <p className="text-2xl font-black text-charcoal tabular-nums mt-1">
                    {formatINR(Math.round(futureValue))}
                  </p>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Invested: {formatINR(totalInvested)} • <strong className="text-success-dark">Gain: +{formatINR(Math.round(wealthCreated))}</strong>
                  </p>
                </div>

                <p className="text-xs text-charcoal leading-relaxed bg-surface p-3 rounded-card border border-border">
                  💡 By cutting <strong>{formatINR(reductionAmount)}/mo</strong> from {category}, you save{' '}
                  <strong>{formatINR(yearlySaving)}/yr</strong>. Channeled into an Index SIP at {returnRate}%, it creates{' '}
                  <strong>{formatINR(Math.round(futureValue))}</strong> in {tenureYears} years!
                </p>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              size="sm"
              onClick={handleSaveCurrentScenario}
              isLoading={isSaving}
              leftIcon={<Bookmark className="w-4 h-4" />}
            >
              Save This Scenario to Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Saved Scenarios List */}
      {savedScenarios.length > 0 && (
        <Card className="shadow-subtle">
          <div className="border-b border-border pb-3 mb-4">
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
              Your Saved Scenarios ({savedScenarios.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedScenarios.map((sc) => (
              <div
                key={sc._id}
                className="p-3.5 bg-background rounded-card border border-border flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-charcoal">{sc.name}</p>
                  <p className="text-charcoal-muted mt-1 leading-relaxed">{sc.impact || sc.description}</p>
                  <div className="flex gap-3 mt-2 text-[11px]">
                    <span className="font-semibold text-teal-muted">Save: {formatINR(sc.monthlySaving)}/mo</span>
                    <span className="font-semibold text-charcoal">Yearly: {formatINR(sc.yearlySaving)}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteScenario(sc._id)}
                  className="p-1 text-charcoal-light hover:text-danger rounded"
                  title="Remove scenario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
