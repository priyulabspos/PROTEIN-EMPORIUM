'use client';

import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  Plus, 
  History, 
  Calendar, 
  Search, 
  Download, 
  CheckCircle2, 
  ShieldAlert, 
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { store } from '@/lib/store';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'BATCHES' | 'MOVEMENTS'>('STOCK');
  const products = store.getProducts();
  const batches = store.getBatches();
  const auditLogs = store.getAuditLogs().filter(l => l.module === 'INVENTORY');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Stock Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number>(101);
  const [qtyChange, setQtyChange] = useState<number>(10);
  const [movementReason, setMovementReason] = useState('RESTOCK');
  const [notes, setNotes] = useState('');

  // Collect all variants
  const allVariants = products.flatMap(p => 
    (p.variants || []).map(v => ({
      ...v,
      productName: p.name,
      productId: p.id
    }))
  ).filter(v => 
    v.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    store.adjustStock(selectedVariantId, Number(qtyChange), `${movementReason}: ${notes || 'Manual stock update'}`);
    setAdjustModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-wide text-brand-black uppercase">
            Inventory &amp; Batch Expiry Control
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Monitor real-time warehouse stock, batch numbers, laboratory CoA reports, and expiry lifecycles
          </p>
        </div>

        <button
          onClick={() => setAdjustModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Stock Adjustment / Goods Receipt</span>
        </button>
      </div>

      {/* 2. Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('STOCK')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'STOCK'
                ? 'bg-brand-black text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-black bg-white border border-brand-border'
            }`}
          >
            Variant Stock ({allVariants.length})
          </button>
          <button
            onClick={() => setActiveTab('BATCHES')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'BATCHES'
                ? 'bg-brand-black text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-black bg-white border border-brand-border'
            }`}
          >
            Batch &amp; Expiry Tracker ({batches.length})
          </button>
          <button
            onClick={() => setActiveTab('MOVEMENTS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'MOVEMENTS'
                ? 'bg-brand-black text-white shadow-sm'
                : 'text-brand-muted hover:text-brand-black bg-white border border-brand-border'
            }`}
          >
            Stock Movements History
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU, product, batch..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-brand-border rounded-md text-brand-black focus:outline-none focus:border-brand-orange"
          />
        </div>
      </div>

      {/* 3. Tab Content */}
      {activeTab === 'STOCK' && (
        <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="data-table-header">SKU / Barcode</th>
                  <th className="data-table-header">Product &amp; Variant</th>
                  <th className="data-table-header">Available Stock</th>
                  <th className="data-table-header">Threshold</th>
                  <th className="data-table-header">Stock Status</th>
                  <th className="data-table-header text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {allVariants.map((v) => {
                  const isLow = v.stock_quantity <= v.low_stock_threshold;
                  const isOut = v.stock_quantity === 0;

                  return (
                    <tr key={v.id} className="hover:bg-brand-subtle/50 transition-colors">
                      <td className="data-table-cell font-mono font-bold text-brand-black text-xs">
                        {v.sku}
                        <div className="text-[10px] text-brand-muted font-normal">{v.barcode || 'EAN-13 Verified'}</div>
                      </td>
                      <td className="data-table-cell">
                        <div className="font-bold text-xs text-brand-black">{v.productName}</div>
                        <div className="text-[11px] text-brand-muted">{v.size} • {v.flavor}</div>
                      </td>
                      <td className="data-table-cell font-mono font-bold text-sm">
                        <span className={isOut ? 'text-brand-danger' : isLow ? 'text-amber-600' : 'text-brand-black'}>
                          {v.stock_quantity} units
                        </span>
                      </td>
                      <td className="data-table-cell text-xs text-brand-muted font-mono">
                        {v.low_stock_threshold} units
                      </td>
                      <td className="data-table-cell">
                        <span className={`badge ${
                          isOut ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>
                      <td className="data-table-cell text-right">
                        <button
                          onClick={() => {
                            setSelectedVariantId(v.id);
                            setQtyChange(20);
                            setMovementReason('RESTOCK');
                            setAdjustModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-brand-orange border border-brand-orange/40 rounded hover:bg-brand-orange-light transition-colors"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'BATCHES' && (
        <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
          <div className="p-4 bg-amber-50/50 border-b border-amber-200 text-xs text-amber-800 flex items-center gap-2 font-medium">
            <AlertTriangle size={15} className="text-amber-600 flex-shrink-0" />
            <span>
              <strong>Supplement Compliance Notice:</strong> Indian FSSAI regulations mandate lot-level expiry tracking. Batches under 90 days to expiry are highlighted for clearance sales.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="data-table-header">Batch Number</th>
                  <th className="data-table-header">Associated Product</th>
                  <th className="data-table-header">Mfg Date</th>
                  <th className="data-table-header">Expiry Date</th>
                  <th className="data-table-header">Units In Batch</th>
                  <th className="data-table-header">Shelf Life Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-brand-subtle/50 transition-colors">
                    <td className="data-table-cell font-mono font-bold text-brand-black text-xs">
                      {b.batch_number}
                    </td>
                    <td className="data-table-cell font-bold text-xs text-brand-black">
                      {b.product_name}
                    </td>
                    <td className="data-table-cell font-mono text-xs text-brand-muted">
                      {b.mfg_date}
                    </td>
                    <td className="data-table-cell font-mono text-xs font-bold text-brand-black">
                      {b.expiry_date}
                    </td>
                    <td className="data-table-cell font-mono text-xs font-bold text-brand-black">
                      {b.current_quantity} / {b.initial_quantity}
                    </td>
                    <td className="data-table-cell">
                      <span className="badge badge-success text-[10px]">
                        ✓ 24 Months Fresh
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'MOVEMENTS' && (
        <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="data-table-header">Timestamp</th>
                  <th className="data-table-header">Staff Member</th>
                  <th className="data-table-header">Item SKU</th>
                  <th className="data-table-header">Movement Description</th>
                  <th className="data-table-header text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-subtle/50 transition-colors">
                    <td className="data-table-cell font-mono text-xs text-brand-muted">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>
                    <td className="data-table-cell font-bold text-xs text-brand-black">
                      {log.staff_email}
                    </td>
                    <td className="data-table-cell font-mono text-xs text-brand-black">
                      {log.entity_id || 'INVENTORY'}
                    </td>
                    <td className="data-table-cell text-xs text-brand-black">
                      {log.entity_name}
                    </td>
                    <td className="data-table-cell text-right">
                      <span className="badge badge-brand">Audit Logged</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-border rounded-xl shadow-modal w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-heading font-black text-brand-black uppercase mb-4">
              Warehouse Stock Adjustment
            </h2>
            <form onSubmit={handleStockAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Select Product Variant *</label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black"
                >
                  {allVariants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.sku} – {v.productName} ({v.size}) [Current: {v.stock_quantity}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Movement Type</label>
                  <select
                    value={movementReason}
                    onChange={(e) => setMovementReason(e.target.value)}
                    className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg text-brand-black"
                  >
                    <option value="RESTOCK">+ Restock / Shipment Inbound</option>
                    <option value="DAMAGE">- Damage / Transit Write-off</option>
                    <option value="AUDIT_CORRECTION">± Audit Count Correction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Quantity Change (Units) *</label>
                  <input
                    type="number"
                    required
                    value={qtyChange}
                    onChange={(e) => setQtyChange(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-white border border-brand-border rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Reason / Purchase Order Note</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Inbound PO-44910 from Glanbia warehouse"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-bold text-brand-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase rounded-lg shadow-sm"
                >
                  Confirm &amp; Record Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
