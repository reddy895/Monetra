import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  Compass,
  TrendingUp,
  FileBarChart2
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Expenses', href: '/expenses', icon: ReceiptText },
    { name: 'Advisor', href: '/advisor', icon: Compass },
    { name: 'SIPs', href: '/sips', icon: TrendingUp },
    { name: 'Reports', href: '/reports', icon: FileBarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border md:hidden safe-area-pb">
      <div className="grid grid-cols-5 h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-teal-muted font-bold'
                    : 'text-charcoal-muted hover:text-charcoal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-full transition-transform ${
                      isActive ? 'bg-teal-subtle scale-110' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate max-w-[54px]">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
