'use client';

import React, { useState, useEffect } from 'react';
import { 
  Star, Search, Filter, CheckCircle2, XCircle, 
  MessageSquare, Sparkles, RefreshCw, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { store } from '@/lib/store';
import { ProductReview } from '@/lib/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');
  const [replyingReview, setReplyingReview] = useState<ProductReview | null>(null);
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setReviews(store.getReviews());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = 
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesRating = ratingFilter === 'ALL' || r.rating === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleApprove = (id: number) => {
    const updated = store.updateReviewStatus(id, 'APPROVED');
    if (updated) {
      setReviews([...store.getReviews()]);
      showToast('Review approved and published to storefront');
    }
  };

  const handleReject = (id: number) => {
    const updated = store.updateReviewStatus(id, 'REJECTED');
    if (updated) {
      setReviews([...store.getReviews()]);
      showToast('Review marked as rejected');
    }
  };

  const handleToggleFeatured = (id: number) => {
    const updated = store.toggleReviewFeatured(id);
    if (updated) {
      setReviews([...store.getReviews()]);
      showToast(updated.is_featured ? 'Review pinned to homepage carousel' : 'Review unpinned');
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview) return;
    const updated = store.replyReview(replyingReview.id, replyText);
    if (updated) {
      setReviews([...store.getReviews()]);
      setReplyingReview(null);
      setReplyText('');
      showToast('Official brand reply posted!');
    }
  };

  const totalReviews = reviews.length;
  const pendingCount = reviews.filter(r => r.status === 'PENDING').length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '5.0';

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
            <Star className="w-6 h-6 text-[#F58A07] fill-[#F58A07]" /> Customer Reviews & Testimonials
          </h1>
          <p className="text-sm text-slate-500">
            Moderate verified buyer ratings, reply as brand, and select featured testimonials for the homepage carousel.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Rating</span>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold text-[#16130F]">{avgRating}</span>
              <div className="flex text-[#F58A07]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F58A07]" />
                ))}
              </div>
            </div>
            <span className="text-xs text-slate-400">All Products</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Moderation</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{pendingCount}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Action Needed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Buyers</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">100%</span>
            <span className="text-xs text-slate-400">OTP Authenticated</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Homepage Pinned</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#F58A07]">
              {reviews.filter(r => r.is_featured).length}
            </span>
            <span className="text-xs text-slate-400">In Carousel</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reviewer, product, keywords..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(st => (
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

          {([5, 4, 3, 2, 1] as const).map(stars => (
            <button
              key={stars}
              onClick={() => setRatingFilter(ratingFilter === stars ? 'ALL' : stars)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                ratingFilter === stars 
                  ? 'bg-[#F58A07] text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stars} <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
            <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No reviews found matching your filter criteria.
          </div>
        ) : (
          filteredReviews.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex text-[#F58A07]">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < r.rating ? 'fill-[#F58A07]' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{r.title}</span>
                    {r.is_verified_buyer && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                    "{r.comment}"
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{r.customer_name}</span>
                    <span>•</span>
                    <span className="font-semibold text-[#F58A07]">{r.product_name}</span>
                    <span>•</span>
                    <span>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {/* Brand Reply */}
                  {r.admin_reply && (
                    <div className="mt-3 p-3 bg-orange-50/60 border border-orange-200/60 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-[#16130F] flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#F58A07]" /> Official Store Response:
                      </span>
                      <p className="text-slate-700">{r.admin_reply}</p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex sm:flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0">
                  <div className="flex items-center gap-1">
                    {r.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(r.id)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {r.status}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFeatured(r.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        r.is_featured 
                          ? 'bg-orange-50 text-[#F58A07] border-orange-200' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r.is_featured ? '★ Pinned' : 'Pin to Homepage'}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingReview(r);
                        setReplyText(r.admin_reply || '');
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-[#16130F] text-lg font-heading">
              Reply to {replyingReview.customer_name}
            </h3>
            <p className="text-xs text-slate-500 italic">
              "{replyingReview.comment}"
            </p>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Brand Response (Publicly Visible)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank you for your feedback! All our protein batches are sourced directly..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-[#F58A07] text-white hover:bg-orange-600 shadow-md shadow-orange-500/20"
                >
                  Publish Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
