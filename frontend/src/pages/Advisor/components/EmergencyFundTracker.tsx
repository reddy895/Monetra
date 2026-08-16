import React, { useState } from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { Modal } from '../../../components/UI/Modal';
import { ProgressBar } from '../../../components/UI/ProgressBar';
import { formatINR } from '../../../utils/formatters';
import { EmergencyFundStatus } from '../../../types';
import { useAddGoalMutation, useUpdateGoalMutation } from '../../../store/apiSlice';
import { ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';

interface EmergencyFundTrackerProps {
  fund: EmergencyFundStatus;
  salary: number;
}

export const EmergencyFundTracker: React.FC<EmergencyFundTrackerProps> = ({ fund, salary }) => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const [addGoal] = useAddGoalMutation();
  const [updateGoal] = useUpdateGoalMutation();

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(contributionAmount);
    if (!amount || amount <= 0) return;

    try {
      if (fund.goalId) {
        await updateGoal({
          id: fund.goalId,
          data: { currentAmount: fund.currentAmount + amount }
        }).unwrap();
      } else {
        await addGoal({
          name: 'Emergency Fund (3 Months)',
          category: 'emergency_fund',
          targetAmount: fund.targetAmount,
          currentAmount: amount,
          targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          monthlyContribution: fund.monthlySuggestedSave,
          priority: 'high'
        }).unwrap();
      }
      setContributionAmount('');
      setIsDepositModalOpen(false);
    } catch (err) {
      console.error('Failed to contribute to emergency fund', err);
    }
  };

  return (
    <Card className="shadow-subtle border-l-4 border-l-teal-muted">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-teal-subtle text-teal-muted flex items-center justify-center font-bold text-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal">3-Month Emergency Fund Reserve</h3>
            <p className="text-xs text-charcoal-muted">
              Shield yourself against sudden medical bills, job transitions, or unexpected repairs
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsDepositModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Savings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-background p-3 rounded-card border border-border">
          <span className="text-[11px] text-charcoal-muted font-medium">Monthly Living Cost</span>
          <p className="text-base font-bold text-charcoal tabular-nums mt-0.5">
            {formatINR(fund.monthlyExpenses)}
          </p>
        </div>

        <div className="bg-background p-3 rounded-card border border-border">
          <span className="text-[11px] text-charcoal-muted font-medium">3-Month Target Fund</span>
          <p className="text-base font-bold text-charcoal tabular-nums mt-0.5">
            {formatINR(fund.targetAmount)}
          </p>
        </div>

        <div className="bg-background p-3 rounded-card border border-border">
          <span className="text-[11px] text-charcoal-muted font-medium">Current Reserve</span>
          <p className="text-base font-bold text-teal-muted tabular-nums mt-0.5">
            {formatINR(fund.currentAmount)}
          </p>
        </div>

        <div className="bg-background p-3 rounded-card border border-border">
          <span className="text-[11px] text-charcoal-muted font-medium">Suggested Monthly Save</span>
          <p className="text-base font-bold text-amber-soft tabular-nums mt-0.5">
            {formatINR(fund.monthlySuggestedSave)}/mo
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <ProgressBar
          value={fund.currentAmount}
          max={fund.targetAmount}
          label={`Emergency Reserve Progress (${fund.progressPercentage}%)`}
          color="teal"
          height="lg"
        />

        <div className="flex justify-between items-center text-xs text-charcoal-muted pt-1">
          <span>₹0</span>
          <span>
            {fund.isComplete ? (
              <span className="text-success-dark font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full 3-Month Target Achieved!
              </span>
            ) : (
              <span>{formatINR(fund.targetAmount - fund.currentAmount)} remaining to full safety</span>
            )}
          </span>
          <span>{formatINR(fund.targetAmount)}</span>
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Add to Emergency Fund"
        subtitle="Log savings deposited into your high-interest savings account or liquid fund"
        maxWidth="sm"
      >
        <form onSubmit={handleContribute} className="space-y-4">
          <Input
            label="Contribution Amount"
            type="number"
            min="100"
            required
            prefixText="₹"
            placeholder="e.g. 2000"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsDepositModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Contribution
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
