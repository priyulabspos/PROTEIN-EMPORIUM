'use client';

import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, Search, Filter, MessageSquare, Send, 
  CheckCircle2, Clock, AlertTriangle, User, Phone, Mail, 
  Sparkles, RefreshCw, ShoppingBag
} from 'lucide-react';
import { store } from '@/lib/store';
import { SupportTicket } from '@/lib/types';

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [replyText, setReplyText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const list = store.getTickets();
    setTickets(list);
    if (list.length > 0 && !selectedTicket) {
      setSelectedTicket(list[0]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.order_number && t.order_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    const staff = store.getCurrentStaff();
    const updated = store.addTicketMessage(
      selectedTicket.id, 
      replyText.trim(), 
      `${staff.full_name} (${staff.role.replace('_', ' ')})`, 
      true
    );
    if (updated) {
      setTickets([...store.getTickets()]);
      setSelectedTicket(updated);
      setReplyText('');
      showToast('Support reply delivered to customer email & SMS');
    }
  };

  const handleStatusChange = (status: SupportTicket['status']) => {
    if (!selectedTicket) return;
    const updated = store.updateTicketStatus(selectedTicket.id, status);
    if (updated) {
      setTickets([...store.getTickets()]);
      setSelectedTicket(updated);
      showToast(`Ticket status updated to ${status}`);
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
            <LifeBuoy className="w-6 h-6 text-[#F58A07]" /> Customer Support Desk
          </h1>
          <p className="text-sm text-slate-500">
            Real-time customer inquiries, transit issue resolution, ticket assignment, and multi-channel responses.
          </p>
        </div>
      </div>

      {/* Support Grid (Master / Detail Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
        {/* Ticket List (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, customer, order..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
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

          {/* Ticket Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No support tickets found.
              </div>
            ) : (
              filteredTickets.map(t => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-orange-50/60 border-l-4 border-l-[#F58A07]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-[#F58A07]">{t.ticket_number}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.priority === 'HIGH' || t.priority === 'URGENT' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{t.subject}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {t.messages[t.messages.length - 1]?.message || 'No messages'}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-medium text-slate-700">{t.customer_name}</span>
                      <span>{new Date(t.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Ticket Chat & Customer Context (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Top Action Bar */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#F58A07]">{selectedTicket.ticket_number}</span>
                    <span className="h-3 w-px bg-slate-300" />
                    <h3 className="font-bold text-slate-900 text-base">{selectedTicket.subject}</h3>
                  </div>
                  <span className="text-xs text-slate-500">
                    Customer: {selectedTicket.customer_name} ({selectedTicket.customer_phone})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={e => handleStatusChange(e.target.value as any)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden"
                  >
                    <option value="OPEN">Status: Open</option>
                    <option value="IN_PROGRESS">Status: In Progress</option>
                    <option value="RESOLVED">Status: Resolved</option>
                    <option value="CLOSED">Status: Closed</option>
                  </select>
                </div>
              </div>

              {/* Order Reference Pill (if applicable) */}
              {selectedTicket.order_number && (
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#F58A07]" /> Associated Order: {selectedTicket.order_number}
                  </span>
                  <a href="/orders" className="text-[#F58A07] font-bold hover:underline">
                    View in Orders →
                  </a>
                </div>
              )}

              {/* Conversation Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[440px]">
                {selectedTicket.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.is_staff ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700">{msg.sender_name}</span>
                      <span>•</span>
                      <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.is_staff
                          ? 'bg-[#16130F] text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type official reply to customer..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#F58A07]/20 focus:border-[#F58A07]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#F58A07] text-white font-bold text-xs rounded-xl hover:bg-orange-600 flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  <Send className="w-3.5 h-3.5" /> Reply
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Select a ticket on the left to start support conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
