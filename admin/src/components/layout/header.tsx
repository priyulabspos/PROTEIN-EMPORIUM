'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  CheckCircle2, 
  MapPin, 
  Shield, 
  LogOut, 
  User, 
  ExternalLink,
  AlertTriangle,
  PackageCheck,
  X
} from 'lucide-react';
import { store } from '@/lib/store';
import { StaffRole } from '@/lib/types';

interface HeaderProps {
  onSearchOpen?: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const staff = store.getCurrentStaff();
  const notifications = store.getNotifications();
  const unreadNotifs = notifications.filter(n => !n.is_read);

  const handleRoleChange = (role: StaffRole) => {
    store.switchRole(role);
    setShowRoleSwitcher(false);
    window.location.reload();
  };

  const handleLogout = () => {
    if (confirm('Log out from Protein Emporium Admin Console?')) {
      window.location.href = '/login';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-brand-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Global Search Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center justify-between px-3 py-2 bg-brand-subtle border border-brand-border rounded-md text-xs text-brand-muted hover:border-brand-orange hover:bg-white transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="text-brand-muted group-hover:text-brand-orange transition-colors" />
            <span>Search products, orders (PE-...), customers...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white border border-brand-border rounded text-brand-black">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Live Store Dispatch Status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-success-bg border border-green-200 text-xs font-semibold text-brand-success">
          <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
          <span>Fulfillment Live: 24-Hr Delhivery / BlueDart</span>
        </div>

        {/* Role Switcher Pill (Preview RBAC matrix easily) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-brand-border bg-white text-xs font-bold text-brand-black hover:border-brand-orange transition-colors"
            title="Preview dashboard with another Staff Role"
          >
            <Shield size={13} className="text-brand-orange" />
            <span className="uppercase text-[11px]">{staff.role.replace('_', ' ')}</span>
            <span className="text-[10px] text-brand-muted">▾</span>
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-brand-border rounded-lg shadow-modal p-2 z-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted px-2 py-1 border-b border-brand-border mb-1">
                Switch Role Preview
              </div>
              {(['SUPER_ADMIN', 'MANAGER', 'INVENTORY_STAFF', 'SUPPORT_STAFF', 'CONTENT_EDITOR'] as StaffRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs font-semibold flex items-center justify-between ${
                    staff.role === r ? 'bg-brand-orange-light text-brand-orange font-bold' : 'hover:bg-brand-subtle text-brand-black'
                  }`}
                >
                  <span>{r.replace('_', ' ')}</span>
                  {staff.role === r && <CheckCircle2 size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-md border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-black hover:bg-brand-subtle transition-colors relative"
            aria-label="View notifications"
          >
            <Bell size={16} />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-brand-border rounded-lg shadow-modal z-50 overflow-hidden">
              <div className="px-4 py-3 bg-brand-subtle border-b border-brand-border flex items-center justify-between">
                <span className="font-heading text-sm font-bold tracking-wider uppercase text-brand-black">
                  Notifications ({unreadNotifs.length})
                </span>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-brand-muted hover:text-brand-black"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-brand-border">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-3 text-xs transition-colors hover:bg-brand-subtle cursor-pointer ${
                      n.is_read ? 'opacity-60' : 'bg-brand-orange-light/20'
                    }`}
                    onClick={() => store.markNotificationRead(n.id)}
                  >
                    <div className="font-bold text-brand-black mb-0.5 flex items-center justify-between">
                      <span>{n.title}</span>
                      {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                    </div>
                    <p className="text-brand-muted text-[11px] leading-relaxed mb-1">{n.message}</p>
                    <span className="text-[10px] text-brand-muted font-mono">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-brand-border text-center bg-brand-subtle">
                <Link 
                  href="/audit-logs" 
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-bold text-brand-orange hover:underline uppercase tracking-wider"
                >
                  View Full Audit Log →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 focus:outline-none"
            aria-label="Admin Profile Menu"
          >
            <div className="w-9 h-9 rounded-full bg-brand-black text-brand-orange flex items-center justify-center font-bold text-xs shadow-sm">
              {staff.full_name.slice(0, 2).toUpperCase()}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-brand-border rounded-lg shadow-modal p-2 z-50">
              <div className="px-3 py-2 border-b border-brand-border mb-1">
                <div className="font-bold text-xs text-brand-black truncate">{staff.full_name}</div>
                <div className="text-[11px] text-brand-muted truncate">{staff.email}</div>
                <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-orange text-white uppercase tracking-wider">
                  {staff.role}
                </span>
              </div>
              <Link
                href="/settings"
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-brand-black hover:bg-brand-subtle flex items-center gap-2"
              >
                <User size={14} className="text-brand-muted" />
                Profile &amp; Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-brand-danger hover:bg-brand-danger-bg flex items-center gap-2 mt-1"
              >
                <LogOut size={14} className="text-brand-danger" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
