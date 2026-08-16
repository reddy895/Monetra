import React from 'react';
import {
  Home,
  ShoppingCart,
  Car,
  Utensils,
  Zap,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  Layers,
  Shield,
  ShieldCheck,
  TrendingUp,
  PieChart,
  CreditCard,
  FileText,
  DollarSign,
  Coffee,
  Sparkles,
  HelpCircle,
  LucideProps
} from 'lucide-react';

interface AppIconProps extends LucideProps {
  name?: string;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ name = '', className = 'w-4 h-4', ...props }) => {
  const normalized = name.toLowerCase().trim();

  // Category mappings
  if (normalized.includes('rent') || normalized === 'home' || normalized === '🏠') {
    return <Home className={className} {...props} />;
  }
  if (normalized.includes('grocer') || normalized === 'shoppingcart' || normalized === '🛒') {
    return <ShoppingCart className={className} {...props} />;
  }
  if (normalized.includes('transport') || normalized.includes('commute') || normalized === 'car' || normalized === '🚗') {
    return <Car className={className} {...props} />;
  }
  if (normalized.includes('food') || normalized.includes('dining') || normalized === 'utensils' || normalized === '🍽️' || normalized === '🍲') {
    return <Utensils className={className} {...props} />;
  }
  if (normalized.includes('bill') || normalized.includes('electric') || normalized.includes('wifi') || normalized === 'zap' || normalized === '💡') {
    return <Zap className={className} {...props} />;
  }
  if (normalized.includes('shopping') || normalized === 'shoppingbag' || normalized === '🛍️') {
    return <ShoppingBag className={className} {...props} />;
  }
  if (normalized.includes('entertainment') || normalized.includes('movie') || normalized === 'film' || normalized === '🎬') {
    return <Film className={className} {...props} />;
  }
  if (normalized.includes('health') || normalized.includes('medic') || normalized === 'heartpulse' || normalized === '🏥') {
    return <HeartPulse className={className} {...props} />;
  }
  if (normalized.includes('education') || normalized.includes('course') || normalized === 'graduationcap' || normalized === '📚') {
    return <GraduationCap className={className} {...props} />;
  }
  if (normalized.includes('emergency') || normalized.includes('shield') || normalized === '🛡️') {
    return <ShieldCheck className={className} {...props} />;
  }
  if (normalized.includes('sip') || normalized.includes('invest') || normalized.includes('wealth') || normalized === '📈' || normalized === '🚀' || normalized === '💎') {
    return <TrendingUp className={className} {...props} />;
  }
  if (normalized.includes('budget') || normalized === '📊') {
    return <PieChart className={className} {...props} />;
  }
  if (normalized.includes('card') || normalized.includes('saving') || normalized === '💳') {
    return <CreditCard className={className} {...props} />;
  }
  if (normalized.includes('tax') || normalized === '📑') {
    return <FileText className={className} {...props} />;
  }

  // Default fallback
  return <Layers className={className} {...props} />;
};
