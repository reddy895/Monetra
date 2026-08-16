import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/UI/Modal';
import { Input } from '../../../components/UI/Input';
import { Select } from '../../../components/UI/Select';
import { Button } from '../../../components/UI/Button';
import { formatINR } from '../../../utils/formatters';
import {
  useAddSIPMutation,
  useUpdateSIPMutation,
  useGetSIPRecommendationsQuery
} from '../../../store/apiSlice';
import { SIPItem } from '../../../types';

interface AddSIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  sipToEdit?: SIPItem | null;
  userSalary?: number;
}

const CATEGORY_OPTIONS = [
  { value: 'Index', label: 'Index Fund (Low cost, tracks Nifty 50)' },
  { value: 'Flexi Cap', label: 'Flexi Cap (Multi-cap large/mid/small equities)' },
  { value: 'Large Cap', label: 'Large Cap (Stable blue-chip companies)' },
  { value: 'Mid Cap', label: 'Mid Cap (High-growth medium companies)' },
  { value: 'Small Cap', label: 'Small Cap (High potential emerging leaders)' },
  { value: 'ELSS', label: 'ELSS (Section 80C Tax-saving 3-yr lock-in)' },
  { value: 'Debt', label: 'Debt Fund (Low risk, steady accrual)' },
  { value: 'Balanced', label: 'Balanced / Hybrid (Equity + Debt mix)' },
];

export const AddSIPModal: React.FC<AddSIPModalProps> = ({
  isOpen,
  onClose,
  sipToEdit,
  userSalary = 35000,
}) => {
  const { data: recsData } = useGetSIPRecommendationsQuery({ salary: userSalary });
  const [addSIP, { isLoading: isAdding }] = useAddSIPMutation();
  const [updateSIP, { isLoading: isUpdating }] = useUpdateSIPMutation();

  const recommendations = recsData?.data?.recommendations || [];

  const [formData, setFormData] = useState({
    fundName: '',
    amc: '',
    category: 'Flexi Cap',
    amount: '2000',
    startDate: new Date().toISOString().split('T')[0],
    frequency: 'monthly',
    fundCode: '',
    nav: 100,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (sipToEdit) {
      setFormData({
        fundName: sipToEdit.fundName,
        amc: sipToEdit.amc,
        category: sipToEdit.category,
        amount: sipToEdit.amount.toString(),
        startDate: new Date(sipToEdit.startDate).toISOString().split('T')[0],
        frequency: sipToEdit.frequency,
        fundCode: sipToEdit.fundCode,
        nav: 100,
      });
    } else if (recommendations.length > 0) {
      const topRec = recommendations[0];
      setFormData({
        fundName: topRec.fundName,
        amc: topRec.amc,
        category: topRec.fundCategory,
        amount: topRec.recommendedAmount.toString(),
        startDate: new Date().toISOString().split('T')[0],
        frequency: 'monthly',
        fundCode: topRec.fundCode,
        nav: topRec.currentNav || 100,
      });
    }
  }, [sipToEdit, recommendations, isOpen]);

  const handleSelectRecommendation = (rec: any) => {
    setFormData({
      ...formData,
      fundName: rec.fundName,
      amc: rec.amc,
      category: rec.fundCategory,
      amount: rec.recommendedAmount.toString(),
      fundCode: rec.fundCode,
      nav: rec.currentNav || 100,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fundName || !formData.amc) {
      setError('Please fill in fund name and AMC.');
      return;
    }

    if (Number(formData.amount) < 500) {
      setError('Minimum monthly SIP amount in India is ₹500.');
      return;
    }

    const payload = {
      fundName: formData.fundName,
      amc: formData.amc,
      category: formData.category,
      amount: Number(formData.amount),
      startDate: formData.startDate,
      frequency: formData.frequency,
      fundCode: formData.fundCode || `FND_${Date.now()}`,
      nav: formData.nav,
    };

    try {
      if (sipToEdit) {
        await updateSIP({ id: sipToEdit._id, data: payload }).unwrap();
      } else {
        await addSIP(payload).unwrap();
      }
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save SIP. Please try again.');
    }
  };

  // 10-year projected returns preview
  const amt = Number(formData.amount) || 2000;
  const calc10Y = (rate: number) => {
    const i = rate / 100 / 12;
    const n = 120;
    return Math.round(amt * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sipToEdit ? 'Edit SIP Investment' : 'Start / Track New Mutual Fund SIP'}
      subtitle="Regular monthly SIPs harness the power of rupee cost averaging & long-term compounding"
      maxWidth="2xl"
    >
      {error && (
        <div className="mb-4 bg-danger-subtle border border-danger/30 text-danger-dark px-3 py-2 rounded-card text-xs">
          {error}
        </div>
      )}

      {/* Pre-populated Recommended Funds for Salary Bracket */}
      {!sipToEdit && recommendations.length > 0 && (
        <div className="mb-5 bg-background p-3.5 rounded-card border border-border">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted block mb-2">
            ⭐ Recommended for your ₹{(userSalary / 1000).toFixed(0)}k salary bracket (Quick Pick):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {recommendations.slice(0, 3).map((rec) => (
              <button
                key={rec._id}
                type="button"
                onClick={() => handleSelectRecommendation(rec)}
                className={`p-2.5 rounded-card border text-left text-xs transition-all ${
                  formData.fundName === rec.fundName
                    ? 'bg-teal-subtle border-teal-muted text-teal-muted font-bold shadow-xs'
                    : 'bg-surface border-border hover:bg-slate-subtle text-charcoal'
                }`}
              >
                <p className="truncate font-semibold">{rec.fundName}</p>
                <div className="flex justify-between items-center text-[10px] text-charcoal-muted mt-1">
                  <span>{rec.fundCategory}</span>
                  <span className="font-bold text-teal-muted">{formatINR(rec.recommendedAmount)}/mo</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Mutual Fund Scheme Name"
            required
            placeholder="e.g. Parag Parikh Flexi Cap Fund"
            value={formData.fundName}
            onChange={(e) => setFormData({ ...formData, fundName: e.target.value })}
          />

          <Input
            label="AMC / Fund House"
            required
            placeholder="e.g. PPFAS / UTI / Mirae / HDFC"
            value={formData.amc}
            onChange={(e) => setFormData({ ...formData, amc: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Fund Category"
            options={CATEGORY_OPTIONS}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <Input
            label="Monthly SIP Amount (min ₹500)"
            type="number"
            min="500"
            step="100"
            required
            prefixText="₹"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <Input
            label="SIP Start Date"
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        {/* 10-Year Growth Projection Preview */}
        <div className="bg-teal-subtle/50 p-4 rounded-card border border-teal-muted/30">
          <span className="text-[11px] font-semibold text-teal-muted block mb-2">
            📈 10-Year Compounding Projection for {formatINR(amt)}/month (Total Invested: {formatINR(amt * 120)}):
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-surface p-2.5 rounded border border-border">
              <span className="text-[10px] text-charcoal-muted">Conservative (10%)</span>
              <p className="font-bold text-charcoal tabular-nums mt-0.5">{formatINR(calc10Y(10))}</p>
            </div>
            <div className="bg-surface p-2.5 rounded border border-border">
              <span className="text-[10px] text-teal-muted font-bold">Moderate / Index (12%)</span>
              <p className="font-bold text-teal-muted tabular-nums mt-0.5">{formatINR(calc10Y(12))}</p>
            </div>
            <div className="bg-surface p-2.5 rounded border border-border">
              <span className="text-[10px] text-amber-soft font-bold">Aggressive (15%)</span>
              <p className="font-bold text-charcoal tabular-nums mt-0.5">{formatINR(calc10Y(15))}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-border mt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isAdding || isUpdating}>
            {sipToEdit ? 'Save Changes' : 'Start SIP'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
