import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateUser } from '../../store/authSlice';
import {
  useUpdateProfileMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation
} from '../../store/apiSlice';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { formatINR } from '../../utils/formatters';
import { User, Settings, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

const SALARY_OPTIONS = [
  { value: 20000, label: '₹20,000 / month (Needs ₹10k, Wants ₹6k, Savings ₹4k)' },
  { value: 25000, label: '₹25,000 / month (Needs ₹12.5k, Wants ₹7.5k, Savings ₹5k)' },
  { value: 30000, label: '₹30,000 / month (Needs ₹15k, Wants ₹9k, Savings ₹6k)' },
  { value: 35000, label: '₹35,000 / month (Needs ₹17.5k, Wants ₹10.5k, Savings ₹7k)' },
  { value: 40000, label: '₹40,000 / month (Needs ₹20k, Wants ₹12k, Savings ₹8k)' },
  { value: 45000, label: '₹45,000 / month (Needs ₹22.5k, Wants ₹13.5k, Savings ₹9k)' },
  { value: 50000, label: '₹50,000 / month (Needs ₹25k, Wants ₹15k, Savings ₹10k)' },
];

export const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [addCategory, { isLoading: isAddingCategory }] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = categoriesData?.data || [];

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    monthlySalary: user?.monthlySalary || 35000,
    riskProfile: user?.riskProfile || 'moderate',
  });
  const [successMsg, setSuccessMsg] = useState('');

  const [newCat, setNewCat] = useState({
    name: '',
    icon: '🏷️',
    color: '#5B7F7A',
    maxBudgetPercentage: 10,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        monthlySalary: user.monthlySalary || 35000,
        riskProfile: user.riskProfile || 'moderate',
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      const res = await updateProfile(profileData).unwrap();
      if (res.success && res.data) {
        dispatch(updateUser(res.data));
        setSuccessMsg('Profile and salary settings updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Update profile error', err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    try {
      await addCategory(newCat).unwrap();
      setNewCat({ name: '', icon: '🏷️', color: '#5B7F7A', maxBudgetPercentage: 10 });
    } catch (err) {
      console.error('Add category error', err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this custom category?')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-charcoal tracking-tight">Account & Salary Preferences</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Configure your in-hand monthly salary, risk appetite, and custom expense tracking categories.
        </p>
      </div>

      {successMsg && (
        <div className="bg-success-subtle border border-success/30 text-success-dark px-4 py-3 rounded-card text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Salary & Risk Profile Card */}
      <Card className="shadow-subtle">
        <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-muted" />
            <h3 className="text-sm font-bold text-charcoal">Salary & Risk Profile</h3>
          </div>
          <Badge variant="neutral" size="sm">
            Target Bracket: ₹20k - ₹50k
          </Badge>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            required
          />

          <Select
            label="In-Hand Take-Home Monthly Salary"
            value={profileData.monthlySalary}
            onChange={(e) => setProfileData({ ...profileData, monthlySalary: Number(e.target.value) })}
            options={SALARY_OPTIONS}
            helperText="50/30/20 budgets, emergency fund benchmarks, and fund recommendations dynamically recalibrate."
          />

          <Select
            label="Investment Risk Profile"
            value={profileData.riskProfile}
            onChange={(e) => setProfileData({ ...profileData, riskProfile: e.target.value as any })}
            options={[
              { value: 'conservative', label: 'Conservative (Index Funds & Debt focus)' },
              { value: 'moderate', label: 'Moderate (Flexi-cap, Large-cap & Index blend)' },
              { value: 'aggressive', label: 'Aggressive (Mid-cap, Small-cap & Flexi-cap high growth)' },
            ]}
          />

          <div className="flex justify-end pt-3 border-t border-border">
            <Button type="submit" size="md" isLoading={isUpdatingProfile}>
              Save Profile Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* Categories Management Card */}
      <Card className="shadow-subtle">
        <div className="border-b border-border pb-3 mb-4">
          <h3 className="text-sm font-bold text-charcoal">Expense Categories & Budget Limits</h3>
          <p className="text-xs text-charcoal-muted">System default categories and your custom labels</p>
        </div>

        {/* Existing Categories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-3 bg-background rounded-card border border-border flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{cat.icon || '📊'}</span>
                <div>
                  <p className="font-semibold text-charcoal">{cat.name}</p>
                  <p className="text-[10px] text-charcoal-muted">Max {cat.maxBudgetPercentage || 10}% of salary</p>
                </div>
              </div>

              {cat.isDefault ? (
                <span className="text-[10px] font-semibold bg-slate-subtle text-charcoal-light px-2 py-0.5 rounded">
                  Default
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="p-1 text-charcoal-light hover:text-danger rounded"
                  title="Delete custom category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Custom Category Form */}
        <div className="bg-slate-subtle/40 p-4 rounded-card border border-border">
          <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
            Add Custom Category
          </h4>
          <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <Input
                label="Category Name"
                placeholder="e.g. Pet Care, Fitness"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Icon (Emoji)"
                placeholder="🐕"
                value={newCat.icon}
                onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
              />
            </div>
            <Button type="submit" size="md" isLoading={isAddingCategory} leftIcon={<Plus className="w-4 h-4" />}>
              Add Category
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
