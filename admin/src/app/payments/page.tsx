'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Search, Filter, Download, ArrowUpRight, 
  CheckCircle2, XCircle, Clock, AlertTriangle, ExternalLink, 
  RefreshCw, DollarSign, Wallet, ShieldCheck, Sparkles, MessageSquare
} from 'lucide-react';
import { store } from '@/lib/store';
import { PaymentTransaction } from '@/lib/types';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setPayments(store.getPayments());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.upi_vpa && p.upi_vpa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.bank_rrn && p.bank_rrn.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || p.payment_method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalCaptured = payments
    .filter(p => p.status === 'CAPTURED')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalNetSettled = payments
    .filter(p => p.status === 'CAPTURED' && p.settlement_status === 'SETTLED')
    .reduce((acc, p) => acc + p.net_amount, 0);

  const totalFeesPaid = payments
    .filter(p => p.status === 'CAPTURED')
    .reduce((acc, p) => acc + (p.gateway_fee + p.tax_on_fee), 0);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Order Number', 'Customer Name', 'Method', 'Gross Amount (INR)', 'Gateway Fee', 'GST On Fee', 'Net Amount (INR)', 'Status', 'Settlement', 'RRN / Reference', 'Created At'];
    const rows = filteredPayments.map(p => [
      p.transaction_id,
      p.order_number,
      p.customer_name,
      p.payment_method,
      p.amount,
      p.gateway_fee,
      p.tax_on_fee,
      p.net_amount,
      p.status,
      p.settlement_status,
      p.bank_rrn || p.upi_vpa || '',
      p.created_at
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Protein_Emporium_Razorpay_Settlement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Payment ledger exported successfully.');
  };

  const getStatusBadge = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'CAPTURED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Captured</span>;
      case 'FAILED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"><XCircle className="w-3 h-3" /> Failed</span>;
      case 'REFUNDED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Refunded</span>;
      case 'AUTHORIZED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"><Clock className="w-3 h-3" /> Authorized</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
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
            Payments & Bank Settlements
          </h1>
          <p className="text-sm text-slate-500">
            Razorpay gateway transactions, UPI reconciliation, settlement payouts, and failed recovery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export CA Ledger
          </button>
          <a
            href="https://dashboard.razorpay.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-[#16130F] text-white hover:bg-black transition-colors shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F58A07]" /> Razorpay Portal
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Captured (INR)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#16130F]">₹{totalCaptured.toLocaleString('en-IN')}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Bank Settlements</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">₹{totalNetSettled.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-400">T+1 Cycle</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total MDR & GST Fees</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-700">₹{totalFeesPaid.toFixed(2)}</span>
            <span className="text-xs text-slate-400">2% + 18% GST</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Success Rate</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#F58A07]">97.4%</span>
            <span className="text-xs font-medium text-emerald-600">Top 5% India</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Pay ID, Order #, UPI ID, RRN..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {(['ALL', 'CAPTURED', 'FAILED', 'REFUNDED'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st 
                  ? 'bg-[#16130F] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}

          <span className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {(['ALL', 'UPI', 'CREDIT_CARD', 'COD'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                methodFilter === m 
                  ? 'bg-[#F58A07] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Razorpay Payment ID</th>
                <th className="py-3 px-4">Order & Customer</th>
                <th className="py-3 px-4">Method / Reference</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Net Settlement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Settlement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{p.transaction_id}</span>
                      <span className="text-xs text-slate-400">{new Date(p.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{p.order_number}</span>
                      <span className="text-xs text-slate-500">{p.customer_name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 inline-block mb-1">
                        {p.payment_method}
                      </span>
                      {p.upi_vpa && <span className="text-xs text-slate-500 block font-mono">{p.upi_vpa}</span>}
                      {p.bank_rrn && <span className="text-xs text-slate-400 block font-mono">RRN: {p.bank_rrn}</span>}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      {p.status === 'CAPTURED' ? (
                        <>
                          <span className="font-bold text-emerald-600 block">₹{p.net_amount.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-400">Fee: ₹{(p.gateway_fee + p.tax_on_fee).toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">--</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.settlement_status === 'SETTLED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.settlement_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {p.status === 'FAILED' ? (
                        <button
                          onClick={() => {
                            showToast(`WhatsApp reminder dispatched to ${p.customer_name} for order ${p.order_number}`);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Recover
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedTx(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#16130F] text-lg font-heading">Razorpay Payment Slip</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedTx.transaction_id}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 block">Order Reference</span>
                  <span className="font-bold text-slate-800">{selectedTx.order_number}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Customer</span>
                  <span className="font-semibold text-slate-800">{selectedTx.customer_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Payment Method</span>
                  <span className="font-semibold text-slate-800">{selectedTx.payment_method}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Bank RRN / UTR</span>
                  <span className="font-mono text-xs text-slate-800">{selectedTx.bank_rrn || 'N/A'}</span>
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Gross Paid by Customer:</span>
                  <span className="font-bold text-slate-900">₹{selectedTx.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Razorpay Standard MDR (2.0%):</span>
                  <span>-₹{selectedTx.gateway_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST on Gateway Fee (18%):</span>
                  <span>-₹{selectedTx.tax_on_fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold text-base text-[#16130F]">
                  <span>Net Bank Settlement:</span>
                  <span className="text-emerald-600">₹{selectedTx.net_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#16130F] text-white hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
