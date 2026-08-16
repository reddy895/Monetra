import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  LogOut,
  User as UserIcon,
  Check,
  CheckCheck
} from 'lucide-react';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation
} from '../../store/apiSlice';
import { formatINR } from '../../utils/formatters';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: notifsData } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const notifications = notifsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile menu button & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-card text-charcoal-muted hover:bg-slate-subtle hover:text-charcoal md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">Salary Profile:</span>
          <span className="text-xs font-bold bg-teal-subtle text-teal-muted px-2.5 py-1 rounded-card border border-teal-muted/20 tabular-nums">
            {formatINR(user?.monthlySalary || 30000)}/month
          </span>
          <span className="text-xs text-charcoal-light capitalize">({user?.riskProfile || 'moderate'} Risk)</span>
        </div>
      </div>

      {/* Right: Notifications & User profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsUserMenuOpen(false);
            }}
            className="p-2 rounded-card text-charcoal-muted hover:bg-slate-subtle hover:text-charcoal relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-soft rounded-full ring-2 ring-surface" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-card border border-border shadow-lg z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-teal-subtle text-teal-muted px-1.5 py-0.5 rounded font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="text-[11px] text-teal-muted hover:text-teal-hover flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-charcoal-light">
                    No new notifications right now.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`p-3.5 text-xs transition-colors hover:bg-background flex items-start justify-between gap-2 ${
                        !notif.isRead ? 'bg-teal-subtle/30' : ''
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-charcoal">{notif.title}</p>
                        <p className="text-charcoal-muted mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                      {!notif.isRead && (
                        <button
                          onClick={() => markRead(notif._id)}
                          className="text-charcoal-light hover:text-teal-muted p-1"
                          title="Mark as read"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-card hover:bg-slate-subtle text-charcoal text-xs font-medium transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-warm text-white flex items-center justify-center font-bold text-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="hidden sm:inline font-semibold text-charcoal max-w-[120px] truncate">
              {user?.fullName || 'User'}
            </span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-card border border-border shadow-lg z-50 py-1 animate-fade-in">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-xs font-bold text-charcoal truncate">{user?.fullName}</p>
                <p className="text-[11px] text-charcoal-muted truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-2 text-xs text-charcoal hover:bg-background flex items-center gap-2"
              >
                <UserIcon className="w-3.5 h-3.5 text-charcoal-muted" />
                <span>Account & Salary Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs text-danger hover:bg-danger-subtle flex items-center gap-2 border-t border-border mt-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
