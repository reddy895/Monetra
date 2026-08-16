import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../store/apiSlice';
import { setCredentials } from '../../store/authSlice';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';
import { Select } from '../../components/UI/Select';
import { ShieldCheck, ArrowRight, User as UserIcon, Mail, Lock } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const SALARY_OPTIONS = [
  { value: 20000, label: '₹20,000 / month (Needs ₹10k, Wants ₹6k, Savings ₹4k)' },
  { value: 25000, label: '₹25,000 / month (Needs ₹12.5k, Wants ₹7.5k, Savings ₹5k)' },
  { value: 30000, label: '₹30,000 / month (Needs ₹15k, Wants ₹9k, Savings ₹6k)' },
  { value: 35000, label: '₹35,000 / month (Needs ₹17.5k, Wants ₹10.5k, Savings ₹7k)' },
  { value: 40000, label: '₹40,000 / month (Needs ₹20k, Wants ₹12k, Savings ₹8k)' },
  { value: 45000, label: '₹45,000 / month (Needs ₹22.5k, Wants ₹13.5k, Savings ₹9k)' },
  { value: 50000, label: '₹50,000 / month (Needs ₹25k, Wants ₹15k, Savings ₹10k)' },
];

import { Logo } from '../../components/UI/Logo';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    monthlySalary: 30000,
    riskProfile: 'moderate',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = formData.fullName.trim();
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanPassword = formData.password;

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await register({
        fullName: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        monthlySalary: formData.monthlySalary,
        riskProfile: formData.riskProfile
      }).unwrap();

      if (response.success && response.data) {
        dispatch(setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }));
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo size="lg" subtitle="Smart Personal Finance for Salaried India" className="justify-center mb-3" />
        <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
          Personalized 50/30/20 blueprint for Indian salaried professionals (₹20k - ₹50k)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="py-8 px-6 sm:px-8 shadow-subtle border-border">
          {error && (
            <div className="mb-5 bg-danger-subtle border border-danger/30 text-danger-dark px-3.5 py-2.5 rounded-card text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rahul@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password (min 6 characters)"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Select
              label="Your In-Hand Monthly Take-Home Salary (₹20K - ₹50K)"
              value={formData.monthlySalary}
              onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
              options={SALARY_OPTIONS}
              helperText="The 50/30/20 rules and mutual fund recommendations will be calculated on this."
            />

            <Select
              label="Investment Risk Profile"
              value={formData.riskProfile}
              onChange={(e) => setFormData({ ...formData, riskProfile: e.target.value as any })}
              options={[
                { value: 'conservative', label: 'Conservative (Index Funds & Debt focus)' },
                { value: 'moderate', label: 'Moderate (Flexi-cap, Large-cap & Index blend)' },
                { value: 'aggressive', label: 'Aggressive (Mid-cap, Small-cap & Flexi-cap high growth)' },
              ]}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started Now
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-xs text-charcoal-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-muted hover:text-teal-hover">
                Sign In
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-charcoal-light">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Rule-based personal finance • No third-party data selling</span>
        </div>
      </div>
    </div>
  );
};
