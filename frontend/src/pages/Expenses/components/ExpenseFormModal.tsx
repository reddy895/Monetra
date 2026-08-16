import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/UI/Modal';
import { Input } from '../../../components/UI/Input';
import { Select } from '../../../components/UI/Select';
import { Button } from '../../../components/UI/Button';
import { useGetCategoriesQuery, useAddExpenseMutation, useUpdateExpenseMutation } from '../../../store/apiSlice';
import { Expense } from '../../../types';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
}) => {
  const { data: categoriesData } = useGetCategoriesQuery();
  const [addExpense, { isLoading: isAdding }] = useAddExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();

  const categories = categoriesData?.data || [];

  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    tags: '',
    isRecurring: false,
    recurringFrequency: 'monthly',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        categoryId: expenseToEdit.categoryId?._id || '',
        amount: expenseToEdit.amount.toString(),
        description: expenseToEdit.description || '',
        date: new Date(expenseToEdit.date).toISOString().split('T')[0],
        paymentMethod: expenseToEdit.paymentMethod || 'UPI',
        tags: expenseToEdit.tags ? expenseToEdit.tags.join(', ') : '',
        isRecurring: !!expenseToEdit.isRecurring,
        recurringFrequency: expenseToEdit.recurringFrequency || 'monthly',
      });
    } else {
      setFormData({
        categoryId: categories.length > 0 ? categories[0]._id : '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        tags: '',
        isRecurring: false,
        recurringFrequency: 'monthly',
      });
    }
  }, [expenseToEdit, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.categoryId) {
      setError('Please select an expense category.');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }

    const payload = {
      categoryId: formData.categoryId,
      amount: Number(formData.amount),
      description: formData.description,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      isRecurring: formData.isRecurring,
      recurringFrequency: formData.isRecurring ? formData.recurringFrequency : null,
    };

    try {
      if (expenseToEdit) {
        await updateExpense({ id: expenseToEdit._id, data: payload }).unwrap();
      } else {
        await addExpense(payload).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save expense. Please try again.');
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: `${cat.name} (${cat.maxBudgetPercentage || 10}% suggested limit)`,
  }));

  const paymentOptions = [
    { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
    { value: 'Card', label: 'Debit / Credit Card' },
    { value: 'Bank Transfer', label: 'Net Banking / IMPS / NEFT' },
    { value: 'Cash', label: 'Cash' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Edit Transaction' : 'Record New Expense'}
      subtitle="Track your daily expenses to keep your 50/30/20 budget on track"
      maxWidth="md"
    >
      {error && (
        <div className="mb-4 bg-danger-subtle border border-danger/30 text-danger-dark px-3 py-2 rounded-card text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount"
          type="number"
          step="any"
          min="1"
          required
          prefixText="₹"
          placeholder="e.g. 450"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />

        <Select
          label="Category"
          required
          options={categoryOptions}
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <Select
            label="Payment Mode"
            required
            options={paymentOptions}
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          />
        </div>

        <Input
          label="Description / Merchant (Optional)"
          type="text"
          placeholder="e.g. Swiggy lunch, Electricity bill, Petrol"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Input
          label="Tags (Comma-separated)"
          type="text"
          placeholder="e.g. groceries, weekend, work"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        />

        {/* Recurring Toggle */}
        <div className="p-3 bg-background rounded-card border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-charcoal">Recurring Bill / Subscription</span>
            <p className="text-[11px] text-charcoal-muted">e.g. Monthly Wi-Fi, Rent, Netflix</p>
          </div>
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            className="w-4 h-4 rounded text-teal-muted focus:ring-teal-muted cursor-pointer"
          />
        </div>

        {formData.isRecurring && (
          <Select
            label="Repeat Frequency"
            value={formData.recurringFrequency}
            onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border mt-4">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="md" isLoading={isAdding || isUpdating}>
            {expenseToEdit ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
