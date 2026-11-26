// ============================================================================
// PROTEIN EMPORIUM ADMIN - TypeScript Domain Models & Interfaces
// ============================================================================

export type StaffRole = 
  | 'SUPER_ADMIN' 
  | 'MANAGER' 
  | 'INVENTORY_STAFF' 
  | 'SUPPORT_STAFF' 
  | 'CONTENT_EDITOR';

export interface StaffProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: StaffRole;
  avatar_url?: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  failed_login_attempts: number;
  locked_until?: string | null;
  last_sign_in_at?: string | null;
  created_at: string;
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export';

export type AppModule = 
  | 'DASHBOARD'
  | 'PRODUCTS'
  | 'CATEGORIES'
  | 'BRANDS'
  | 'INVENTORY'
  | 'ORDERS'
  | 'RETURNS'
  | 'PAYMENTS'
  | 'CUSTOMERS'
  | 'COUPONS'
  | 'SCRATCH_CODES'
  | 'REVIEWS'
  | 'SUPPORT'
  | 'CMS'
  | 'REPORTS'
  | 'SETTINGS'
  | 'STAFF';

export interface RolePermission {
  role: StaffRole;
  module: AppModule;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_export: boolean;
}

export interface AuditLog {
  id: number;
  staff_id: string;
  staff_email: string;
  role: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'STATUS_CHANGE' | 'LOGIN' | 'LOGOUT';
  module: AppModule;
  entity_id?: string;
  entity_name?: string;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  flavor: string;
  sku: string;
  barcode?: string;
  mrp: number;
  selling_price: number;
  cost_price: number;
  gst_rate: number;
  weight_grams: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
}

export interface ProductImage {
  id: number;
  product_id: number;
  variant_id?: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  brand_id?: number;
  category_id: number;
  subcategory_id?: number;
  short_description?: string;
  description?: string;
  key_benefits?: string[];
  how_to_use?: string;
  ingredients?: string;
  serving_size?: string;
  protein_per_serving?: string;
  bcaa_per_serving?: string;
  is_veg: boolean;
  fssai_license?: string;
  status: ProductStatus;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_launch: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  brand?: Brand;
  category?: Category;
}

export interface InventoryBatch {
  id: number;
  variant_id: number;
  batch_number: string;
  mfg_date: string;
  expiry_date: string;
  initial_quantity: number;
  current_quantity: number;
  supplier_id?: number;
  product_name?: string;
  variant_sku?: string;
  created_at: string;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'WALLET';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number;
  variant_id?: number;
  product_name: string;
  variant_name: string;
  sku: string;
  unit_price: number;
  mrp: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  coupon_code?: string;
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  customer_notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  shipment?: Shipment;
}

export interface Shipment {
  id: number;
  order_id: number;
  courier_name: string;
  awb_number: string;
  tracking_url?: string;
  shipment_status: string;
  shipping_rate: number;
  dispatched_at?: string;
  delivered_at?: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  is_blocked: boolean;
  wallet_balance: number;
  tags?: string[];
  total_orders?: number;
  total_spent?: number;
  created_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  type: 'PERCENTAGE' | 'FLAT' | 'FREE_SHIPPING';
  value: number;
  max_discount?: number;
  min_order_amount: number;
  usage_limit_total?: number;
  usage_count: number;
  is_first_order_only: boolean;
  starts_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface ScratchCode {
  id: number;
  batch_id: number;
  code: string;
  status: 'UNUSED' | 'VERIFIED' | 'FLAGGED_SUSPICIOUS';
  verification_count: number;
  first_verified_at?: string;
  last_verified_at?: string;
  batch?: {
    batch_code: string;
    product_name: string;
    mfg_date: string;
    expiry_date: string;
    protein_content_percent: number;
  };
}

export interface NotificationItem {
  id: number;
  type: 'ORDER_PLACED' | 'LOW_STOCK' | 'EXPIRY_WARNING' | 'RETURN_REQUESTED' | 'SUPPORT_TICKET';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}
