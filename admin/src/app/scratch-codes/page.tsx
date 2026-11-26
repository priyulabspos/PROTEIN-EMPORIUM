'use client';

import React, { useState, useEffect } from 'react';
import { 
  QrCode, ShieldCheck, AlertTriangle, Plus, Download, 
  Search, Filter, CheckCircle2, ShieldAlert, Sparkles, RefreshCw, 
  ExternalLink, Copy, Check
} from 'lucide-react';
import { store } from '@/lib/store';
import { ScratchCode, InventoryBatch } from '@/lib/types';

export default function ScratchCodesPage() {
  const [codes, setCodes] = useState<ScratchCode[]>([]);
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generator form
  const [selectedBatchId, setSelectedBatchId] = useState<number>(1);
  const [generateCount, setGenerateCount] = useState<number>(50);
  const [proteinPct, setProteinPct] = useState<number>(81.4);

  useEffect(() => {
    setCodes(store.getScratchCodes());
    setBatches(store.getBatches());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredCodes = codes.filter(c => {
    const matchesSearch = 
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.batch && c.batch.batch_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.batch && c.batch.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find(b => b.id === selectedBatchId) || batches[0];
    const generated = store.generateScratchBatch({
      batchId: batch.id,
      count: generateCount,
      batchCode: batch.batch_number,
      productName: batch.product_name || 'Protein Supplement',
      mfgDate: batch.mfg_date,
      expiryDate: batch.expiry_date,
      proteinContentPercent: proteinPct
    });

    setCodes([...store.getScratchCodes()]);
    setIsGeneratorOpen(false);
    showToast(`Generated ${generated.length} holographic scratch codes for ${batch.batch_number}!`);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    showToast(`Code ${code} copied to clipboard`);
  };

  const handleExportCSV = () => {
    const headers = ['Unique Scratch Code', 'Batch Number', 'Product Name', 'Mfg Date', 'Expiry Date', 'Lab Protein Pct', 'Verification Status', 'Times Checked'];
    const rows = filteredCodes.map(c => [
      c.code,
      c.batch?.batch_code || '',
      c.batch?.product_name || '',
      c.batch?.mfg_date || '',
      c.batch?.expiry_date || '',
      c.batch?.protein_content_percent || '',
      c.status,
      c.verification_count
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Holostik_Security_Codes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Hologram printer batch CSV exported successfully.');
  };

  const totalCodes = codes.length;
  const verifiedCount = codes.filter(c => c.status === 'VERIFIED').length;
  const unusedCount = codes.filter(c => c.status === 'UNUSED').length;
  const suspiciousCount = codes.filter(c => c.status === 'FLAGGED_SUSPICIOUS').length;

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
            <QrCode className="w-6 h-6 text-[#F58A07]" /> Authenticity Scratch-Code Security
          </h1>
          <p className="text-sm text-slate-500">
            Cryptographic 12-digit holographic verification codes, lab certificate mapping, and anti-counterfeiting tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Export for Hologram Printer
          </button>
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" /> Generate New Security Batch
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Security Codes</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#16130F]">{totalCodes}</span>
            <span className="text-xs font-medium text-slate-400">Database Total</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unused (On Shelf)</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-700">{unusedCount}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Intact Foil</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Verified Genuine</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{verifiedCount}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">100% Authentic</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flagged Suspicious</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600">{suspiciousCount}</span>
            <span className="text-xs text-rose-600 font-medium">{suspiciousCount > 0 ? 'Requires Audit' : '0 Alerts'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search code (PE-XXXX-XXXX), Batch #, or product..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {(['ALL', 'UNUSED', 'VERIFIED', 'FLAGGED_SUSPICIOUS'] as const).map(st => (
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

      {/* Codes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Scratch Code</th>
                <th className="py-3 px-4">Batch Number</th>
                <th className="py-3 px-4">Mapped Supplement</th>
                <th className="py-3 px-4">Lab Verified Pct</th>
                <th className="py-3 px-4">Times Scanned</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No scratch codes found. Generate a batch above.
                  </td>
                </tr>
              ) : (
                filteredCodes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                      <span className="bg-orange-50 text-[#F58A07] px-2 py-0.5 rounded border border-orange-200">
                        {c.code}
                      </span>
                      <button 
                        onClick={() => handleCopy(c.code)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy Code"
                      >
                        {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {c.batch?.batch_code || 'GPN-IN-889104'}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {c.batch?.product_name || 'Optimum Nutrition Gold Standard 100% Whey'}
                      </span>
                      <span className="text-xs text-slate-400">Exp: {c.batch?.expiry_date || '2028-09-30'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                        {c.batch?.protein_content_percent || 81.40}% Protein
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {c.verification_count} times
                    </td>
                    <td className="py-3 px-4">
                      {c.status === 'UNUSED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          Unscratched
                        </span>
                      )}
                      {c.status === 'VERIFIED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Genuine
                        </span>
                      )}
                      {c.status === 'FLAGGED_SUSPICIOUS' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <ShieldAlert className="w-3 h-3" /> Suspicious Duplicate
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          const res = store.verifyScratchCode(c.code);
                          setCodes([...store.getScratchCodes()]);
                          showToast(`Simulated customer check: ${res.message}`);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Simulate Verify
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-orange-50 text-[#F58A07] rounded-xl">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#16130F] text-lg font-heading uppercase">
                  Batch Code Generator
                </h3>
                <p className="text-xs text-slate-500">
                  Generate holographic scratch-off security codes for your manufacturing batch.
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerateBatch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Target Inventory Batch
                </label>
                <select
                  value={selectedBatchId}
                  onChange={e => setSelectedBatchId(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.batch_number} • {b.product_name} (Exp: {b.expiry_date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Number of Codes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={generateCount}
                    onChange={e => setGenerateCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Format: PE-XXXX-XXXX</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Certified Lab Protein %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={proteinPct}
                    onChange={e => setProteinPct(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">FSSAI NABL Lab Certified</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Tamper-Proof Cryptographic Guarantee
                </span>
                <p>
                  Each code generated here will be immediately live on the storefront scratch checker at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">/index.html#scratch-verify</code>.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGeneratorOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Generate Codes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
