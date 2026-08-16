import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  prefixText,
  leftIcon,
  rightElement,
  showPasswordToggle,
  type = 'text',
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const shouldShowEye = isPassword || showPasswordToggle;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-charcoal-muted mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-card">
        {prefixText && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="text-charcoal-muted font-medium text-sm">{prefixText}</span>
          </div>
        )}
        {leftIcon && !prefixText && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-charcoal-light">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          className={`block w-full rounded-card border bg-surface py-2.5 text-charcoal placeholder:text-charcoal-light text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-teal-muted focus:border-teal-muted ${
            prefixText ? 'pl-8' : leftIcon ? 'pl-9' : 'pl-3.5'
          } ${
            shouldShowEye || rightElement ? 'pr-10' : 'pr-3.5'
          } ${
            error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border'
          } ${className}`}
          {...props}
        />
        {shouldShowEye && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-charcoal-light hover:text-charcoal focus:outline-none transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
        {rightElement && !shouldShowEye && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-charcoal-light">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-charcoal-light">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
