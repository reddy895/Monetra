import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased selection:bg-teal-subtle selection:text-teal-muted">
      {/* Drawer Sidebar for Desktop & Mobile Slide-in */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Container */}
      <div className="md:pl-64 flex flex-col flex-1 min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Responsive Main Container with Mobile Bottom Nav Clearance */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8 animate-fade-in min-w-0">
          <Outlet />
        </main>

        <footer className="py-4 text-center text-xs text-charcoal-light border-t border-border mt-auto hidden md:block no-print">
          Monetra • Smart Personal Finance for Salaried India (₹20,000 – ₹50,000)
        </footer>
      </div>

      {/* App-like Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
