'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  RotateCcw,
  CreditCard,
  Users,
  TicketPercent,
  QrCode,
  Star,
  LifeBuoy,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  History,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { store } from '@/lib/store';
import { canAccessPath } from '@/lib/permissions';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeAlert?: string;
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const staff = store.getCurrentStaff();

  const navigationGroups: NavGroup[] = [
    {
      group: 'Core',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'Catalog & Stock',
      items: [
        { label: 'Products', href: '/products', icon: Package, badge: '28' },
        { label: 'Categories & Brands', href: '/categories', icon: Layers },
        { label: 'Inventory & Batches', href: '/inventory', icon: Boxes, badgeAlert: 'Low' }
      ]
    },
    {
      group: 'Commerce',
      items: [
        { label: 'Orders', href: '/orders', icon: ShoppingCart, badge: '3' },
        { label: 'Returns & Refunds', href: '/returns', icon: RotateCcw, badge: '2' },
        { label: 'Payments', href: '/payments', icon: CreditCard },
        { label: 'Customers', href: '/customers', icon: Users }
      ]
    },
    {
      group: 'Marketing & Security',
      items: [
        { label: 'Coupons & Banners', href: '/coupons', icon: TicketPercent },
        { label: 'Scratch Codes', href: '/scratch-codes', icon: QrCode, highlight: true },
        { label: 'Reviews & Ratings', href: '/reviews', icon: Star }
      ]
    },
    {
      group: 'Support & Content',
      items: [
        { label: 'Support Desk', href: '/support', icon: LifeBuoy },
        { label: 'Pages & CMS', href: '/cms', icon: FileText }
      ]
    },
    {
      group: 'Administration',
      items: [
        { label: 'Analytics & Reports', href: '/reports', icon: BarChart3 },
        { label: 'Staff & Roles', href: '/staff', icon: ShieldCheck },
        { label: 'Audit Logs', href: '/audit-logs', icon: History },
        { label: 'Store Settings', href: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-brand-border flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border bg-white flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-md bg-brand-black flex items-center justify-center flex-shrink-0 p-1">
            <img src="/assets/logo.png" alt="Protein Emporium Logo" className="w-full h-full object-contain" onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.png';
            }} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-wider text-brand-black uppercase leading-tight">
                PROTEIN EMPORIUM
              </span>
              <span className="text-[10px] text-brand-orange font-bold uppercase tracking-widest leading-none">
                ADMIN CONSOLE
              </span>
            </div>
          )}
        </Link>
        <button 
          onClick={onToggle}
          className="w-7 h-7 rounded-md border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-black hover:bg-brand-subtle transition-colors flex-shrink-0 ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navigationGroups.map((grp) => {
          // Filter items based on staff role
          const visibleItems = grp.items.filter(item => canAccessPath(staff.role, item.href));
          if (visibleItems.length === 0) return null;

          return (
            <div key={grp.group} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-muted/70 mb-1">
                  {grp.group}
                </div>
              )}
              {visibleItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-brand-black text-white shadow-sm' 
                        : 'text-brand-black/80 hover:bg-brand-subtle hover:text-brand-black'
                    }`}
                  >
                    <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-brand-orange' : 'text-brand-muted'}`} />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-brand-orange text-white' : 'bg-brand-subtle text-brand-muted border border-brand-border'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {!collapsed && item.badgeAlert && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-danger-bg text-brand-danger border border-red-200">
                        {item.badgeAlert}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bottom Profile & Storefront Link */}
      <div className="p-3 border-t border-brand-border bg-brand-subtle flex-shrink-0">
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold text-brand-muted hover:text-brand-black hover:bg-white transition-colors mb-2"
          title="Open Public Customer Storefront"
        >
          <ExternalLink size={14} className="text-brand-orange flex-shrink-0" />
          {!collapsed && <span className="truncate">View Live Storefront</span>}
        </a>

        {!collapsed ? (
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-brand-black text-brand-orange flex items-center justify-center font-bold text-xs flex-shrink-0">
              {staff.full_name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-brand-black truncate leading-tight">
                {staff.full_name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                {staff.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-brand-black text-brand-orange flex items-center justify-center font-bold text-xs">
              {staff.full_name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
