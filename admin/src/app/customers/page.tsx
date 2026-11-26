'use client';

import React, { useState } from 'react';
import { Users, Search, Download, ShieldAlert, CheckCircle2, UserCheck, ArrowUpRight, IndianRupee } from 'lucide-react';
import { Customer } from '@/lib/types';

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98112 23344',
    is_blocked: false,
    wallet_balance: 150,
    tags: ['VIP Athlete', 'Repeat Buyer'],
    total_orders: 5,
    total_spent: 18450,
    created_at: '2026-01-15T00:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    full_name: 'Priya Patel',
    email: 'priya.patel@yahoo.com',
    phone: '+91 98223 34455',
    is_blocked: false,
    wallet_balance: 0,
    tags: ['Repeat Buyer'],
    total_orders: 3,
    total_spent: 8900,
    created_at: '2026-02-20T00:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    full_name: 'Amit Verma',
    email: 'amit.verma@outlook.com',
    phone: '+91 98334 45566',
    is_blocked: false,
    wallet_balance: 50,
    tags: ['New Customer'],
    total_orders: 1,
    total_spent: 2499,
    created_at: '2026-11-26T00:00:00Z'
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    full_name: 'Vikram Rao',
    email: 'vikram.rao@gmail.com',
    phone: '+91 98445 66778',
    is_blocked: false,
    wallet_balance: 0,
    tags: ['VIP Athlete'],
    total_orders: 8,
    total_spent: 34200,
    created_at: '2026-01-05T00:00:00Z'
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = customers.filter(c => 
    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBlock = (id: string) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, is_blocked: !c.is_blocked } : c));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-wide text-brand-black uppercase">
            Customer Directory &amp; Lifetime Value ({customers.length})
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            View customer order histories, wallet balances, VIP athlete tags, and contact ledgers
          </p>
        </div>

        <button 
          onClick={() => alert('Exporting customer segmentation report CSV...')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border bg-white text-xs font-bold text-brand-black hover:border-brand-orange transition-colors"
        >
          <Download size={14} className="text-brand-orange" />
          <span>Export Customer CSV</span>
        </button>
      </div>

      {/* 2. Search & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-card">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Total Customer Accounts</span>
          <div className="text-2xl font-heading font-black text-brand-black mt-1">1,420 Registered</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-card">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Repeat Purchase Rate</span>
          <div className="text-2xl font-heading font-black text-brand-success mt-1">42.8%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-card">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">Average Customer Lifetime Value</span>
          <div className="text-2xl font-heading font-black text-brand-black mt-1">₹8,450</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-xl border border-brand-border shadow-sm">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-brand-subtle border border-brand-border rounded-md text-brand-black focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      {/* 3. Customer Table */}
      <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="data-table-header">Customer Profile</th>
                <th className="data-table-header">Contact Details</th>
                <th className="data-table-header">Orders</th>
                <th className="data-table-header">Lifetime Value (LTV)</th>
                <th className="data-table-header">Tags &amp; Segmentation</th>
                <th className="data-table-header text-right">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-brand-subtle/50 transition-colors">
                  <td className="data-table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-black text-brand-orange flex items-center justify-center font-bold text-xs">
                        {c.full_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-brand-black">{c.full_name}</div>
                        <div className="text-[10px] text-brand-muted font-mono">ID: {c.id.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="data-table-cell">
                    <div className="text-xs font-mono font-bold text-brand-black">{c.phone}</div>
                    <div className="text-[11px] text-brand-muted">{c.email}</div>
                  </td>
                  <td className="data-table-cell font-mono font-bold text-xs text-brand-black">
                    {c.total_orders} Orders
                  </td>
                  <td className="data-table-cell font-mono font-bold text-xs text-brand-black">
                    ₹{c.total_spent?.toLocaleString('en-IN')}
                  </td>
                  <td className="data-table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.tags?.map((t) => (
                        <span key={t} className="badge badge-brand text-[10px]">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="data-table-cell text-right">
                    <button
                      onClick={() => toggleBlock(c.id)}
                      className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                        c.is_blocked 
                          ? 'bg-brand-danger-bg text-brand-danger border-red-200' 
                          : 'bg-white text-brand-black border-brand-border hover:border-brand-danger hover:text-brand-danger'
                      }`}
                    >
                      {c.is_blocked ? 'Blocked' : 'Active Account'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
