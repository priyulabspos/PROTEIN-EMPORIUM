'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserPlus, Users, Key, CheckCircle2, 
  XCircle, Lock, Mail, Phone, Sparkles
} from 'lucide-react';
import { store } from '@/lib/store';
import { StaffProfile, StaffRole } from '@/lib/types';
import { ROLE_PERMISSIONS } from '@/lib/permissions';

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('MANAGER');

  useEffect(() => {
    setStaffList(store.getAllStaff());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const created = store.inviteStaff({
      full_name: fullName,
      email,
      phone,
      role
    });
    setStaffList([...store.getAllStaff()]);
    setIsInviteOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    showToast(`Invitation email dispatched to ${created.email} as ${created.role}`);
  };

  const modulesList = [
    'DASHBOARD', 'PRODUCTS', 'CATEGORIES', 'INVENTORY', 'ORDERS', 
    'RETURNS', 'PAYMENTS', 'CUSTOMERS', 'COUPONS', 'SCRATCH_CODES', 
    'REVIEWS', 'SUPPORT', 'CMS', 'REPORTS', 'SETTINGS', 'STAFF'
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#16130F] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-orange-500/30 animate-in fade-in slide-in-from-bottom-3">
          <Sparkles className="w-5 h-5 text-[#F58A07]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#16130F] font-heading uppercase flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#F58A07]" /> Staff Management & RBAC Permissions
          </h1>
          <p className="text-sm text-slate-500">
            Enterprise role-based access control, security clearance, 2FA status, and team invites.
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
        >
          <UserPlus className="w-4 h-4" /> Invite Staff Member
        </button>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm font-heading uppercase">
            Active Team Members ({staffList.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role Clearance</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">2FA Security</th>
                <th className="py-3 px-4">Last Sign-In</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                        {st.full_name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{st.full_name}</span>
                        <span className="text-xs text-slate-400">{st.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F58A07] border border-orange-200">
                      {st.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-slate-600">
                    {st.phone || '+91 98000 00000'}
                  </td>
                  <td className="py-3 px-4">
                    {st.two_factor_enabled ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">Disabled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {st.last_sign_in_at ? new Date(st.last_sign_in_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {st.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Permission Matrix Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm font-heading uppercase">
            Role Permission Matrix (Database RLS Policies)
          </h3>
          <p className="text-xs text-slate-500">
            Enforced server-side in Postgres Row Level Security and admin API gateway handlers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Module</th>
                <th className="py-2.5 px-3 text-center">Super Admin</th>
                <th className="py-2.5 px-3 text-center">Manager</th>
                <th className="py-2.5 px-3 text-center">Inventory Staff</th>
                <th className="py-2.5 px-3 text-center">Support Staff</th>
                <th className="py-2.5 px-3 text-center">Content Editor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modulesList.map(mod => (
                <tr key={mod} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-800">{mod}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-emerald-600">Full Access</td>
                  <td className="py-2.5 px-3 text-center text-slate-700">
                    {mod === 'STAFF' || mod === 'SETTINGS' ? <span className="text-slate-300">--</span> : 'View, Edit'}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-700">
                    {mod === 'INVENTORY' || mod === 'PRODUCTS' ? 'Manage Stock' : <span className="text-slate-300">--</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-700">
                    {mod === 'ORDERS' || mod === 'RETURNS' || mod === 'SUPPORT' || mod === 'REVIEWS' ? 'Read, Reply' : <span className="text-slate-300">--</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-700">
                    {mod === 'CMS' || mod === 'PRODUCTS' || mod === 'CATEGORIES' ? 'Edit Content' : <span className="text-slate-300">--</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-[#16130F] text-lg font-heading">
              Invite New Staff Member
            </h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@proteinemporium.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98000 00000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as StaffRole)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                >
                  <option value="SUPER_ADMIN">Super Admin (Unrestricted)</option>
                  <option value="MANAGER">Store Manager</option>
                  <option value="INVENTORY_STAFF">Inventory Staff (Stock & Batches)</option>
                  <option value="SUPPORT_STAFF">Support Staff (Helpdesk & Returns)</option>
                  <option value="CONTENT_EDITOR">Content Editor (CMS & Products)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
