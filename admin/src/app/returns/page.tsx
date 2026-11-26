'use client';

import React, { useState, useEffect } from 'react';
import { 
  RotateCcw, Search, Filter, CheckCircle2, XCircle, Clock, 
  AlertTriangle, Truck, DollarSign, ShieldAlert, Eye, RefreshCw, 
  ExternalLink, ArrowUpRight, Package, Sparkles
} from 'lucide-react';
import { store } from '@/lib/store';
import { ReturnRequest, ReturnStatus, ReturnReason } from '@/lib/types';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundMode, setRefundMode] = useState<'ORIGINAL_PAYMENT' | 'STORE_WALLET'>('ORIGINAL_PAYMENT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setReturns(store.getReturns());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredReturns = returns.filter(r => {
    const matchesSearch = 
      r.return_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: number, newStatus: ReturnStatus, restockChoice?: ReturnRequest['restock_choice']) => {
    const updated = store.updateReturn(id, { 
      status: newStatus,
      ...(restockChoice && { restock_choice: restockChoice })
    });
    if (updated) {
      setReturns([...store.getReturns()]);
      setSelectedReturn(updated);
      showToast(`Return ${updated.return_number} updated to ${newStatus}`);
    }
  };

  const handleProcessRefund = () => {
    if (!selectedReturn) return;
    const updated = store.processRefund(selectedReturn.id, refundAmount, refundMode);
    if (updated) {
      setReturns([...store.getReturns()]);
      setSelectedReturn(updated);
      setRefundModalOpen(false);
      showToast(`Refund of ₹${refundAmount} processed via ${refundMode} (${updated.razorpay_refund_id})`);
    }
  };

  const getStatusBadge = (status: ReturnStatus) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Requested</span>;
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200"><CheckCircle2 className="w-3 h-3" /> Approved</span>;
      case 'PICKUP_SCHEDULED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"><Truck className="w-3 h-3" /> Pickup Scheduled</span>;
      case 'QC_PASSED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> QC Verified</span>;
      case 'REFUNDED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-800 border border-green-200"><DollarSign className="w-3 h-3" /> Refunded</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-[#16130F] font-heading uppercase">
            Returns, Replacements & Refunds
          </h1>
          <p className="text-sm text-slate-500">
            FSSAI compliance return queue, tamper inspection, BlueDart reverse logistics, and Razorpay refunds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setReturns([...store.getReturns()])}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Return Requests</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#16130F]">{returns.length}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Return Rate 1.2%</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending QC Verification</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">
              {returns.filter(r => r.status === 'REQUESTED' || r.status === 'RECEIVED').length}
            </span>
            <span className="text-xs text-slate-400">Requires Inspection</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Refunded (Razorpay)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">
              ₹{returns.filter(r => r.status === 'REFUNDED').reduce((acc, r) => acc + r.refund_amount, 0).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400">100% Settled</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FSSAI Policy Window</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#16130F]">7 Days</span>
            <span className="text-xs font-medium text-slate-500">Sealed Packs Only</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search return #, order #, customer, product..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {(['ALL', 'REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED', 'QC_PASSED', 'REFUNDED', 'REJECTED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st 
                  ? 'bg-[#16130F] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Returns Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Return ID</th>
                <th className="py-3 px-4">Order & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Item & Reason</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <RotateCcw className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No returns found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#F58A07]">
                      {r.return_number}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{r.order_number}</span>
                      <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block">{r.customer_name}</span>
                      <span className="text-xs text-slate-500">{r.customer_phone}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-semibold text-slate-800 line-clamp-1">{r.product_name}</span>
                      <span className="inline-block mt-0.5 text-xs text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 rounded">
                        {r.reason.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{r.item_price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedReturn(r);
                          setRefundAmount(r.item_price);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 text-[#F58A07] hover:bg-orange-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review Case
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Case Modal / Slide-over */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 text-[#F58A07] rounded-lg">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#16130F] text-lg font-heading uppercase">
                    Return Case {selectedReturn.return_number}
                  </h3>
                  <span className="text-xs text-slate-500">Order {selectedReturn.order_number} • {new Date(selectedReturn.created_at).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReturn(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Product and Claim */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Returned</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">{selectedReturn.product_name}</h4>
                  <p className="text-xs text-slate-500">{selectedReturn.variant_name} • Qty: {selectedReturn.quantity}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Claimed Value</span>
                  <span className="text-xl font-bold text-[#F58A07]">₹{selectedReturn.item_price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Customer Statement & Photo Proof */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Customer Reason & Notes</h4>
                <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                  <span className="font-semibold text-rose-800 text-xs block mb-1">Reason: {selectedReturn.reason.replace(/_/g, ' ')}</span>
                  <p className="text-sm text-slate-700 italic">"{selectedReturn.customer_notes}"</p>
                </div>

                {selectedReturn.image_urls && selectedReturn.image_urls.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-slate-500 block mb-2">Attached Photo Proof:</span>
                    <div className="flex gap-3">
                      {selectedReturn.image_urls.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noreferrer" className="relative group block rounded-lg overflow-hidden border border-slate-200">
                          <img src={img} alt="Return proof" className="w-24 h-24 object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FSSAI Quality Control Check */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-orange-500" /> FSSAI Quality Control (QC) Status
                  </h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {selectedReturn.qc_status.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Per FSSAI regulations, returned supplements must undergo strict seal verification before issuing refunds or returning to inventory.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => {
                      const updated = store.updateReturn(selectedReturn.id, { qc_status: 'SEAL_INTACT' });
                      if (updated) setSelectedReturn(updated);
                    }}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      selectedReturn.qc_status === 'SEAL_INTACT' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/20' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Seal Intact (Restockable)
                  </button>
                  <button 
                    onClick={() => {
                      const updated = store.updateReturn(selectedReturn.id, { qc_status: 'SEAL_BROKEN' });
                      if (updated) setSelectedReturn(updated);
                    }}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      selectedReturn.qc_status === 'SEAL_BROKEN' 
                        ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-400/20' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Seal Broken (Discard)
                  </button>
                  <button 
                    onClick={() => {
                      const updated = store.updateReturn(selectedReturn.id, { qc_status: 'DAMAGED_PACK' });
                      if (updated) setSelectedReturn(updated);
                    }}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      selectedReturn.qc_status === 'DAMAGED_PACK' 
                        ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-400/20' 
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Transit Damage
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Workflow Actions</span>
                <div className="flex flex-wrap gap-2">
                  {selectedReturn.status === 'REQUESTED' && (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(selectedReturn.id, 'APPROVED')}
                        className="flex-1 py-2.5 px-4 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Return Request
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(selectedReturn.id, 'REJECTED')}
                        className="py-2.5 px-4 text-xs font-bold rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject (Out of Policy)
                      </button>
                    </>
                  )}

                  {selectedReturn.status === 'APPROVED' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedReturn.id, 'PICKUP_SCHEDULED')}
                      className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-[#16130F] text-white hover:bg-black flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Truck className="w-4 h-4 text-[#F58A07]" /> Schedule BlueDart Reverse Pickup
                    </button>
                  )}

                  {selectedReturn.status === 'PICKUP_SCHEDULED' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedReturn.id, 'QC_PASSED')}
                      className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Parcel Received in Warehouse & Pass QC
                    </button>
                  )}

                  {selectedReturn.status === 'QC_PASSED' && (
                    <button 
                      onClick={() => {
                        setRefundAmount(selectedReturn.item_price);
                        setRefundModalOpen(true);
                      }}
                      className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-[#F58A07] text-white hover:bg-orange-600 flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
                    >
                      <DollarSign className="w-4 h-4" /> Trigger Razorpay Refund (₹{selectedReturn.item_price})
                    </button>
                  )}

                  {selectedReturn.status === 'REFUNDED' && (
                    <div className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                      <span className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Refund Processed
                      </span>
                      <span className="font-mono">{selectedReturn.razorpay_refund_id || 'rfnd_NzpX992LKa'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Refund Modal */}
      {refundModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 text-green-700 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#16130F] text-lg font-heading">Initiate Customer Refund</h3>
                <span className="text-xs text-slate-500">{selectedReturn.customer_name} • Return #{selectedReturn.return_number}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Refund Amount (₹)</label>
                <input 
                  type="number"
                  value={refundAmount}
                  onChange={e => setRefundAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-base font-bold rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Destination Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRefundMode('ORIGINAL_PAYMENT')}
                    className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-colors ${
                      refundMode === 'ORIGINAL_PAYMENT'
                        ? 'bg-orange-50 text-[#F58A07] border-[#F58A07]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Original Payment (Razorpay)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefundMode('STORE_WALLET')}
                    className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-colors ${
                      refundMode === 'STORE_WALLET'
                        ? 'bg-orange-50 text-[#F58A07] border-[#F58A07]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Store Wallet Credit (+5% bonus)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Product Amount:</span>
                  <span className="font-semibold text-slate-900">₹{selectedReturn.item_price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Deduction (Shipping):</span>
                  <span className="font-semibold text-slate-900">₹0 (Waived)</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-[#16130F]">
                  <span>Net Refund:</span>
                  <span className="text-[#F58A07]">₹{refundAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessRefund}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              >
                Confirm & Pay Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
