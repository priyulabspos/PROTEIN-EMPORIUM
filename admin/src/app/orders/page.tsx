'use client';

import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Truck, 
  Printer, 
  Plus, 
  X, 
  CheckCircle2, 
  Clock, 
  FileText, 
  User, 
  MapPin, 
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { store } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState(store.getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Order for Details View / GST Invoice
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Manual Order Modal State
  const [manualOrderOpen, setManualOrderOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedProductSku, setSelectedProductSku] = useState('ON-GS-1KG-DRC');
  const [manualAmount, setManualAmount] = useState(3349);
  const [manualPaymentMethod, setManualPaymentMethod] = useState<'UPI' | 'COD'>('UPI');

  // Dispatch / AWB Modal
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [awbNumber, setAwbNumber] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer_phone.includes(searchQuery) ||
                          o.shipping_address.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: number, newStatus: OrderStatus, note?: string) => {
    store.updateOrderStatus(orderId, newStatus, note);
    const updated = store.getOrders();
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(store.getOrder(orderId) || null);
    }
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    store.createOrder({
      customer_name: customerName,
      customer_phone: customerPhone,
      total_amount: manualAmount,
      payment_method: manualPaymentMethod,
      payment_status: manualPaymentMethod === 'UPI' ? 'PAID' : 'PENDING',
      status: 'CONFIRMED',
      shipping_address: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress || 'Customer Address',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      items: [
        {
          id: Date.now(),
          order_id: 0,
          product_name: 'Optimum Nutrition Gold Standard 100% Whey',
          variant_name: '1 kg • Double Rich Chocolate',
          sku: selectedProductSku,
          unit_price: manualAmount,
          mrp: manualAmount + 1000,
          quantity: 1,
          total_price: manualAmount
        }
      ]
    });

    setOrders(store.getOrders());
    setManualOrderOpen(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
  };

  const handleDispatchCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    selectedOrder.shipment = {
      id: Date.now(),
      order_id: selectedOrder.id,
      courier_name: courierName,
      awb_number: awbNumber || `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      tracking_url: `https://www.bluedart.com/tracking?awb=${awbNumber}`,
      shipment_status: 'IN_TRANSIT',
      shipping_rate: 65,
      dispatched_at: new Date().toISOString()
    };

    handleUpdateStatus(selectedOrder.id, 'SHIPPED', `Dispatched via ${courierName}. AWB: ${selectedOrder.shipment.awb_number}`);
    setDispatchModalOpen(false);
  };

  const handleExportOrders = () => {
    const rows = [
      ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Status', 'Payment Method', 'Payment Status', 'Total (INR)']
    ];
    filteredOrders.forEach(o => {
      rows.push([
        o.order_number,
        o.created_at.slice(0, 10),
        `"${o.customer_name}"`,
        `"${o.customer_phone}"`,
        `"${o.shipping_address.city}"`,
        o.status,
        o.payment_method,
        o.payment_status,
        String(o.total_amount)
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `protein_emporium_orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-wide text-brand-black uppercase">
            Order Fulfillment &amp; Logistics ({orders.length})
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Process orders, assign courier AWB tracking, print GST tax invoices, and track delivery SLA
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportOrders}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border bg-white text-xs font-bold text-brand-black hover:border-brand-orange transition-colors"
          >
            <Download size={14} className="text-brand-orange" />
            <span>Export Orders CSV</span>
          </button>

          <button
            onClick={() => setManualOrderOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>Create Manual Order</span>
          </button>
        </div>
      </div>

      {/* 2. Filters Strip */}
      <div className="bg-white p-3 rounded-xl border border-brand-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Order PE-..., customer, phone, city..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-brand-subtle border border-brand-border rounded-md text-brand-black focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {(['ALL', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-brand-black text-white'
                    : 'text-brand-muted hover:text-brand-black bg-brand-subtle'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Orders Table */}
      <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="data-table-header">Order Number</th>
                <th className="data-table-header">Date</th>
                <th className="data-table-header">Customer Details</th>
                <th className="data-table-header">Payment Status</th>
                <th className="data-table-header">Total (INR)</th>
                <th className="data-table-header">Fulfillment</th>
                <th className="data-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-brand-subtle/50 transition-colors">
                  <td className="data-table-cell font-mono font-bold text-brand-black text-xs">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="hover:text-brand-orange underline text-left block"
                    >
                      {order.order_number}
                    </button>
                    {order.coupon_code && (
                      <span className="text-[10px] text-brand-orange font-bold font-mono">
                        Code: {order.coupon_code}
                      </span>
                    )}
                  </td>
                  <td className="data-table-cell text-xs font-mono text-brand-muted">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="data-table-cell">
                    <div className="font-bold text-xs text-brand-black">{order.customer_name}</div>
                    <div className="text-[11px] text-brand-muted font-mono">{order.customer_phone}</div>
                    <div className="text-[11px] text-brand-muted">{order.shipping_address.city}, {order.shipping_address.pincode}</div>
                  </td>
                  <td className="data-table-cell">
                    <span className={`badge ${
                      order.payment_status === 'PAID' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {order.payment_method} • {order.payment_status}
                    </span>
                  </td>
                  <td className="data-table-cell font-mono font-bold text-xs text-brand-black">
                    ₹{order.total_amount.toLocaleString('en-IN')}
                  </td>
                  <td className="data-table-cell">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`badge ${
                        order.status === 'DELIVERED' ? 'badge-success' :
                        order.status === 'SHIPPED' ? 'badge-brand' :
                        order.status === 'CONFIRMED' ? 'badge-neutral' : 'badge-warning'
                      }`}>
                        {order.status}
                      </span>
                      {order.shipment && (
                        <span className="text-[10px] font-mono text-brand-muted">
                          {order.shipment.courier_name.split(' ')[0]}: {order.shipment.awb_number}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="data-table-cell text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2 py-1 text-xs font-bold border border-brand-border rounded hover:bg-brand-subtle flex items-center gap-1 text-brand-black"
                        title="View Full Order Details"
                      >
                        <Eye size={13} />
                        <span>Manage</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Order Details Slide-Over Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-modal overflow-y-auto flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="h-16 px-6 border-b border-brand-border flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-3">
                <span className="font-heading font-black text-lg text-brand-black">
                  {selectedOrder.order_number}
                </span>
                <span className={`badge ${
                  selectedOrder.status === 'DELIVERED' ? 'badge-success' : 'badge-brand'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-brand-subtle text-brand-muted hover:text-brand-black"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Actions Strip */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-brand-subtle rounded-xl border border-brand-border">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                  className="text-xs border border-brand-border rounded px-2.5 py-1.5 bg-white font-bold text-brand-black"
                >
                  <option value="PENDING">Status: PENDING</option>
                  <option value="CONFIRMED">Status: CONFIRMED</option>
                  <option value="PACKED">Status: PACKED</option>
                  <option value="SHIPPED">Status: SHIPPED</option>
                  <option value="DELIVERED">Status: DELIVERED</option>
                  <option value="CANCELLED">Status: CANCELLED</option>
                </select>

                <button
                  onClick={() => setDispatchModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-black text-white text-xs font-bold uppercase rounded hover:bg-brand-charcoal"
                >
                  <Truck size={14} className="text-brand-orange" />
                  <span>Assign Courier (AWB)</span>
                </button>

                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-border text-xs font-bold text-brand-black rounded hover:border-brand-orange ml-auto"
                >
                  <Printer size={14} />
                  <span>Print GST Invoice</span>
                </button>
              </div>

              {/* Items Purchased Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-orange mb-2">
                  Items Ordered
                </h3>
                <div className="border border-brand-border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-brand-subtle text-brand-muted font-bold uppercase border-b border-brand-border">
                      <tr>
                        <th className="p-2 text-left">Item Description</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Unit Price</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {(selectedOrder.items || []).map((it) => (
                        <tr key={it.id}>
                          <td className="p-2">
                            <div className="font-bold text-brand-black">{it.product_name}</div>
                            <div className="text-brand-muted font-mono text-[10px]">{it.variant_name} ({it.sku})</div>
                          </td>
                          <td className="p-2 text-right font-mono font-bold">{it.quantity}</td>
                          <td className="p-2 text-right font-mono">₹{it.unit_price}</td>
                          <td className="p-2 text-right font-mono font-bold">₹{it.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-brand-subtle p-4 rounded-xl border border-brand-border space-y-2 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-brand-success font-semibold">
                    <span>Coupon Discount ({selectedOrder.coupon_code})</span>
                    <span className="font-mono">-₹{selectedOrder.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-muted">
                  <span>GST Taxes (18% Included)</span>
                  <span className="font-mono">₹{selectedOrder.tax_amount}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Shipping Fee</span>
                  <span>{selectedOrder.shipping_fee === 0 ? 'FREE' : `₹${selectedOrder.shipping_fee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-black pt-2 border-t border-brand-border">
                  <span>Grand Total</span>
                  <span className="font-mono">₹{selectedOrder.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-brand-border rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-black uppercase mb-2">
                    <User size={14} className="text-brand-orange" />
                    <span>Customer Details</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-brand-black">{selectedOrder.customer_name}</div>
                    <div className="text-brand-muted">{selectedOrder.customer_email}</div>
                    <div className="text-brand-muted font-mono">{selectedOrder.customer_phone}</div>
                  </div>
                </div>

                <div className="p-4 bg-white border border-brand-border rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-black uppercase mb-2">
                    <MapPin size={14} className="text-brand-orange" />
                    <span>Shipping Address</span>
                  </div>
                  <div className="text-xs text-brand-muted leading-relaxed">
                    <div className="font-bold text-brand-black">{selectedOrder.shipping_address.name}</div>
                    <div>{selectedOrder.shipping_address.address}</div>
                    <div>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Courier Dispatch Modal */}
      {dispatchModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-border rounded-xl shadow-modal w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-heading font-black text-brand-black uppercase mb-4">
              Courier Dispatch &amp; AWB Assignment
            </h2>
            <form onSubmit={handleDispatchCourier} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Select Shipping Partner *</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black"
                >
                  <option value="BlueDart Express">BlueDart Express (Air Courier)</option>
                  <option value="Delhivery Logistics">Delhivery Logistics (Surface / Express)</option>
                  <option value="XpressBees">XpressBees Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">AWB Tracking Number</label>
                <input
                  type="text"
                  value={awbNumber}
                  onChange={(e) => setAwbNumber(e.target.value)}
                  placeholder="Leave blank for auto-generated BlueDart AWB"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-bold text-brand-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase rounded-lg shadow-sm"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. GST Tax Invoice Modal (Print Ready) */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-border rounded-xl shadow-modal w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-brand-black pb-4 mb-4">
              <div>
                <h1 className="text-xl font-heading font-black text-brand-black uppercase">
                  TAX INVOICE
                </h1>
                <div className="text-xs text-brand-muted mt-1">
                  <strong>Protein Emporium India Pvt Ltd</strong><br />
                  GSTIN: 07AABCP1234F1Z5 | FSSAI Lic. No.: 10021064000123<br />
                  Okhla Industrial Area, New Delhi - 110020
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="font-bold text-sm text-brand-black">Invoice #{selectedOrder.order_number}</div>
                <div className="text-brand-muted">Date: {new Date(selectedOrder.created_at).toLocaleDateString('en-IN')}</div>
                <div className="text-brand-muted">Place of Supply: Delhi (07)</div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <strong className="block text-brand-black uppercase mb-1">Billed To (Customer):</strong>
                <div>{selectedOrder.customer_name}</div>
                <div>{selectedOrder.shipping_address.address}</div>
                <div>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}</div>
                <div>Phone: {selectedOrder.customer_phone}</div>
              </div>
              <div>
                <strong className="block text-brand-black uppercase mb-1">Dispatch Details:</strong>
                <div>Courier: {selectedOrder.shipment?.courier_name || 'BlueDart'}</div>
                <div>AWB Number: {selectedOrder.shipment?.awb_number || 'BD772910482IN'}</div>
                <div>Payment Mode: {selectedOrder.payment_method} ({selectedOrder.payment_status})</div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs border border-brand-border mb-4">
              <thead className="bg-brand-subtle text-brand-black font-bold border-b border-brand-border">
                <tr>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-center">HSN</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Taxable</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border font-mono">
                {(selectedOrder.items || []).map((it) => (
                  <tr key={it.id}>
                    <td className="p-2 font-sans">{it.product_name} - {it.variant_name}</td>
                    <td className="p-2 text-center">21061000</td>
                    <td className="p-2 text-right">{it.quantity}</td>
                    <td className="p-2 text-right">₹{it.unit_price}</td>
                    <td className="p-2 text-right">₹{Math.round(it.total_price / 1.18)}</td>
                    <td className="p-2 text-right font-bold">₹{it.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tax Breakdown */}
            <div className="flex justify-between items-start text-xs border-t border-brand-border pt-4">
              <div className="text-brand-muted text-[11px] max-w-sm">
                Certified that the particulars given above are true and correct. Goods once sold are covered under 7-day manufacturer warranty against seal defect.
              </div>
              <div className="w-48 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-brand-muted text-[11px]">
                  <span>CGST (9%):</span>
                  <span>₹{Math.round(selectedOrder.tax_amount / 2)}</span>
                </div>
                <div className="flex justify-between text-brand-muted text-[11px]">
                  <span>SGST (9%):</span>
                  <span>₹{Math.round(selectedOrder.tax_amount / 2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-brand-black border-t border-brand-black pt-1">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrder.total_amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 print:hidden">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 border border-brand-border rounded text-xs font-bold text-brand-black"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-brand-black text-white text-xs font-bold uppercase rounded flex items-center gap-2"
              >
                <Printer size={14} />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Create Manual Order Modal */}
      {manualOrderOpen && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-border rounded-xl shadow-modal w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-heading font-black text-brand-black uppercase mb-4">
              Create Phone / WhatsApp Order
            </h2>
            <form onSubmit={handleCreateManualOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Phone Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Delivery Address *</label>
                <textarea
                  rows={2}
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="House number, Street, City, Pincode"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Order Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Payment Method</label>
                  <select
                    value={manualPaymentMethod}
                    onChange={(e) => setManualPaymentMethod(e.target.value as any)}
                    className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg font-bold"
                  >
                    <option value="UPI">UPI (Confirmed)</option>
                    <option value="COD">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualOrderOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-bold text-brand-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase rounded-lg shadow-sm"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
