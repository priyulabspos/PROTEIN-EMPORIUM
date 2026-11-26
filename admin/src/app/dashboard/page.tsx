'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Package, 
  AlertTriangle, 
  RotateCcw, 
  Plus, 
  Download, 
  QrCode, 
  ArrowUpRight, 
  ArrowDownRight,
  Truck,
  IndianRupee,
  Layers,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';
import { store } from '@/lib/store';
import { OrderStatus } from '@/lib/types';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const metrics = store.getMetrics(timeRange);
  const orders = store.getOrders();
  const products = store.getProducts();
  const batches = store.getBatches();

  // Find low stock products
  const lowStockItems = products.flatMap(p => 
    (p.variants || [])
      .filter(v => v.stock_quantity <= v.low_stock_threshold)
      .map(v => ({ ...v, productName: p.name }))
  );

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    store.updateOrderStatus(orderId, newStatus);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Date Range Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-wide text-brand-black uppercase">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Real-time fulfillment metrics, revenue tracking, and inventory status for India operations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector */}
          <div className="inline-flex rounded-lg border border-brand-border p-1 bg-brand-subtle">
            {(['today', 'week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                  timeRange === range
                    ? 'bg-brand-black text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-black'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button 
            onClick={() => alert('Exporting monthly GST & sales summary CSV...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-white text-xs font-bold text-brand-black hover:border-brand-orange transition-colors"
          >
            <Download size={13} className="text-brand-orange" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/products"
          className="flex items-center gap-3 p-3 bg-white border border-brand-border rounded-xl hover:border-brand-orange hover:shadow-card transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
            <Plus size={18} />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-black truncate">Add Product</span>
            <span className="block text-[11px] text-brand-muted truncate">New formulation / SKU</span>
          </div>
        </Link>

        <Link
          href="/orders"
          className="flex items-center gap-3 p-3 bg-white border border-brand-border rounded-xl hover:border-brand-orange hover:shadow-card transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-success-bg text-brand-success flex items-center justify-center flex-shrink-0 group-hover:bg-brand-success group-hover:text-white transition-colors">
            <ShoppingCart size={18} />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-black truncate">Manual Order</span>
            <span className="block text-[11px] text-brand-muted truncate">Phone / WhatsApp order</span>
          </div>
        </Link>

        <Link
          href="/scratch-codes"
          className="flex items-center gap-3 p-3 bg-white border border-brand-border rounded-xl hover:border-brand-orange hover:shadow-card transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-orange-light text-brand-orange flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
            <QrCode size={18} />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-black truncate">Scratch Codes</span>
            <span className="block text-[11px] text-brand-muted truncate">Hologram batch verify</span>
          </div>
        </Link>

        <Link
          href="/inventory"
          className="flex items-center gap-3 p-3 bg-white border border-brand-border rounded-xl hover:border-brand-orange hover:shadow-card transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Layers size={18} />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-brand-black truncate">Stock Adjustment</span>
            <span className="block text-[11px] text-brand-muted truncate">Restock &amp; write-offs</span>
          </div>
        </Link>
      </div>

      {/* 3. Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Net Store Revenue</span>
            <span className="p-1.5 rounded-md bg-brand-orange-light text-brand-orange">
              <IndianRupee size={15} />
            </span>
          </div>
          <div className="text-2xl font-heading font-black text-brand-black">
            ₹{metrics.revenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-success mt-2">
            <ArrowUpRight size={14} />
            <span>{metrics.revenueGrowth}</span>
            <span className="text-[11px] text-brand-muted font-normal">vs previous period</span>
          </div>
        </div>

        {/* Card 2: Orders Count */}
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Orders Placed</span>
            <span className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <ShoppingCart size={15} />
            </span>
          </div>
          <div className="text-2xl font-heading font-black text-brand-black">
            {metrics.orders} Orders
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-success mt-2">
            <ArrowUpRight size={14} />
            <span>{metrics.ordersGrowth}</span>
            <span className="text-[11px] text-brand-muted font-normal">avg ₹{metrics.avgOrderValue} AOV</span>
          </div>
        </div>

        {/* Card 3: Pending Dispatches */}
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Pending Fulfillment</span>
            <span className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <Truck size={15} />
            </span>
          </div>
          <div className="text-2xl font-heading font-black text-brand-black">
            {metrics.pendingOrders} Packages
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 mt-2">
            <span>Ready for BlueDart pickup</span>
          </div>
        </div>

        {/* Card 4: Low Stock Warnings */}
        <div className="bg-white p-4 rounded-xl border border-brand-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-muted text-xs font-bold uppercase tracking-wider mb-2">
            <span>Low-Stock Alerts</span>
            <span className="p-1.5 rounded-md bg-brand-danger-bg text-brand-danger">
              <AlertTriangle size={15} />
            </span>
          </div>
          <div className="text-2xl font-heading font-black text-brand-danger">
            {metrics.lowStockCount} Variants
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-danger mt-2">
            <Link href="/inventory" className="hover:underline flex items-center gap-1">
              <span>View batch reorder list →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Charts & Visual Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 14-Day Sales Trend Visual Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-brand-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-heading font-bold text-brand-black uppercase">
                Daily Sales &amp; Dispatch Volume (Last 14 Days)
              </h2>
              <p className="text-xs text-brand-muted">Indian Rupees (INR) across UPI, NetBanking &amp; Cash on Delivery</p>
            </div>
            <span className="badge badge-success">Target Achieved 114%</span>
          </div>

          {/* Pure SVG responsive chart */}
          <div className="h-56 w-full relative flex items-end gap-2 pt-6 pb-2 border-b border-brand-border">
            {[
              { day: '13 Nov', val: 32000 },
              { day: '14 Nov', val: 45000 },
              { day: '15 Nov', val: 28000 },
              { day: '16 Nov', val: 56000 },
              { day: '17 Nov', val: 62000 },
              { day: '18 Nov', val: 51000 },
              { day: '19 Nov', val: 78000 },
              { day: '20 Nov', val: 84000 },
              { day: '21 Nov', val: 69000 },
              { day: '22 Nov', val: 92000 },
              { day: '23 Nov', val: 88000 },
              { day: '24 Nov', val: 104000 },
              { day: '25 Nov', val: 112000 },
              { day: '26 Nov', val: 125000 },
            ].map((bar, idx) => {
              const maxVal = 130000;
              const heightPct = Math.round((bar.val / maxVal) * 100);
              return (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 bg-brand-black text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    ₹{bar.val.toLocaleString('en-IN')}
                  </div>
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 group-hover:brightness-95 ${
                      idx === 13 ? 'bg-brand-orange' : 'bg-brand-black/80'
                    }`}
                  />
                  <span className="text-[9px] text-brand-muted font-bold tracking-tight">
                    {bar.day.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-brand-muted mt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-black" />
                <span>Historical Daily Revenue</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                <span>Today (₹1,25,000)</span>
              </span>
            </div>
            <span className="font-bold text-brand-black">Total: ₹9,76,000 (14 Days)</span>
          </div>
        </div>

        {/* Right 1 Col: Category Share & Payment Method Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-brand-border shadow-card flex flex-col justify-between">
          <div>
            <h2 className="text-base font-heading font-bold text-brand-black uppercase mb-1">
              Revenue By Category
            </h2>
            <p className="text-xs text-brand-muted mb-4">Volume split across product segments</p>

            <div className="space-y-3">
              {[
                { name: 'Whey Protein & Isolates', pct: 54, color: 'bg-brand-orange' },
                { name: 'Creatine Monohydrate', pct: 22, color: 'bg-brand-black' },
                { name: 'Pre-Workout & Energy', pct: 14, color: 'bg-blue-600' },
                { name: 'Vitamins & Health Foods', pct: 10, color: 'bg-emerald-600' }
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{cat.name}</span>
                    <span className="font-bold font-mono">{cat.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-brand-subtle overflow-hidden">
                    <div 
                      style={{ width: `${cat.pct}%` }} 
                      className={`h-full rounded-full ${cat.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border mt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted block mb-2">
              Payment Method Split
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-brand-black">UPI (GPay/PhonePe): 68%</span>
              <span className="text-brand-muted">Cards: 18%</span>
              <span className="text-brand-muted">COD: 14%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Orders Table & Low-Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Latest Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
          <div className="p-4 border-b border-brand-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-brand-black uppercase">
                Latest Customer Orders
              </h2>
              <p className="text-xs text-brand-muted">Orders received from the online storefront &amp; WhatsApp</p>
            </div>
            <Link href="/orders" className="text-xs font-bold text-brand-orange hover:underline uppercase">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="data-table-header">Order ID</th>
                  <th className="data-table-header">Customer</th>
                  <th className="data-table-header">Amount</th>
                  <th className="data-table-header">Payment</th>
                  <th className="data-table-header">Status</th>
                  <th className="data-table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-subtle transition-colors">
                    <td className="data-table-cell font-mono font-bold text-brand-black">
                      <Link href={`/orders?id=${order.id}`} className="hover:text-brand-orange">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="data-table-cell">
                      <div className="font-semibold text-brand-black">{order.customer_name}</div>
                      <div className="text-[11px] text-brand-muted">{order.shipping_address.city}</div>
                    </td>
                    <td className="data-table-cell font-mono font-bold text-brand-black">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="data-table-cell">
                      <span className={`badge ${
                        order.payment_status === 'PAID' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {order.payment_method} • {order.payment_status}
                      </span>
                    </td>
                    <td className="data-table-cell">
                      <span className={`badge ${
                        order.status === 'DELIVERED' ? 'badge-success' :
                        order.status === 'SHIPPED' ? 'badge-brand' :
                        order.status === 'CONFIRMED' ? 'badge-neutral' : 'badge-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="data-table-cell text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="text-xs border border-brand-border rounded px-2 py-1 bg-white font-semibold text-brand-black cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PACKED">PACKED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Low Stock Alerts */}
        <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-brand-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-heading font-bold text-brand-black uppercase">
                  Low Stock Warnings
                </h2>
                <p className="text-xs text-brand-muted">Variants below replenishment threshold</p>
              </div>
              <span className="badge badge-danger">{lowStockItems.length} Urgent</span>
            </div>

            <div className="divide-y divide-brand-border max-h-72 overflow-y-auto">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 hover:bg-brand-subtle transition-colors flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-brand-black truncate">{item.productName}</div>
                    <div className="text-[11px] text-brand-muted">{item.size} • {item.flavor} ({item.sku})</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-brand-danger font-mono block">
                      {item.stock_quantity} left
                    </span>
                    <span className="text-[10px] text-brand-muted">Threshold: {item.low_stock_threshold}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-brand-border bg-brand-subtle text-center">
            <Link href="/inventory" className="text-xs font-bold text-brand-orange hover:underline uppercase">
              Manage Purchase Orders &amp; Suppliers →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
