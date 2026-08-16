import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/apiSlice';
import { setCredentials } from '../../store/authSlice';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';
import { Logo } from '../../components/UI/Logo';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      const response = await login({ email: cleanEmail, password: cleanPassword }).unwrap();
      if (response.success && response.data) {
        dispatch(setCredentials({
          user: response.data.user,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        }));
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid email or password. Please check your credentials or click the eye icon to verify what you typed.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo size="lg" subtitle="Smart Personal Finance for Salaried India" className="justify-center mb-3" />
        <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
          Rule-based 50/30/20 budgeting and SIP wealth tracker for salaried earners (₹20k - ₹50k)
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-6 px-5 sm:py-8 sm:px-8 shadow-subtle border-border">
          <div className="mb-5 pb-3 border-b border-border text-center">
            <h3 className="text-base font-bold text-charcoal">Sign In to Your Account</h3>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              Enter your credentials to access your financial dashboard
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-danger-subtle border border-danger/30 text-danger-dark px-3.5 py-2.5 rounded-card text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center">
            <p className="text-xs text-charcoal-muted">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-teal-muted hover:text-teal-hover">
                Create a New Account
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-charcoal-light">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Secured with JWT authentication & BCrypt password encryption</span>
        </div>
      </div>
    </div>
  );
};
