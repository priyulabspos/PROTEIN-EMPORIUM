// ============================================================================
// PROTEIN EMPORIUM ADMIN - Role-Based Access Control (RBAC) & Permissions
// ============================================================================

import { StaffRole, AppModule, PermissionAction } from './types';

export interface ModulePermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export const ROLE_PERMISSIONS: Record<StaffRole, Record<AppModule, ModulePermissions>> = {
  SUPER_ADMIN: {
    DASHBOARD: { view: true, create: true, edit: true, delete: true, export: true },
    PRODUCTS: { view: true, create: true, edit: true, delete: true, export: true },
    CATEGORIES: { view: true, create: true, edit: true, delete: true, export: true },
    BRANDS: { view: true, create: true, edit: true, delete: true, export: true },
    INVENTORY: { view: true, create: true, edit: true, delete: true, export: true },
    ORDERS: { view: true, create: true, edit: true, delete: true, export: true },
    RETURNS: { view: true, create: true, edit: true, delete: true, export: true },
    PAYMENTS: { view: true, create: true, edit: true, delete: true, export: true },
    CUSTOMERS: { view: true, create: true, edit: true, delete: true, export: true },
    COUPONS: { view: true, create: true, edit: true, delete: true, export: true },
    SCRATCH_CODES: { view: true, create: true, edit: true, delete: true, export: true },
    REVIEWS: { view: true, create: true, edit: true, delete: true, export: true },
    SUPPORT: { view: true, create: true, edit: true, delete: true, export: true },
    CMS: { view: true, create: true, edit: true, delete: true, export: true },
    REPORTS: { view: true, create: true, edit: true, delete: true, export: true },
    SETTINGS: { view: true, create: true, edit: true, delete: true, export: true },
    STAFF: { view: true, create: true, edit: true, delete: true, export: true },
  },
  MANAGER: {
    DASHBOARD: { view: true, create: false, edit: false, delete: false, export: true },
    PRODUCTS: { view: true, create: true, edit: true, delete: true, export: true },
    CATEGORIES: { view: true, create: true, edit: true, delete: false, export: true },
    BRANDS: { view: true, create: true, edit: true, delete: false, export: true },
    INVENTORY: { view: true, create: true, edit: true, delete: false, export: true },
    ORDERS: { view: true, create: true, edit: true, delete: false, export: true },
    RETURNS: { view: true, create: true, edit: true, delete: false, export: true },
    PAYMENTS: { view: true, create: false, edit: false, delete: false, export: true },
    CUSTOMERS: { view: true, create: true, edit: true, delete: false, export: true },
    COUPONS: { view: true, create: true, edit: true, delete: false, export: true },
    SCRATCH_CODES: { view: true, create: true, edit: true, delete: false, export: true },
    REVIEWS: { view: true, create: false, edit: true, delete: true, export: true },
    SUPPORT: { view: true, create: true, edit: true, delete: false, export: true },
    CMS: { view: true, create: true, edit: true, delete: false, export: true },
    REPORTS: { view: true, create: false, edit: false, delete: false, export: true },
    SETTINGS: { view: true, create: false, edit: false, delete: false, export: false },
    STAFF: { view: true, create: false, edit: false, delete: false, export: false },
  },
  INVENTORY_STAFF: {
    DASHBOARD: { view: true, create: false, edit: false, delete: false, export: false },
    PRODUCTS: { view: true, create: false, edit: true, delete: false, export: true },
    CATEGORIES: { view: false, create: false, edit: false, delete: false, export: false },
    BRANDS: { view: false, create: false, edit: false, delete: false, export: false },
    INVENTORY: { view: true, create: true, edit: true, delete: false, export: true },
    ORDERS: { view: false, create: false, edit: false, delete: false, export: false },
    RETURNS: { view: true, create: false, edit: true, delete: false, export: false },
    PAYMENTS: { view: false, create: false, edit: false, delete: false, export: false },
    CUSTOMERS: { view: false, create: false, edit: false, delete: false, export: false },
    COUPONS: { view: false, create: false, edit: false, delete: false, export: false },
    SCRATCH_CODES: { view: true, create: true, edit: false, delete: false, export: true },
    REVIEWS: { view: false, create: false, edit: false, delete: false, export: false },
    SUPPORT: { view: false, create: false, edit: false, delete: false, export: false },
    CMS: { view: false, create: false, edit: false, delete: false, export: false },
    REPORTS: { view: false, create: false, edit: false, delete: false, export: false },
    SETTINGS: { view: false, create: false, edit: false, delete: false, export: false },
    STAFF: { view: false, create: false, edit: false, delete: false, export: false },
  },
  SUPPORT_STAFF: {
    DASHBOARD: { view: true, create: false, edit: false, delete: false, export: false },
    PRODUCTS: { view: true, create: false, edit: false, delete: false, export: false },
    CATEGORIES: { view: false, create: false, edit: false, delete: false, export: false },
    BRANDS: { view: false, create: false, edit: false, delete: false, export: false },
    INVENTORY: { view: false, create: false, edit: false, delete: false, export: false },
    ORDERS: { view: true, create: true, edit: true, delete: false, export: false },
    RETURNS: { view: true, create: true, edit: true, delete: false, export: false },
    PAYMENTS: { view: false, create: false, edit: false, delete: false, export: false },
    CUSTOMERS: { view: true, create: false, edit: true, delete: false, export: false },
    COUPONS: { view: false, create: false, edit: false, delete: false, export: false },
    SCRATCH_CODES: { view: true, create: false, edit: false, delete: false, export: false },
    REVIEWS: { view: true, create: false, edit: true, delete: false, export: false },
    SUPPORT: { view: true, create: true, edit: true, delete: false, export: false },
    CMS: { view: false, create: false, edit: false, delete: false, export: false },
    REPORTS: { view: false, create: false, edit: false, delete: false, export: false },
    SETTINGS: { view: false, create: false, edit: false, delete: false, export: false },
    STAFF: { view: false, create: false, edit: false, delete: false, export: false },
  },
  CONTENT_EDITOR: {
    DASHBOARD: { view: true, create: false, edit: false, delete: false, export: false },
    PRODUCTS: { view: true, create: false, edit: true, delete: false, export: false },
    CATEGORIES: { view: true, create: false, edit: true, delete: false, export: false },
    BRANDS: { view: true, create: false, edit: true, delete: false, export: false },
    INVENTORY: { view: false, create: false, edit: false, delete: false, export: false },
    ORDERS: { view: false, create: false, edit: false, delete: false, export: false },
    RETURNS: { view: false, create: false, edit: false, delete: false, export: false },
    PAYMENTS: { view: false, create: false, edit: false, delete: false, export: false },
    CUSTOMERS: { view: false, create: false, edit: false, delete: false, export: false },
    COUPONS: { view: false, create: false, edit: false, delete: false, export: false },
    SCRATCH_CODES: { view: false, create: false, edit: false, delete: false, export: false },
    REVIEWS: { view: true, create: false, edit: true, delete: false, export: false },
    SUPPORT: { view: false, create: false, edit: false, delete: false, export: false },
    CMS: { view: true, create: true, edit: true, delete: false, export: false },
    REPORTS: { view: false, create: false, edit: false, delete: false, export: false },
    SETTINGS: { view: false, create: false, edit: false, delete: false, export: false },
    STAFF: { view: false, create: false, edit: false, delete: false, export: false },
  },
};

export function hasPermission(
  role: StaffRole,
  module: AppModule,
  action: PermissionAction = 'view'
): boolean {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  const modulePerms = ROLE_PERMISSIONS[role][module];
  if (!modulePerms) return false;
  return modulePerms[action] === true;
}

export function canAccessPath(role: StaffRole, pathname: string): boolean {
  if (role === 'SUPER_ADMIN') return true;

  if (pathname === '/' || pathname === '/dashboard') return true;
  if (pathname.startsWith('/products')) return hasPermission(role, 'PRODUCTS', 'view');
  if (pathname.startsWith('/categories') || pathname.startsWith('/brands')) return hasPermission(role, 'CATEGORIES', 'view');
  if (pathname.startsWith('/inventory')) return hasPermission(role, 'INVENTORY', 'view');
  if (pathname.startsWith('/orders')) return hasPermission(role, 'ORDERS', 'view');
  if (pathname.startsWith('/returns')) return hasPermission(role, 'RETURNS', 'view');
  if (pathname.startsWith('/payments')) return hasPermission(role, 'PAYMENTS', 'view');
  if (pathname.startsWith('/customers')) return hasPermission(role, 'CUSTOMERS', 'view');
  if (pathname.startsWith('/coupons')) return hasPermission(role, 'COUPONS', 'view');
  if (pathname.startsWith('/scratch-codes')) return hasPermission(role, 'SCRATCH_CODES', 'view');
  if (pathname.startsWith('/reviews')) return hasPermission(role, 'REVIEWS', 'view');
  if (pathname.startsWith('/support')) return hasPermission(role, 'SUPPORT', 'view');
  if (pathname.startsWith('/cms')) return hasPermission(role, 'CMS', 'view');
  if (pathname.startsWith('/reports')) return hasPermission(role, 'REPORTS', 'view');
  if (pathname.startsWith('/settings')) return hasPermission(role, 'SETTINGS', 'view');
  if (pathname.startsWith('/staff')) return hasPermission(role, 'STAFF', 'view');

  return true;
}
