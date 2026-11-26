'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { store } from '@/lib/store';
import { StaffRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@proteinemporium.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (attempts >= 5) {
      setError('Too many failed login attempts. Account temporarily locked for 15 minutes.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Find staff in store
      const allStaff = store.getAllStaff();
      const staffMember = allStaff.find(s => s.email.toLowerCase() === email.toLowerCase());

      if (staffMember && (password === 'admin123' || password === 'password')) {
        store.switchRole(staffMember.role);
        router.push('/dashboard');
      } else {
        setAttempts(prev => prev + 1);
        setError(`Invalid credentials. Attempt ${attempts + 1} of 5. Demo password: admin123`);
        setLoading(false);
      }
    }, 400);
  };

  const quickFill = (roleEmail: string, role: StaffRole) => {
    setEmail(roleEmail);
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-brand-subtle flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-brand-border rounded-2xl shadow-modal p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-brand-black p-2 flex items-center justify-center mb-3 shadow-sm">
            <img 
              src="/assets/logo.png" 
              alt="Protein Emporium Lion Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.png';
              }} 
            />
          </div>
          <h1 className="font-heading text-2xl font-black text-brand-black uppercase tracking-wider">
            Protein Emporium
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Official Merchant &amp; Administrator Portal
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-brand-danger-bg border border-red-200 text-xs font-semibold text-brand-danger flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-1.5">
              Staff Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-brand-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@proteinemporium.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-black uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-brand-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-brand-muted hover:text-brand-black"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>Authenticating Credentials...</span>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Sign In to Admin Portal</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Role Switcher Demo Buttons */}
        <div className="mt-6 pt-5 border-t border-brand-border">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted text-center mb-2.5">
            Quick 1-Click Role Switch (Demo Mode)
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => quickFill('admin@proteinemporium.com', 'SUPER_ADMIN')}
              className="px-2 py-1.5 bg-brand-subtle hover:bg-brand-orange-light hover:text-brand-orange border border-brand-border rounded text-left font-semibold truncate transition-colors"
            >
              👑 Super Admin
            </button>
            <button
              onClick={() => quickFill('manager@proteinemporium.com', 'MANAGER')}
              className="px-2 py-1.5 bg-brand-subtle hover:bg-brand-orange-light hover:text-brand-orange border border-brand-border rounded text-left font-semibold truncate transition-colors"
            >
              📋 Store Manager
            </button>
            <button
              onClick={() => quickFill('inventory@proteinemporium.com', 'INVENTORY_STAFF')}
              className="px-2 py-1.5 bg-brand-subtle hover:bg-brand-orange-light hover:text-brand-orange border border-brand-border rounded text-left font-semibold truncate transition-colors"
            >
              📦 Inventory Staff
            </button>
            <button
              onClick={() => quickFill('support@proteinemporium.com', 'SUPPORT_STAFF')}
              className="px-2 py-1.5 bg-brand-subtle hover:bg-brand-orange-light hover:text-brand-orange border border-brand-border rounded text-left font-semibold truncate transition-colors"
            >
              🎧 Customer Care
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-[11px] font-semibold text-brand-muted hover:text-brand-orange transition-colors">
            ← Return to Customer Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
