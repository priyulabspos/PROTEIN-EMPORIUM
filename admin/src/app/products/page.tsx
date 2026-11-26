'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  IndianRupee, 
  Layers, 
  Tag, 
  X, 
  Upload, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { store } from '@/lib/store';
import { Product, ProductVariant } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState(store.getProducts());
  const categories = store.getCategories();
  const brands = store.getBrands();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Product Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.variants?.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || String(p.category_id) === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      slug: '',
      category_id: 1,
      brand_id: 1,
      short_description: '',
      description: '',
      serving_size: '30 g (1 Scoop)',
      protein_per_serving: '24 g',
      is_veg: true,
      status: 'PUBLISHED',
      is_featured: false,
      is_bestseller: false,
      variants: [
        {
          id: Date.now(),
          product_id: 0,
          size: '1 kg (2.2 lb)',
          flavor: 'Double Rich Chocolate',
          sku: `PE-NEW-${Math.floor(100 + Math.random() * 900)}`,
          mrp: 3999,
          selling_price: 2999,
          cost_price: 2100,
          gst_rate: 18,
          weight_grams: 1000,
          stock_quantity: 50,
          low_stock_threshold: 10,
          is_active: true
        }
      ],
      images: [
        {
          id: Date.now(),
          product_id: 0,
          image_url: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=600&q=80',
          alt_text: 'Product Image',
          is_primary: true,
          sort_order: 0
        }
      ]
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsEditorOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Archive and soft-delete "${name}"? It will be removed from customer storefront.`)) {
      store.deleteProduct(id);
      setProducts(store.getProducts());
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleDuplicate = (product: Product) => {
    const clone = JSON.parse(JSON.stringify(product));
    delete clone.id;
    clone.name = `${clone.name} (Copy)`;
    clone.slug = `${clone.slug}-copy`;
    clone.status = 'DRAFT';
    store.saveProduct(clone);
    setProducts(store.getProducts());
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name) return;

    store.saveProduct(editingProduct as any);
    setProducts(store.getProducts());
    setIsEditorOpen(false);
  };

  const handleBulkAction = (action: 'PUBLISH' | 'DRAFT' | 'DELETE') => {
    if (selectedIds.length === 0) return;
    if (action === 'DELETE') {
      if (!confirm(`Delete ${selectedIds.length} selected products?`)) return;
      selectedIds.forEach(id => store.deleteProduct(id));
    } else {
      selectedIds.forEach(id => {
        const p = store.getProduct(id);
        if (p) store.saveProduct({ ...p, status: action === 'PUBLISH' ? 'PUBLISHED' : 'DRAFT' });
      });
    }
    setProducts(store.getProducts());
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const rows = [
      ['ID', 'Name', 'Category', 'SKU', 'Selling Price (INR)', 'MRP (INR)', 'Stock', 'Status']
    ];
    filteredProducts.forEach(p => {
      const v = p.variants?.[0];
      const cat = categories.find(c => c.id === p.category_id)?.name || 'Unassigned';
      rows.push([
        String(p.id),
        `"${p.name.replace(/"/g, '""')}"`,
        `"${cat}"`,
        v?.sku || '',
        String(v?.selling_price || 0),
        String(v?.mrp || 0),
        String(v?.stock_quantity || 0),
        p.status
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `protein_emporium_catalog_${new Date().toISOString().slice(0,10)}.csv`);
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
            Product Catalog &amp; Formulations ({products.length})
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage sports nutrition catalog, multi-size variants, pricing, GST rates, and imagery
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brand-border bg-white text-xs font-bold text-brand-black hover:border-brand-orange transition-colors"
          >
            <Download size={14} className="text-brand-orange" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Bulk Action Strip */}
      <div className="bg-white p-3 rounded-xl border border-brand-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name, SKU, flavor..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-brand-subtle border border-brand-border rounded-md text-brand-black focus:outline-none focus:border-brand-orange focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs border border-brand-border rounded-md px-2.5 py-1.5 bg-white text-brand-black font-semibold cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-brand-border rounded-md px-2.5 py-1.5 bg-white text-brand-black font-semibold cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-brand-orange-light px-3 py-1.5 rounded-lg border border-orange-200">
            <span className="text-xs font-bold text-brand-orange">{selectedIds.length} Selected</span>
            <div className="h-4 w-px bg-orange-300" />
            <button
              onClick={() => handleBulkAction('PUBLISH')}
              className="text-xs font-bold text-brand-black hover:text-brand-orange"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('DRAFT')}
              className="text-xs font-bold text-brand-black hover:text-brand-orange"
            >
              Draft
            </button>
            <button
              onClick={() => handleBulkAction('DELETE')}
              className="text-xs font-bold text-brand-danger hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* 3. Products Data Table */}
      <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="data-table-header w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                    className="rounded border-brand-border text-brand-orange cursor-pointer"
                  />
                </th>
                <th className="data-table-header">Product Details</th>
                <th className="data-table-header">Category &amp; Brand</th>
                <th className="data-table-header">Pricing &amp; Margins</th>
                <th className="data-table-header">Inventory</th>
                <th className="data-table-header">Status</th>
                <th className="data-table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredProducts.map((p) => {
                const primaryVariant = p.variants?.[0];
                const cat = categories.find(c => c.id === p.category_id);
                const brand = brands.find(b => b.id === p.brand_id);
                const totalStock = p.variants?.reduce((acc, v) => acc + v.stock_quantity, 0) || 0;
                const isLowStock = p.variants?.some(v => v.stock_quantity <= v.low_stock_threshold);

                return (
                  <tr key={p.id} className="hover:bg-brand-subtle/50 transition-colors">
                    <td className="data-table-cell">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleToggleSelect(p.id)}
                        className="rounded border-brand-border text-brand-orange cursor-pointer"
                      />
                    </td>
                    <td className="data-table-cell">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg bg-brand-subtle border border-brand-border object-contain p-1 flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/logo.png';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-brand-black line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-brand-muted font-mono">
                            SKU: {primaryVariant?.sku || 'N/A'} • {p.variants?.length || 1} Variant(s)
                          </div>
                          {p.is_bestseller && (
                            <span className="badge badge-brand mt-1">Bestseller</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="data-table-cell">
                      <div className="text-xs font-semibold text-brand-black">{cat?.name || 'General'}</div>
                      <div className="text-[11px] text-brand-muted">{brand?.name || 'Emporium Labs'}</div>
                    </td>
                    <td className="data-table-cell">
                      <div className="text-xs font-bold text-brand-black font-mono">
                        ₹{primaryVariant?.selling_price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-brand-muted line-through">
                        MRP: ₹{primaryVariant?.mrp.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-brand-success font-semibold">
                        GST: {primaryVariant?.gst_rate}%
                      </div>
                    </td>
                    <td className="data-table-cell">
                      <div className="text-xs font-bold font-mono">
                        <span className={isLowStock ? 'text-brand-danger' : 'text-brand-black'}>
                          {totalStock} In Stock
                        </span>
                      </div>
                      {isLowStock && (
                        <span className="badge badge-danger text-[9px]">Low Stock</span>
                      )}
                    </td>
                    <td className="data-table-cell">
                      <span className={`badge ${
                        p.status === 'PUBLISHED' ? 'badge-success' : 'badge-neutral'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="data-table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded text-brand-muted hover:text-brand-black hover:bg-brand-subtle"
                          title="Edit Product"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 rounded text-brand-muted hover:text-brand-black hover:bg-brand-subtle"
                          title="Duplicate Product"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded text-brand-danger hover:bg-brand-danger-bg"
                          title="Archive / Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Complete Product Editor Slide-Over Modal */}
      {isEditorOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-modal overflow-y-auto flex flex-col animate-in slide-in-from-right duration-200">
            {/* Modal Header */}
            <div className="h-16 px-6 border-b border-brand-border flex items-center justify-between sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-base font-heading font-black text-brand-black uppercase">
                  {editingProduct.id ? 'Edit Supplement Formulation' : 'Create New Product'}
                </h2>
                <p className="text-[11px] text-brand-muted">Configure specs, variants, GST, and storefront pricing</p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-subtle text-brand-muted hover:text-brand-black"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 flex-1">
              {/* Product Basic Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-orange border-b border-brand-border pb-1">
                  1. Basic Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Optimum Nutrition Gold Standard 100% Whey"
                    className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">Category *</label>
                    <select
                      value={editingProduct.category_id || 1}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category_id: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">Brand *</label>
                    <select
                      value={editingProduct.brand_id || 1}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand_id: Number(e.target.value) })}
                      className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.short_description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                    placeholder="24g whey protein blend with 5.5g naturally occurring BCAAs..."
                    className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange"
                  />
                </div>
              </div>

              {/* Nutritional Facts & FSSAI */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-orange border-b border-brand-border pb-1">
                  2. Supplement Facts &amp; Compliance
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">Serving Size</label>
                    <input
                      type="text"
                      value={editingProduct.serving_size || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, serving_size: e.target.value })}
                      placeholder="e.g. 30 g (1 Scoop)"
                      className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">Protein / Serving</label>
                    <input
                      type="text"
                      value={editingProduct.protein_per_serving || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, protein_per_serving: e.target.value })}
                      placeholder="e.g. 25 g"
                      className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">FSSAI License</label>
                    <input
                      type="text"
                      value={editingProduct.fssai_license || '10021064000123'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fssai_license: e.target.value })}
                      className="w-full text-xs p-2 bg-brand-subtle border border-brand-border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_veg ?? true}
                      onChange={(e) => setEditingProduct({ ...editingProduct, is_veg: e.target.checked })}
                      className="rounded text-brand-orange"
                    />
                    <span>100% Vegetarian (Green Mark)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_bestseller ?? false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, is_bestseller: e.target.checked })}
                      className="rounded text-brand-orange"
                    />
                    <span>Flag as Bestseller</span>
                  </label>
                </div>
              </div>

              {/* Primary Variant Pricing & Stock */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-orange border-b border-brand-border pb-1">
                  3. Primary Variant (SKU, Price &amp; Stock)
                </h3>

                {editingProduct.variants && editingProduct.variants.length > 0 && (
                  <div className="p-4 bg-brand-subtle rounded-xl border border-brand-border space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-black mb-1">Size</label>
                        <input
                          type="text"
                          value={editingProduct.variants[0].size}
                          onChange={(e) => {
                            const vars = [...editingProduct.variants!];
                            vars[0].size = e.target.value;
                            setEditingProduct({ ...editingProduct, variants: vars });
                          }}
                          className="w-full text-xs p-2 bg-white border border-brand-border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-black mb-1">Flavour</label>
                        <input
                          type="text"
                          value={editingProduct.variants[0].flavor}
                          onChange={(e) => {
                            const vars = [...editingProduct.variants!];
                            vars[0].flavor = e.target.value;
                            setEditingProduct({ ...editingProduct, variants: vars });
                          }}
                          className="w-full text-xs p-2 bg-white border border-brand-border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-brand-black mb-1">Selling Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.variants[0].selling_price}
                          onChange={(e) => {
                            const vars = [...editingProduct.variants!];
                            vars[0].selling_price = Number(e.target.value);
                            setEditingProduct({ ...editingProduct, variants: vars });
                          }}
                          className="w-full text-xs p-2 bg-white border border-brand-border rounded font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-black mb-1">MRP (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.variants[0].mrp}
                          onChange={(e) => {
                            const vars = [...editingProduct.variants!];
                            vars[0].mrp = Number(e.target.value);
                            setEditingProduct({ ...editingProduct, variants: vars });
                          }}
                          className="w-full text-xs p-2 bg-white border border-brand-border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-brand-black mb-1">Initial Stock</label>
                        <input
                          type="number"
                          value={editingProduct.variants[0].stock_quantity}
                          onChange={(e) => {
                            const vars = [...editingProduct.variants!];
                            vars[0].stock_quantity = Number(e.target.value);
                            setEditingProduct({ ...editingProduct, variants: vars });
                          }}
                          className="w-full text-xs p-2 bg-white border border-brand-border rounded font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Image URL */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-orange border-b border-brand-border pb-1">
                  4. High-Resolution Product Image
                </h3>

                <div>
                  <label className="block text-xs font-bold text-brand-black mb-1">Image URL (Unsplash or Supabase Storage)</label>
                  <input
                    type="url"
                    value={editingProduct.images?.[0]?.image_url || ''}
                    onChange={(e) => {
                      const imgs = [...(editingProduct.images || [])];
                      if (imgs.length === 0) {
                        imgs.push({ id: Date.now(), product_id: 0, image_url: e.target.value, is_primary: true, sort_order: 0 });
                      } else {
                        imgs[0].image_url = e.target.value;
                      }
                      setEditingProduct({ ...editingProduct, images: imgs });
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black"
                  />
                  {editingProduct.images?.[0]?.image_url && (
                    <div className="mt-2 w-20 h-20 rounded border border-brand-border bg-brand-subtle p-1 flex items-center justify-center">
                      <img 
                        src={editingProduct.images[0].image_url} 
                        alt="Preview" 
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/assets/logo.png'; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Save Button */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-bold text-brand-black hover:bg-brand-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
                >
                  Save Product Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
