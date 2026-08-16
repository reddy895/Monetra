import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  Compass,
  TrendingUp,
  FileBarChart2,
  Settings,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

import { Logo } from '../UI/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Expense Tracker', href: '/expenses', icon: ReceiptText },
    {
      name: 'Smart Advisor',
      href: '/advisor',
      icon: Compass,
      badge: '50/30/20',
      badgeColor: 'bg-amber-subtle text-amber-soft border-amber-soft/30'
    },
    {
      name: 'SIP Suggestions',
      href: '/sips',
      icon: TrendingUp,
      badge: 'Growth Graph',
      badgeColor: 'bg-teal-subtle text-teal-muted border-teal-muted/30'
    },
    { name: 'Monthly Reports', href: '/reports', icon: FileBarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Logo size="md" subtitle="Smart Finance for India" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-charcoal-light uppercase tracking-wider">
            Core Modules
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-card text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-subtle text-teal-muted font-semibold shadow-xs'
                      : 'text-charcoal-muted hover:bg-slate-subtle hover:text-charcoal'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Audience Pill & Security Badge */}
        <div className="p-4 border-t border-border bg-background/50 m-3 rounded-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
            <Sparkles className="w-4 h-4 text-amber-soft" />
            <span>Rule-Based Intelligence</span>
          </div>
          <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
            No generative AI hallucination or chatbots. 100% deterministic rules & Indian wealth frameworks.
          </p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-charcoal-light font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Secured with JWT & Passwords Encrypted</span>
          </div>
        </div>
      </aside>
    </>
  );
};
