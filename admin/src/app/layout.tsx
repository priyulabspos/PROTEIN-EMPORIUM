'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Search, X } from 'lucide-react';
import { store } from '@/lib/store';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';

  // Global Ctrl+K / Cmd+K search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const products = store.getProducts();
  const orders = store.getOrders();

  const filteredProducts = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];
  const filteredOrders = searchQuery.trim()
    ? orders.filter(o => o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  return (
    <html lang="en">
      <head>
        <title>Protein Emporium – Merchant &amp; Administrator Portal</title>
        <meta name="description" content="Central Management Console for Protein Emporium India" />
        <link rel="icon" type="image/png" href="/assets/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-brand-subtle text-brand-black flex antialiased">
        {isLoginPage ? (
          <main className="flex-1 min-h-screen">{children}</main>
        ) : (
          <>
            {/* Left Collapsible Sidebar */}
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

            {/* Main Content Container with Dynamic Padding */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'pl-16' : 'pl-64'}`}>
              <Header onSearchOpen={() => setSearchOpen(true)} />
              <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
            </div>

            {/* Global Search Modal (Ctrl+K) */}
            {searchOpen && (
              <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
                <div className="bg-white border border-brand-border rounded-xl shadow-modal w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 border-b border-brand-border flex items-center gap-2">
                    <Search size={18} className="text-brand-orange" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Type a product, order PE-..., SKU, or customer..."
                      className="flex-1 text-sm bg-transparent border-none outline-none text-brand-black placeholder:text-brand-muted"
                    />
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="p-1 rounded text-brand-muted hover:text-brand-black"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto p-2 divide-y divide-brand-border">
                    {searchQuery.trim() === '' ? (
                      <div className="py-8 text-center text-xs text-brand-muted">
                        Search across 28 products, inventory batches, and order records.
                      </div>
                    ) : (
                      <>
                        {filteredProducts.length > 0 && (
                          <div className="py-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted px-2">
                              Products
                            </span>
                            {filteredProducts.map((p) => (
                              <a
                                key={p.id}
                                href={`/products?id=${p.id}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center justify-between p-2 rounded hover:bg-brand-subtle text-xs"
                              >
                                <span className="font-semibold text-brand-black truncate">{p.name}</span>
                                <span className="text-brand-orange font-bold font-mono">₹{p.variants?.[0]?.selling_price}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {filteredOrders.length > 0 && (
                          <div className="py-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted px-2">
                              Orders
                            </span>
                            {filteredOrders.map((o) => (
                              <a
                                key={o.id}
                                href={`/orders?id=${o.id}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-center justify-between p-2 rounded hover:bg-brand-subtle text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-brand-black">{o.order_number}</span>
                                  <span className="text-brand-muted">{o.customer_name}</span>
                                </div>
                                <span className="badge badge-brand">{o.status}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {filteredProducts.length === 0 && filteredOrders.length === 0 && (
                          <div className="py-8 text-center text-xs text-brand-muted">
                            No matching items found for &quot;{searchQuery}&quot;.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </body>
    </html>
  );
}
