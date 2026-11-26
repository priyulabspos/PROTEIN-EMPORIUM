'use client';

import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { store } from '@/lib/store';
import { Category, Brand, Collection } from '@/lib/types';

export default function CategoriesAndBrandsPage() {
  const [activeTab, setActiveTab] = useState<'CATEGORIES' | 'BRANDS' | 'COLLECTIONS'>('CATEGORIES');
  const [categories, setCategories] = useState(store.getCategories());
  const [brands, setBrands] = useState(store.getBrands());
  const [collections, setCollections] = useState(store.getCollections());

  // Category Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    if (activeTab === 'CATEGORIES') {
      const newCat: Category = {
        id: categories.length + 1,
        name: newItemName,
        slug: newItemName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newItemDesc,
        sort_order: categories.length + 1,
        is_active: true,
        created_at: new Date().toISOString()
      };
      setCategories([...categories, newCat]);
    } else if (activeTab === 'BRANDS') {
      const newBrand: Brand = {
        id: brands.length + 1,
        name: newItemName,
        slug: newItemName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newItemDesc,
        is_featured: true,
        is_active: true,
        created_at: new Date().toISOString()
      };
      setBrands([...brands, newBrand]);
    } else {
      const newColl: Collection = {
        id: collections.length + 1,
        name: newItemName,
        slug: newItemName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: newItemDesc,
        sort_order: collections.length + 1,
        is_active: true
      };
      setCollections([...collections, newColl]);
    }

    setNewItemName('');
    setNewItemDesc('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black tracking-wide text-brand-black uppercase">
            Categories, Brands &amp; Goal Collections
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Organize taxonomy, official brand partner logos, and goal-oriented storefront navigation
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus size={16} />
          <span>Add New {activeTab === 'CATEGORIES' ? 'Category' : activeTab === 'BRANDS' ? 'Brand' : 'Collection'}</span>
        </button>
      </div>

      {/* 2. Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-brand-border pb-2">
        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'CATEGORIES'
              ? 'bg-brand-black text-white shadow-sm'
              : 'text-brand-muted hover:text-brand-black bg-white border border-brand-border'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('BRANDS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'BRANDS'
              ? 'bg-brand-black text-white shadow-sm'
              : 'text-brand-muted hover:text-brand-black bg-white border border-brand-border'
          }`}
        >
          Brands Stocked ({brands.length})
        </button>
        <button
          onClick={() => setActiveTab('COLLECTIONS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'COLLECTIONS'
              ? 'bg-brand-black text-white shadow-sm'
              : 'text-brand-muted hover:text-brand-black bg-white border border-brand-border'
          }`}
        >
          Goal Collections ({collections.length})
        </button>
      </div>

      {/* 3. Dynamic Tab Content Grid */}
      {activeTab === 'CATEGORIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl border border-brand-border shadow-sm flex items-start gap-4">
              <img
                src={c.image_url || 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=100&q=80'}
                alt={c.name}
                className="w-16 h-16 rounded-lg bg-brand-subtle border border-brand-border object-contain p-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-brand-black truncate">{c.name}</h3>
                  <span className="badge badge-success text-[10px]">Active</span>
                </div>
                <div className="text-[11px] font-mono text-brand-muted mt-0.5">/{c.slug}</div>
                <p className="text-xs text-brand-muted mt-2 line-clamp-2 leading-relaxed">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'BRANDS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-xl border border-brand-border shadow-sm flex items-start gap-4">
              <div className="w-14 h-14 rounded-lg bg-brand-black text-white flex items-center justify-center font-heading font-black text-xs uppercase p-2 flex-shrink-0 text-center leading-tight">
                {b.name.split(' ')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-brand-black truncate">{b.name}</h3>
                  {b.is_featured && <span className="badge badge-brand text-[10px]">Featured</span>}
                </div>
                <div className="text-[11px] font-mono text-brand-muted mt-0.5">/{b.slug}</div>
                <p className="text-xs text-brand-muted mt-2 line-clamp-2">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'COLLECTIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((coll) => (
            <div key={coll.id} className="bg-white p-4 rounded-xl border border-brand-border shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">Goal Segment #{coll.sort_order}</span>
                <h3 className="text-sm font-bold text-brand-black mt-1">{coll.name}</h3>
                <p className="text-xs text-brand-muted mt-2 line-clamp-2">{coll.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                <span className="badge badge-neutral">Live on Storefront</span>
                <span className="font-mono text-brand-muted">/{coll.slug}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-brand-border rounded-xl shadow-modal w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-heading font-black text-brand-black uppercase mb-4">
              Add New {activeTab === 'CATEGORIES' ? 'Category' : activeTab === 'BRANDS' ? 'Brand' : 'Collection'}
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Mass Gainers or MuscleTech"
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-black mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Official importer certified sports nutrition..."
                  className="w-full text-xs p-2.5 bg-brand-subtle border border-brand-border rounded-lg text-brand-black focus:outline-none focus:border-brand-orange"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-bold text-brand-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary bg-[#F58A07] hover:bg-[#D97400] text-white text-xs font-bold uppercase rounded-lg shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
