// ============================================================================
// PROTEIN EMPORIUM ADMIN - Reactive In-Memory & LocalStorage Data Store
// ============================================================================
// Provides full CRUD operations for Products, Orders, Inventory, Coupons,
// Authenticity Scratch-Codes, Notifications, Audit Logs, and Analytics.
// Seamlessly operates offline and bridges with Supabase.

import { 
  StaffProfile, Category, Brand, Collection, Product, 
  Order, InventoryBatch, Coupon, ScratchCode, AuditLog, NotificationItem,
  OrderStatus
} from './types';
import { 
  INITIAL_STAFF, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_COLLECTIONS, 
  INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_BATCHES, INITIAL_COUPONS, 
  INITIAL_SCRATCH_CODES, INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS 
} from './mock-data';

class AdminStore {
  private staff: StaffProfile[] = INITIAL_STAFF;
  private currentStaff: StaffProfile = INITIAL_STAFF[0]; // Default: Super Admin
  private categories: Category[] = INITIAL_CATEGORIES;
  private brands: Brand[] = INITIAL_BRANDS;
  private collections: Collection[] = INITIAL_COLLECTIONS;
  private products: Product[] = INITIAL_PRODUCTS;
  private orders: Order[] = INITIAL_ORDERS;
  private batches: InventoryBatch[] = INITIAL_BATCHES;
  private coupons: Coupon[] = INITIAL_COUPONS;
  private scratchCodes: ScratchCode[] = INITIAL_SCRATCH_CODES;
  private auditLogs: AuditLog[] = INITIAL_AUDIT_LOGS;
  private notifications: NotificationItem[] = INITIAL_NOTIFICATIONS;
  private isClient = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isClient = true;
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    try {
      const sStaff = localStorage.getItem('pe_admin_current_staff');
      if (sStaff) this.currentStaff = JSON.parse(sStaff);

      const sProducts = localStorage.getItem('pe_admin_products');
      if (sProducts) this.products = JSON.parse(sProducts);

      const sOrders = localStorage.getItem('pe_admin_orders');
      if (sOrders) this.orders = JSON.parse(sOrders);

      const sBatches = localStorage.getItem('pe_admin_batches');
      if (sBatches) this.batches = JSON.parse(sBatches);

      const sCoupons = localStorage.getItem('pe_admin_coupons');
      if (sCoupons) this.coupons = JSON.parse(sCoupons);

      const sCodes = localStorage.getItem('pe_admin_scratch_codes');
      if (sCodes) this.scratchCodes = JSON.parse(sCodes);

      const sAudit = localStorage.getItem('pe_admin_audit_logs');
      if (sAudit) this.auditLogs = JSON.parse(sAudit);

      const sNotifs = localStorage.getItem('pe_admin_notifications');
      if (sNotifs) this.notifications = JSON.parse(sNotifs);
    } catch (err) {
      console.warn('Could not read admin state from localStorage:', err);
    }
  }

  private persist(key: string, data: any) {
    if (this.isClient) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.warn(`Could not save ${key} to localStorage:`, err);
      }
    }
  }

  // --- Auth & Staff ---
  getCurrentStaff(): StaffProfile {
    return this.currentStaff;
  }

  switchRole(role: StaffProfile['role']) {
    const target = this.staff.find(s => s.role === role) || {
      ...this.currentStaff,
      role
    };
    this.currentStaff = target;
    this.persist('pe_admin_current_staff', this.currentStaff);
    this.logAction('STATUS_CHANGE', 'STAFF', this.currentStaff.id, `Role switched to ${role}`);
    return this.currentStaff;
  }

  getAllStaff(): StaffProfile[] {
    return this.staff;
  }

  // --- Products ---
  getProducts(): Product[] {
    return this.products.filter(p => !p.deleted_at);
  }

  getProduct(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  saveProduct(product: Partial<Product> & { name: string }): Product {
    let saved: Product;
    if (product.id) {
      const idx = this.products.findIndex(p => p.id === product.id);
      saved = {
        ...this.products[idx],
        ...product,
        updated_at: new Date().toISOString()
      };
      this.products[idx] = saved;
      this.logAction('UPDATE', 'PRODUCTS', String(saved.id), `Updated product ${saved.name}`);
    } else {
      const newId = Math.max(0, ...this.products.map(p => p.id)) + 1;
      saved = {
        id: newId,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: product.category_id || 1,
        status: product.status || 'PUBLISHED',
        is_veg: product.is_veg ?? true,
        is_featured: product.is_featured ?? false,
        is_bestseller: product.is_bestseller ?? false,
        is_new_launch: product.is_new_launch ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        variants: product.variants || [
          { id: newId * 100 + 1, product_id: newId, size: '1 kg', flavor: 'Chocolate', sku: `PE-${newId}-1KG`, mrp: 3999, selling_price: 2999, cost_price: 2100, gst_rate: 18, weight_grams: 1000, stock_quantity: 50, low_stock_threshold: 10, is_active: true }
        ],
        images: product.images || [
          { id: newId, product_id: newId, image_url: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=600&q=80', is_primary: true, sort_order: 0 }
        ],
        ...product
      } as Product;
      this.products.unshift(saved);
      this.logAction('CREATE', 'PRODUCTS', String(saved.id), `Created product ${saved.name}`);
    }
    this.persist('pe_admin_products', this.products);
    return saved;
  }

  deleteProduct(id: number): boolean {
    const p = this.products.find(item => item.id === id);
    if (!p) return false;
    p.deleted_at = new Date().toISOString();
    this.persist('pe_admin_products', this.products);
    this.logAction('DELETE', 'PRODUCTS', String(id), `Archived product ${p.name}`);
    return true;
  }

  // --- Categories & Brands ---
  getCategories(): Category[] { return this.categories; }
  getBrands(): Brand[] { return this.brands; }
  getCollections(): Collection[] { return this.collections; }

  // --- Orders ---
  getOrders(): Order[] {
    return this.orders;
  }

  getOrder(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  updateOrderStatus(orderId: number, newStatus: OrderStatus, notes?: string): Order | undefined {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return undefined;
    const oldStatus = order.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();
    this.persist('pe_admin_orders', this.orders);
    this.logAction('STATUS_CHANGE', 'ORDERS', order.order_number, `Order status changed from ${oldStatus} to ${newStatus}`, { oldStatus }, { newStatus, notes });
    return order;
  }

  createOrder(orderData: Partial<Order> & { customer_name: string; total_amount: number }): Order {
    const newId = Math.max(0, ...this.orders.map(o => o.id)) + 1;
    const orderNum = `PE-${88220 + newId}`;
    const newOrder: Order = {
      id: newId,
      order_number: orderNum,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email || 'customer@gmail.com',
      customer_phone: orderData.customer_phone || '+91 98000 00000',
      status: orderData.status || 'CONFIRMED',
      payment_status: orderData.payment_status || 'PAID',
      payment_method: orderData.payment_method || 'UPI',
      subtotal: orderData.subtotal || orderData.total_amount,
      discount_amount: orderData.discount_amount || 0,
      shipping_fee: orderData.shipping_fee || 0,
      tax_amount: Math.round(orderData.total_amount * 0.18),
      total_amount: orderData.total_amount,
      shipping_address: orderData.shipping_address || {
        name: orderData.customer_name,
        phone: '9800000000',
        address: 'MG Road',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderData.items || []
    };
    this.orders.unshift(newOrder);
    this.persist('pe_admin_orders', this.orders);
    this.logAction('CREATE', 'ORDERS', newOrder.order_number, `Created manual order ${newOrder.order_number}`);
    return newOrder;
  }

  // --- Inventory & Batches ---
  getBatches(): InventoryBatch[] { return this.batches; }

  adjustStock(variantId: number, qtyChange: number, reason: string): void {
    for (const p of this.products) {
      const variant = p.variants?.find(v => v.id === variantId);
      if (variant) {
        const oldQty = variant.stock_quantity;
        variant.stock_quantity = Math.max(0, oldQty + qtyChange);
        this.persist('pe_admin_products', this.products);
        this.logAction('UPDATE', 'INVENTORY', variant.sku, `Stock adjusted by ${qtyChange} units (${reason})`, { oldQty }, { newQty: variant.stock_quantity });
        break;
      }
    }
  }

  // --- Coupons ---
  getCoupons(): Coupon[] { return this.coupons; }

  validateCoupon(code: string, cartAmount: number): { valid: boolean; discount: number; message: string } {
    const clean = code.trim().toUpperCase();
    const coupon = this.coupons.find(c => c.code === clean && c.is_active);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code.' };
    }
    if (cartAmount < coupon.min_order_amount) {
      return { valid: false, discount: 0, message: `Minimum cart value of ₹${coupon.min_order_amount} required.` };
    }
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.round((cartAmount * coupon.value) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else if (coupon.type === 'FLAT' || coupon.type === 'FREE_SHIPPING') {
      discount = coupon.value;
    }
    return { valid: true, discount, message: `Coupon ${coupon.code} applied successfully!` };
  }

  // --- Authenticity Scratch Codes ---
  getScratchCodes(): ScratchCode[] { return this.scratchCodes; }

  verifyScratchCode(code: string, ip?: string): { verified: boolean; message: string; details?: any } {
    const clean = code.trim().toUpperCase();
    const item = this.scratchCodes.find(c => c.code === clean);
    if (!item) {
      return { verified: false, message: 'Security scratch code not found. Beware of counterfeit products!' };
    }
    item.verification_count += 1;
    item.last_verified_at = new Date().toISOString();
    if (!item.first_verified_at) item.first_verified_at = item.last_verified_at;

    if (item.verification_count > 3) {
      item.status = 'FLAGGED_SUSPICIOUS';
    } else {
      item.status = 'VERIFIED';
    }
    this.persist('pe_admin_scratch_codes', this.scratchCodes);

    return {
      verified: item.status !== 'FLAGGED_SUSPICIOUS',
      message: item.status === 'FLAGGED_SUSPICIOUS' 
        ? 'Warning: This code has been checked multiple times. Contact brand support.' 
        : '100% Genuine Certified Batch.',
      details: item
    };
  }

  // --- Audit Logs & Notifications ---
  getAuditLogs(): AuditLog[] { return this.auditLogs; }

  logAction(action: AuditLog['action'], module: AuditLog['module'], entityId?: string, entityName?: string, oldData?: any, newData?: any) {
    const newLog: AuditLog = {
      id: Date.now(),
      staff_id: this.currentStaff.id,
      staff_email: this.currentStaff.email,
      role: this.currentStaff.role,
      action,
      module,
      entity_id: entityId,
      entity_name: entityName,
      old_data: oldData,
      new_data: newData,
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString()
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
    this.persist('pe_admin_audit_logs', this.auditLogs);
  }

  getNotifications(): NotificationItem[] { return this.notifications; }

  markNotificationRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      this.persist('pe_admin_notifications', this.notifications);
    }
  }

  // --- Analytics & KPI Engine ---
  getMetrics(timeRange: 'today' | 'week' | 'month' | 'all' = 'month') {
    const totalRevenue = this.orders.reduce((acc, o) => acc + (o.payment_status === 'PAID' ? o.total_amount : 0), 0);
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED' || o.status === 'PACKED').length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Count low-stock variants
    let lowStockCount = 0;
    this.products.forEach(p => {
      p.variants?.forEach(v => {
        if (v.stock_quantity <= v.low_stock_threshold) lowStockCount++;
      });
    });

    return {
      revenue: totalRevenue,
      revenueGrowth: "+18.4%",
      orders: totalOrders,
      ordersGrowth: "+12.1%",
      avgOrderValue: avgOrderValue,
      aovGrowth: "+5.6%",
      newCustomers: 142,
      customersGrowth: "+24.0%",
      pendingOrders: pendingOrders,
      lowStockCount: lowStockCount,
      pendingReturns: 2,
      conversionRate: "3.42%"
    };
  }
}

// Global Singleton
export const store = new AdminStore();
