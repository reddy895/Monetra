import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/UI/Modal';
import { SIPGrowthChart } from '../../../components/Charts/SIPGrowthChart';
import { formatINR } from '../../../utils/formatters';
import { useCalculateSIPMutation } from '../../../store/apiSlice';

interface SIPCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

export const SIPCalculatorModal: React.FC<SIPCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 3000,
}) => {
  const [monthlyAmount, setMonthlyAmount] = useState(initialAmount);
  const [annualRate, setAnnualRate] = useState(12);
  const [tenureYears, setTenureYears] = useState(10);

  const [calculateSIP, { data: calcResult }] = useCalculateSIPMutation();

  useEffect(() => {
    if (isOpen) {
      calculateSIP({ monthlyAmount, annualRate, tenureYears });
    }
  }, [monthlyAmount, annualRate, tenureYears, isOpen]);

  const result = calcResult?.data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SIP Mutual Fund Wealth Calculator"
      subtitle="Simulate the long-term compounding power of systematic monthly investing"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sliders Controls */}
          <div className="lg:col-span-5 space-y-4 bg-background p-4 rounded-card border border-border">
            {/* Slider 1: Monthly Amount */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-charcoal">Monthly Investment:</span>
                <span className="font-bold text-teal-muted text-sm tabular-nums">
                  {formatINR(monthlyAmount)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-subtle rounded-lg appearance-none cursor-pointer accent-teal-muted"
              />
              <div className="flex justify-between text-[10px] text-charcoal-light mt-0.5">
                <span>₹500</span>
                <span>₹10,000</span>
                <span>₹25,000</span>
              </div>
            </div>

            {/* Slider 2: Expected Return */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-charcoal">Expected Return Rate (p.a.):</span>
                <span className="font-bold text-amber-soft text-sm tabular-nums">
                  {annualRate}%
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="20"
                step="0.5"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-subtle rounded-lg appearance-none cursor-pointer accent-amber-soft"
              />
              <div className="flex justify-between text-[10px] text-charcoal-light mt-0.5">
                <span>6% (Debt)</span>
                <span>12% (Nifty 50)</span>
                <span>20% (Small Cap)</span>
              </div>
            </div>

            {/* Slider 3: Tenure */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-charcoal">Time Horizon (Years):</span>
                <span className="font-bold text-charcoal text-sm tabular-nums">
                  {tenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-subtle rounded-lg appearance-none cursor-pointer accent-slate-warm"
              />
              <div className="flex justify-between text-[10px] text-charcoal-light mt-0.5">
                <span>1 Yr</span>
                <span>10 Yrs</span>
                <span>25 Yrs</span>
              </div>
            </div>

            {/* Preset shortcuts */}
            <div className="pt-2 border-t border-border">
              <span className="text-[10px] font-semibold uppercase text-charcoal-muted block mb-1.5">
                Popular Scenarios:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => { setMonthlyAmount(2000); setAnnualRate(12); setTenureYears(10); }}
                  className="py-1 px-1.5 bg-surface hover:bg-slate-subtle border border-border rounded text-[10px] font-semibold text-charcoal"
                >
                  ₹2k @ 12% (10Y)
                </button>
                <button
                  type="button"
                  onClick={() => { setMonthlyAmount(5000); setAnnualRate(13); setTenureYears(15); }}
                  className="py-1 px-1.5 bg-surface hover:bg-slate-subtle border border-border rounded text-[10px] font-semibold text-charcoal"
                >
                  ₹5k @ 13% (15Y)
                </button>
                <button
                  type="button"
                  onClick={() => { setMonthlyAmount(10000); setAnnualRate(14); setTenureYears(20); }}
                  className="py-1 px-1.5 bg-surface hover:bg-slate-subtle border border-border rounded text-[10px] font-semibold text-charcoal"
                >
                  ₹10k @ 14% (20Y)
                </button>
              </div>
            </div>
          </div>

          {/* Results Summary & Compounding Chart */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {result && (
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-background p-2.5 rounded-card border border-border">
                  <span className="text-[10px] text-charcoal-muted font-medium">Invested Amount</span>
                  <p className="text-sm font-bold text-charcoal tabular-nums mt-0.5">
                    {formatINR(result.totalInvested)}
                  </p>
                </div>
                <div className="bg-background p-2.5 rounded-card border border-border">
                  <span className="text-[10px] text-charcoal-muted font-medium">Est. Wealth Gain</span>
                  <p className="text-sm font-bold text-teal-muted tabular-nums mt-0.5">
                    +{formatINR(result.wealthGained)}
                  </p>
                </div>
                <div className="bg-teal-subtle/60 p-2.5 rounded-card border border-teal-muted/30">
                  <span className="text-[10px] text-teal-muted font-bold">Total Corpus</span>
                  <p className="text-sm font-black text-charcoal tabular-nums mt-0.5">
                    {formatINR(result.futureValue)}
                  </p>
                </div>
              </div>
            )}

            {/* Compounding Chart */}
            <div className="bg-surface rounded-card border border-border p-3">
              <span className="text-[11px] font-bold text-charcoal block mb-1">
                Compounding Growth Curve (Invested vs Returns)
              </span>
              <SIPGrowthChart data={result?.yearlyBreakdown || []} height={200} />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
