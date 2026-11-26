'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Image as ImageIcon, Plus, Edit3, Trash2, 
  CheckCircle2, Sparkles, ExternalLink, RefreshCw, Save
} from 'lucide-react';
import { store } from '@/lib/store';
import { HeroBanner, PolicyPage } from '@/lib/types';

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<'BANNERS' | 'POLICIES'>('BANNERS');
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [policies, setPolicies] = useState<PolicyPage[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyPage | null>(null);
  const [policyContent, setPolicyContent] = useState('');
  const [policyTitle, setPolicyTitle] = useState('');
  const [editingBanner, setEditingBanner] = useState<Partial<HeroBanner> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const bList = store.getBanners();
    const pList = store.getPolicies();
    setBanners(bList);
    setPolicies(pList);
    if (pList.length > 0) {
      setSelectedPolicy(pList[0]);
      setPolicyContent(pList[0].content);
      setPolicyTitle(pList[0].title);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title) return;
    store.saveBanner(editingBanner as any);
    setBanners([...store.getBanners()]);
    setEditingBanner(null);
    showToast('Hero banner saved and synced with storefront index.html');
  };

  const handleDeleteBanner = (id: number) => {
    if (confirm('Are you sure you want to delete this hero banner?')) {
      store.deleteBanner(id);
      setBanners([...store.getBanners()]);
      showToast('Banner removed from carousel');
    }
  };

  const handleSavePolicy = () => {
    if (!selectedPolicy) return;
    const updated = store.savePolicy(selectedPolicy.slug, policyContent, policyTitle);
    if (updated) {
      setPolicies([...store.getPolicies()]);
      setSelectedPolicy(updated);
      showToast(`Policy "${updated.title}" updated and published`);
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
          <h1 className="text-2xl font-bold tracking-tight text-[#16130F] font-heading uppercase flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#F58A07]" /> Content Management & Storefront Pages
          </h1>
          <p className="text-sm text-slate-500">
            Control hero slider banners, promotional tags, and legal compliance pages (FSSAI, Terms, Returns).
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('BANNERS')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'BANNERS'
                ? 'bg-white text-[#16130F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hero Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('POLICIES')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'POLICIES'
                ? 'bg-white text-[#16130F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Legal & Policy Pages ({policies.length})
          </button>
        </div>
      </div>

      {/* Hero Banners Tab */}
      {activeTab === 'BANNERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              Active Storefront Hero Slider Banners (Autoplay 4.5s)
            </span>
            <button
              onClick={() => setEditingBanner({
                title: '',
                subtitle: '',
                badge_text: 'NEW ARRIVAL',
                image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
                cta_text: 'Shop Now',
                cta_link: '/products',
                is_active: true,
                sort_order: banners.length + 1
              })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Add Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b, idx) => (
              <div 
                key={b.id} 
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-slate-900">
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-3 left-3 bg-[#F58A07] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {b.badge_text}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-lg font-heading drop-shadow-md">{b.title}</h3>
                    <p className="text-xs text-slate-200 line-clamp-1 drop-shadow-sm">{b.subtitle}</p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Slide #{b.sort_order}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                      {b.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingBanner(b)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === 'POLICIES' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Policy List (Left 4 cols) */}
          <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-3 space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2 block">
              Store Compliance Pages
            </span>
            {policies.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPolicy(p);
                  setPolicyTitle(p.title);
                  setPolicyContent(p.content);
                }}
                className={`w-full text-left p-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                  selectedPolicy?.id === p.id 
                    ? 'bg-orange-50 text-[#F58A07] font-bold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{p.title}</span>
                <span className="text-[10px] text-slate-400">{p.last_updated}</span>
              </button>
            ))}
          </div>

          {/* Policy Editor (Right 8 cols) */}
          <div className="md:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            {selectedPolicy ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-heading">
                      Edit {selectedPolicy.title}
                    </h3>
                    <span className="text-xs text-slate-400">Route: /{selectedPolicy.slug}</span>
                  </div>
                  <button
                    onClick={handleSavePolicy}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Page Heading
                  </label>
                  <input
                    type="text"
                    value={policyTitle}
                    onChange={e => setPolicyTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Document Text (FSSAI & Legal Standard)
                  </label>
                  <textarea
                    rows={12}
                    value={policyContent}
                    onChange={e => setPolicyContent(e.target.value)}
                    className="w-full p-4 text-sm leading-relaxed rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07] font-mono text-slate-800"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Banner Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-[#16130F] text-lg font-heading">
              {editingBanner.id ? 'Edit Hero Banner' : 'Create New Hero Banner'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Main Heading</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingBanner.badge_text || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, badge_text: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={editingBanner.sort_order || 1}
                    onChange={e => setEditingBanner({ ...editingBanner, sort_order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={editingBanner.image_url || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.cta_text || 'Shop Now'}
                    onChange={e => setEditingBanner({ ...editingBanner, cta_text: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Button Link</label>
                  <input
                    type="text"
                    value={editingBanner.cta_link || '/products'}
                    onChange={e => setEditingBanner({ ...editingBanner, cta_link: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
