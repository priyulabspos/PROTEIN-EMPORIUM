'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Building2, Truck, CreditCard, ShieldCheck, 
  Sparkles, Save, CheckCircle2, Lock, Eye, EyeOff
} from 'lucide-react';
import { store } from '@/lib/store';
import { StoreSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(store.getSettings());
  const [showSecret, setShowSecret] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setSettings(store.getSettings());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings(settings);
    showToast('Store settings and gateway credentials updated successfully!');
  };

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
            <Settings className="w-6 h-6 text-[#F58A07]" /> Store Configuration & Integrations
          </h1>
          <p className="text-sm text-slate-500">
            FSSAI food license, GST tax registration, Razorpay live gateway keys, and Shiprocket logistics API.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Section 1: Business Identity & Licensing */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-[#F58A07]" />
            <h3 className="font-bold text-slate-900 font-heading text-base uppercase">
              Business Identity & FSSAI Compliance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Store Brand Name
              </label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={e => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Registered Legal Entity Name
              </label>
              <input
                type="text"
                required
                value={settings.legal_name}
                onChange={e => setSettings({ ...settings, legal_name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                GSTIN Tax Number
              </label>
              <input
                type="text"
                required
                value={settings.gstin}
                onChange={e => setSettings({ ...settings, gstin: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono uppercase rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                FSSAI Central Food License #
              </label>
              <input
                type="text"
                required
                value={settings.fssai_number}
                onChange={e => setSettings({ ...settings, fssai_number: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Central Warehouse Dispatch Hub Address
            </label>
            <input
              type="text"
              required
              value={settings.warehouse_address}
              onChange={e => setSettings({ ...settings, warehouse_address: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
            />
          </div>
        </div>

        {/* Section 2: Shipping Rules & Returns Policy */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-[#F58A07]" />
            <h3 className="font-bold text-slate-900 font-heading text-base uppercase">
              Shipping Rates & Return Window
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                required
                value={settings.free_shipping_threshold}
                onChange={e => setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default: ₹499 for free delivery</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                required
                value={settings.standard_shipping_fee}
                onChange={e => setSettings({ ...settings, standard_shipping_fee: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Charged on orders below threshold</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Return Window (Days)
              </label>
              <input
                type="number"
                required
                value={settings.return_window_days}
                onChange={e => setSettings({ ...settings, return_window_days: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">FSSAI maximum 7 days</span>
            </div>
          </div>
        </div>

        {/* Section 3: Razorpay Payment Gateway */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#F58A07]" />
              <h3 className="font-bold text-slate-900 font-heading text-base uppercase">
                Razorpay Payment Gateway Integration
              </h3>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, razorpay_mode: 'TEST' })}
                className={`px-3 py-1 text-xs font-bold rounded-md ${settings.razorpay_mode === 'TEST' ? 'bg-amber-500 text-white' : 'text-slate-600'}`}
              >
                TEST MODE
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, razorpay_mode: 'LIVE' })}
                className={`px-3 py-1 text-xs font-bold rounded-md ${settings.razorpay_mode === 'LIVE' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
              >
                LIVE MODE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Razorpay Key ID
              </label>
              <input
                type="text"
                required
                value={settings.razorpay_key_id}
                onChange={e => setSettings({ ...settings, razorpay_key_id: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Razorpay Key Secret
                </label>
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="text-xs text-[#F58A07] font-semibold flex items-center gap-1"
                >
                  {showSecret ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showSecret ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showSecret ? 'text' : 'password'}
                required
                value={settings.razorpay_key_secret}
                onChange={e => setSettings({ ...settings, razorpay_key_secret: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F58A07] text-white font-bold text-sm hover:bg-orange-600 shadow-md shadow-orange-500/20"
          >
            <Save className="w-4 h-4" /> Save Store Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
