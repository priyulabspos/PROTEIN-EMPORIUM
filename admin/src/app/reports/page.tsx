'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Download, MessageSquare, TrendingUp, 
  DollarSign, ShoppingBag, Boxes, AlertTriangle, Sparkles, 
  CheckCircle2, ArrowUpRight, Calendar
} from 'lucide-react';
import { store } from '@/lib/store';
import { AbandonedCart } from '@/lib/types';

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<'WEEK' | 'MONTH' | 'YEAR'>('MONTH');
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setAbandonedCarts(store.getAbandonedCarts());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendRecovery = (id: number, phone: string, name: string) => {
    store.sendWhatsAppRecovery(id);
    setAbandonedCarts([...store.getAbandonedCarts()]);
    showToast(`WhatsApp recovery with coupon PROTEIN5 triggered to ${name} (${phone})`);
  };

  const handleExportGstReport = () => {
    const headers = ['HSN Code', 'Description', 'Taxable Turnover (INR)', 'CGST (9%)', 'SGST (9%)', 'IGST (18%)', 'Total Tax Collected (INR)'];
    const rows = [
      ['2106 90 99', 'Food Preparations / Protein Powders', '1,42,850.00', '6,428.25', '6,428.25', '12,856.50', '25,713.00'],
      ['2936 29 90', 'Vitamins & Multivitamin Capsules', '18,400.00', '828.00', '828.00', '1,656.00', '3,312.00'],
      ['2106 10 00', 'Protein Isolates & Concentrates', '88,200.00', '3,969.00', '3,969.00', '7,938.00', '15,876.00']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Protein_Emporium_GSTR1_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('GST GSTR-1 HSN report exported successfully.');
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
            <BarChart3 className="w-6 h-6 text-[#F58A07]" /> Business Reports & GST Filing
          </h1>
          <p className="text-sm text-slate-500">
            Automated GSTR-1 HSN tax breakdown, stock inventory valuation, and abandoned cart WhatsApp recovery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['WEEK', 'MONTH', 'YEAR'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  timeRange === tr ? 'bg-white text-[#16130F] shadow-xs' : 'text-slate-600'
                }`}
              >
                {tr}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportGstReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#16130F] text-white hover:bg-black shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#F58A07]" /> Export GSTR-1 CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Warehouse Cost Valuation</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#16130F]">₹6,84,200</span>
            <span className="text-xs text-slate-400">At Purchase Cost</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retail Stock Valuation</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">₹9,45,600</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+38.2% Margin</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">GST Output Tax Liability</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-800">₹44,901</span>
            <span className="text-xs text-slate-400">18% Rate</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unrecovered Carts Value</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">₹8,547</span>
            <span className="text-xs text-slate-400">2 Leads</span>
          </div>
        </div>
      </div>

      {/* Section 1: GST HSN Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading uppercase">
              GST HSN-Wise Summary (Indian Supplement Standards)
            </h3>
            <span className="text-xs text-slate-500">GSTIN: 07AABCP1234F1Z5 • Delhi State Jurisdiction</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            Ready for GSTR-1 Upload
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">HSN Code</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Taxable Value</th>
                <th className="py-3 px-4">CGST (9%)</th>
                <th className="py-3 px-4">SGST (9%)</th>
                <th className="py-3 px-4">IGST (18%)</th>
                <th className="py-3 px-4 text-right">Total GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-[#F58A07]">2106 90 99</td>
                <td className="py-3 px-4 font-medium text-slate-800">Whey & Mass Gainers (Food Preparations)</td>
                <td className="py-3 px-4 font-bold text-slate-900">₹1,42,850</td>
                <td className="py-3 px-4 text-slate-600">₹6,428</td>
                <td className="py-3 px-4 text-slate-600">₹6,428</td>
                <td className="py-3 px-4 text-slate-600">₹12,857</td>
                <td className="py-3 px-4 font-bold text-slate-900 text-right">₹25,713</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-[#F58A07]">2106 10 00</td>
                <td className="py-3 px-4 font-medium text-slate-800">Protein Concentrates & Textures</td>
                <td className="py-3 px-4 font-bold text-slate-900">₹88,200</td>
                <td className="py-3 px-4 text-slate-600">₹3,969</td>
                <td className="py-3 px-4 text-slate-600">₹3,969</td>
                <td className="py-3 px-4 text-slate-600">₹7,938</td>
                <td className="py-3 px-4 font-bold text-slate-900 text-right">₹15,876</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-mono font-bold text-[#F58A07]">2936 29 90</td>
                <td className="py-3 px-4 font-medium text-slate-800">Multivitamins, Omega-3 & Minerals</td>
                <td className="py-3 px-4 font-bold text-slate-900">₹18,400</td>
                <td className="py-3 px-4 text-slate-600">₹828</td>
                <td className="py-3 px-4 text-slate-600">₹828</td>
                <td className="py-3 px-4 text-slate-600">₹1,656</td>
                <td className="py-3 px-4 font-bold text-slate-900 text-right">₹3,312</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Abandoned Cart Recovery (WhatsApp Trigger) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-heading uppercase flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-green-600" /> Abandoned Cart Recovery Engine
            </h3>
            <span className="text-xs text-slate-500">
              Recover dropped checkouts via automated WhatsApp template message with 5% discount code
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {abandonedCarts.map(cart => (
            <div key={cart.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{cart.customer_name}</span>
                  <span className="font-mono text-xs text-slate-500">{cart.customer_phone}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cart.recovery_status === 'SENT' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {cart.recovery_status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Items: <span className="font-semibold">{cart.items_summary}</span> ({cart.items_count} items)
                </p>
                <span className="text-[11px] text-slate-400">
                  Abandoned at {new Date(cart.abandoned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Cart Value</span>
                  <span className="font-bold text-base text-slate-900">₹{cart.cart_value.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => handleSendRecovery(cart.id, cart.customer_phone, cart.customer_name)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                    cart.recovery_status === 'SENT'
                      ? 'bg-slate-100 text-slate-500 cursor-default'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {cart.recovery_status === 'SENT' ? 'Offer Sent' : 'Send WhatsApp 5% Offer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
