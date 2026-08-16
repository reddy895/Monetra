import React, { useState } from 'react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { Select } from '../../../components/UI/Select';
import { Modal } from '../../../components/UI/Modal';
import { ProgressBar } from '../../../components/UI/ProgressBar';
import { Badge } from '../../../components/UI/Badge';
import { formatINR, formatDate } from '../../../utils/formatters';
import { FinancialGoal } from '../../../types';
import {
  useGetGoalsQuery,
  useAddGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation
} from '../../../store/apiSlice';
import { Target, Plus, Trash2, Edit3, CheckCircle } from 'lucide-react';

const GOAL_CATEGORIES = [
  { value: 'emergency_fund', label: '🛡️ Emergency Fund' },
  { value: 'vacation', label: '🏖️ Vacation & Travel' },
  { value: 'gadget', label: '📱 Gadget / Electronics' },
  { value: 'education', label: '📚 Upskilling & Education' },
  { value: 'vehicle', label: '🛵 Bike / Car Downpayment' },
  { value: 'wedding', label: '💍 Wedding / Family Event' },
  { value: 'home', label: '🏡 Home Renovation / Furniture' },
  { value: 'other', label: '🎯 Other Goal' },
];

export const GoalsManager: React.FC = () => {
  const { data: goalsData } = useGetGoalsQuery();
  const [addGoal] = useAddGoalMutation();
  const [updateGoal] = useUpdateGoalMutation();
  const [deleteGoal] = useDeleteGoalMutation();

  const goals = goalsData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [fundsToAdd, setFundsToAdd] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'gadget',
    targetAmount: '',
    currentAmount: '',
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
    monthlyContribution: '',
    priority: 'medium',
  });

  const handleOpenAdd = () => {
    setSelectedGoal(null);
    setFormData({
      name: '',
      category: 'gadget',
      targetAmount: '',
      currentAmount: '',
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
      monthlyContribution: '',
      priority: 'medium',
    });
    setIsModalOpen(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category as any,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount || 0),
      targetDate: formData.targetDate,
      monthlyContribution: Number(formData.monthlyContribution || 0),
      priority: formData.priority as any,
    };

    try {
      if (selectedGoal) {
        await updateGoal({ id: selectedGoal._id, data: payload }).unwrap();
      } else {
        await addGoal(payload).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save goal', err);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !fundsToAdd) return;
    const addAmt = Number(fundsToAdd);
    const newCurrent = selectedGoal.currentAmount + addAmt;
    const isCompleted = newCurrent >= selectedGoal.targetAmount;

    try {
      await updateGoal({
        id: selectedGoal._id,
        data: {
          currentAmount: newCurrent,
          status: isCompleted ? 'completed' : 'active',
        },
      }).unwrap();
      setIsAddFundsModalOpen(false);
      setFundsToAdd('');
    } catch (err) {
      console.error('Failed to add funds', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this financial goal?')) {
      await deleteGoal(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-muted" />
            <span>Target Financial Goals</span>
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Turn dreams into structured monthly targets without falling into EMI debt
          </p>
        </div>
        <Button size="sm" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="p-8 text-center shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-slate-subtle text-charcoal-muted flex items-center justify-center mx-auto mb-3 text-xl">
            🎯
          </div>
          <h4 className="text-sm font-semibold text-charcoal">No Financial Goals Set Yet</h4>
          <p className="text-xs text-charcoal-muted mt-1 max-w-md mx-auto">
            Setting short and medium-term targets (e.g. Vacation, New Phone, Course Certification) helps you stay disciplined.
          </p>
          <Button size="sm" className="mt-4" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Set Your First Goal
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <Card key={goal._id} className="flex flex-col justify-between shadow-subtle hover:border-slate-300 transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-charcoal">{goal.name}</span>
                    <Badge
                      variant={isCompleted ? 'success' : goal.priority === 'high' ? 'danger' : 'neutral'}
                      size="sm"
                    >
                      {isCompleted ? 'Completed' : `${goal.priority} priority`}
                    </Badge>
                  </div>

                  <div className="flex items-baseline justify-between mt-3 mb-1">
                    <span className="text-lg font-bold text-charcoal tabular-nums">
                      {formatINR(goal.currentAmount)}
                    </span>
                    <span className="text-xs text-charcoal-muted tabular-nums">
                      target {formatINR(goal.targetAmount)}
                    </span>
                  </div>

                  <ProgressBar
                    value={goal.currentAmount}
                    max={goal.targetAmount}
                    color={isCompleted ? 'green' : 'teal'}
                    height="sm"
                    showPercentage={false}
                  />

                  <div className="flex justify-between items-center text-[11px] text-charcoal-muted mt-2">
                    <span>Target Date: {formatDate(goal.targetDate)}</span>
                    <span className="font-semibold text-charcoal">{progress}%</span>
                  </div>

                  {goal.monthlyContribution > 0 && !isCompleted && (
                    <p className="text-[11px] text-teal-muted font-medium mt-2 bg-teal-subtle/60 px-2 py-1 rounded">
                      Suggested: {formatINR(goal.monthlyContribution)}/month
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 mt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1 px-2.5"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setFundsToAdd('');
                      setIsAddFundsModalOpen(true);
                    }}
                  >
                    + Add Savings
                  </Button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setFormData({
                          name: goal.name,
                          category: goal.category,
                          targetAmount: goal.targetAmount.toString(),
                          currentAmount: goal.currentAmount.toString(),
                          targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
                          monthlyContribution: goal.monthlyContribution.toString(),
                          priority: goal.priority,
                        });
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-charcoal-muted hover:text-teal-muted rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="p-1.5 text-charcoal-muted hover:text-danger rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Goal Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedGoal ? 'Edit Goal' : 'Create Financial Goal'}
        subtitle="Define a realistic savings milestone with target date"
        maxWidth="md"
      >
        <form onSubmit={handleSaveGoal} className="space-y-4">
          <Input
            label="Goal Name"
            required
            placeholder="e.g. Goa Vacation with College Friends"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Select
            label="Category"
            options={GOAL_CATEGORIES}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Amount"
              type="number"
              min="1000"
              required
              prefixText="₹"
              placeholder="e.g. 20000"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            />

            <Input
              label="Current Saved Amount"
              type="number"
              min="0"
              prefixText="₹"
              placeholder="e.g. 5000"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Completion Date"
              type="date"
              required
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'high', label: 'High Priority' },
                { value: 'medium', label: 'Medium Priority' },
                { value: 'low', label: 'Low Priority' },
              ]}
            />
          </div>

          <Input
            label="Planned Monthly Contribution"
            type="number"
            min="0"
            prefixText="₹"
            placeholder="e.g. 2000"
            value={formData.monthlyContribution}
            onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Funds to Goal Modal */}
      <Modal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        title={`Add Savings to ${selectedGoal?.name}`}
        subtitle="Log funds you have set aside towards this goal"
        maxWidth="sm"
      >
        <form onSubmit={handleAddFunds} className="space-y-4">
          <Input
            label="Amount Saved"
            type="number"
            min="100"
            required
            prefixText="₹"
            placeholder="e.g. 1500"
            value={fundsToAdd}
            onChange={(e) => setFundsToAdd(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddFundsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Record Savings
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
