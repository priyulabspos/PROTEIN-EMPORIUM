'use client';

import React, { useState } from 'react';
import { TicketPercent, Plus, CheckCircle2, Clock, Trash2, Tag, Copy } from 'lucide-react';
import { store } from '@/lib/store';
import { Coupon } from '@/lib/types';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(store.getCoupons());
  const [modalOpen, setModalOpen] = useState(false);

  // New coupon state
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [value, setValue] = useState(5);
  const [maxDiscount, setMaxDiscount] = useState(250);
  const [minOrder, setMinOrder] = useState(0);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newCoupon: Coupon = {
      id: Date.now(),
      code: code.trim().toUpperCase(),
      description,
      type,
      value: Number(value),
      max_discount: type === 'PERCENTAGE' ? Number(maxDiscount) : undefined,
      min_order_amount: Number(minOrder),
      usage_count: 0,
      is_first_order_only: false,
      starts_at: new Date().toISOString(),
      is_active: true
    };

    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    setModalOpen(false);
    setCode('');
    setDescription('');
  };

  const toggleCoupon = (id: number) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-wide text-brand-black uppercase">
            Coupons, Offers &amp; Promo Codes ({coupons.length})
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Configure welcome discounts, percentage markdowns, cart thresholds, and public storefront banners
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* 2. Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-xl border border-brand-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-brand-black tracking-wider uppercase border border-dashed border-brand-orange bg-brand-orange-light px-2.5 py-1 rounded">
                  {c.code}
                </span>
                <button
                  onClick={() => toggleCoupon(c.id)}
                  className={`badge ${c.is_active ? 'badge-success' : 'badge-neutral'} cursor-pointer`}
                >
                  {c.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>

              <div className="text-xl font-heading font-black text-brand-black mt-3">
                {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `₹${c.value} FLAT OFF`}
              </div>

              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                {c.description || 'Promotional coupon code for athletes'}
              </p>

              <div className="mt-4 pt-3 border-t border-brand-border text-xs space-y-1 text-brand-muted">
                <div>Min Cart Order: <strong>{c.min_order_amount === 0 ? 'No Minimum' : `₹${c.min_order_amount}`}</strong></div>
                {c.max_discount && <div>Max Cap: <strong>₹{c.max_discount}</strong></div>}
                <div>Redemptions: <strong className="text-brand-black">{c.usage_count} times</strong></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
              <span className="text-[11px] text-brand-muted">Storefront Eligible</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  alert(`Copied ${c.code} to clipboard!`);
                }}
                className="flex items-center gap-1 font-bold text-brand-orange hover:underline"
              >
                <Copy size={12} />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-border rounded-xl shadow-modal w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-heading font-black text-brand-black uppercase mb-4">
              Create Promotional Coupon
            </h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER15 or FITINDIAN"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg font-mono font-bold text-brand-black uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 15% discount for first 500 orders"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg text-brand-black font-semibold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-white border border-brand-border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-bold text-brand-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase rounded-lg shadow-sm"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
