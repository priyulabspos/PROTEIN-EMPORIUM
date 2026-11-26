-- ============================================================================
-- PROTEIN EMPORIUM - Production Database Schema (PostgreSQL for Supabase)
-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core tables, foreign keys, constraints, and performance indexes.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. STAFF, ROLES & AUDIT LOGS
-- ============================================================================

CREATE TYPE staff_role_type AS ENUM (
    'SUPER_ADMIN',
    'MANAGER',
    'INVENTORY_STAFF',
    'SUPPORT_STAFF',
    'CONTENT_EDITOR'
);

CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- linked to Supabase auth.users if Supabase Auth is enabled
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role staff_role_type NOT NULL DEFAULT 'SUPPORT_STAFF',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret VARCHAR(64),
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles_permissions (
    id SERIAL PRIMARY KEY,
    role staff_role_type NOT NULL,
    module VARCHAR(50) NOT NULL,
    can_view BOOLEAN NOT NULL DEFAULT FALSE,
    can_create BOOLEAN NOT NULL DEFAULT FALSE,
    can_edit BOOLEAN NOT NULL DEFAULT FALSE,
    can_delete BOOLEAN NOT NULL DEFAULT FALSE,
    can_export BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (role, module)
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    staff_email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, EXPORT, STATUS_CHANGE
    module VARCHAR(50) NOT NULL, -- PRODUCTS, ORDERS, INVENTORY, SETTINGS, etc.
    entity_id VARCHAR(100),
    entity_name VARCHAR(255),
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. CATALOG: CATEGORIES, BRANDS, COLLECTIONS & PRODUCTS
-- ============================================================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title VARCHAR(150),
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    website_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title VARCHAR(150),
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE product_status_type AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    brand_id INT REFERENCES brands(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id INT REFERENCES categories(id) ON DELETE SET NULL,
    short_description TEXT,
    description TEXT,
    key_benefits TEXT[],
    how_to_use TEXT,
    ingredients TEXT,
    serving_size VARCHAR(50),
    protein_per_serving VARCHAR(50),
    bcaa_per_serving VARCHAR(50),
    is_veg BOOLEAN NOT NULL DEFAULT TRUE,
    fssai_license VARCHAR(50) DEFAULT '10021064000123',
    status product_status_type NOT NULL DEFAULT 'DRAFT',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    is_new_launch BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[],
    meta_title VARCHAR(150),
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(50) NOT NULL,      -- e.g. "1 kg (2.2 lb)", "250 g"
    flavor VARCHAR(80) NOT NULL,    -- e.g. "Double Rich Chocolate", "Unflavoured"
    sku VARCHAR(80) UNIQUE NOT NULL,
    barcode VARCHAR(80),
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    gst_rate DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    weight_grams INT NOT NULL DEFAULT 1000,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_selling_price CHECK (selling_price <= mrp),
    CONSTRAINT check_stock_positive CHECK (stock_quantity >= 0)
);

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id INT REFERENCES product_variants(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_collections (
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, collection_id)
);

-- ============================================================================
-- 3. INVENTORY, BATCHES, SUPPLIERS & STOCK MOVEMENTS
-- ============================================================================

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    gstin VARCHAR(20),
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_batches (
    id SERIAL PRIMARY KEY,
    variant_id INT NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    batch_number VARCHAR(80) NOT NULL,
    mfg_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    initial_quantity INT NOT NULL,
    current_quantity INT NOT NULL,
    supplier_id INT REFERENCES suppliers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_batch_dates CHECK (expiry_date > mfg_date),
    CONSTRAINT check_batch_qty CHECK (current_quantity >= 0)
);

CREATE TYPE stock_movement_type AS ENUM (
    'RESTOCK',
    'ORDER_SALE',
    'ORDER_CANCELLED',
    'RETURN_RESTOCK',
    'DAMAGE_WRITE_OFF',
    'AUDIT_CORRECTION'
);

CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    variant_id INT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    batch_id INT REFERENCES inventory_batches(id) ON DELETE SET NULL,
    movement_type stock_movement_type NOT NULL,
    quantity_changed INT NOT NULL, -- positive for additions, negative for deductions
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason TEXT,
    reference_id VARCHAR(100), -- order_id or po_number
    staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id INT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, ORDERED, RECEIVED, CANCELLED
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    expected_delivery_date DATE,
    received_at TIMESTAMPTZ,
    notes TEXT,
    created_by UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. CUSTOMERS & ADDRESSES
-- ============================================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tags TEXT[] DEFAULT ARRAY['New Customer'],
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    address_type VARCHAR(20) NOT NULL DEFAULT 'HOME', -- HOME, WORK, GYM
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. ORDERS, ITEMS, SHIPMENTS & STATUS HISTORY
-- ============================================================================

CREATE TYPE order_status_type AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'RETURNED',
    'REFUNDED'
);

CREATE TYPE payment_status_type AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
    'PARTIALLY_REFUNDED'
);

CREATE TYPE payment_method_type AS ENUM (
    'UPI',
    'CARD',
    'NETBANKING',
    'COD',
    'WALLET'
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. PE-88219
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    status order_status_type NOT NULL DEFAULT 'PENDING',
    payment_status payment_status_type NOT NULL DEFAULT 'PENDING',
    payment_method payment_method_type NOT NULL DEFAULT 'UPI',
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    coupon_code VARCHAR(50),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    customer_notes TEXT,
    internal_notes TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    variant_id INT REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(150) NOT NULL,
    sku VARCHAR(80) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    gst_rate DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status_type NOT NULL,
    notes TEXT,
    changed_by_staff_id UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    staff_name VARCHAR(150) DEFAULT 'System Automation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    order_id INT UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    courier_name VARCHAR(80) NOT NULL, -- BlueDart, Delhivery, XpressBees
    awb_number VARCHAR(100) UNIQUE NOT NULL,
    tracking_url TEXT,
    shipment_status VARCHAR(50) NOT NULL DEFAULT 'MANIFESTED',
    shipping_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    label_url TEXT,
    manifest_url TEXT,
    weight_grams INT,
    pickup_scheduled_date TIMESTAMPTZ,
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY', -- RAZORPAY, CASH_ON_DELIVERY
    gateway_payment_id VARCHAR(100), -- razorpay_payment_id
    gateway_order_id VARCHAR(100),   -- razorpay_order_id
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status payment_status_type NOT NULL,
    method VARCHAR(50),              -- UPI, card, netbanking, cod
    bank_or_wallet VARCHAR(50),
    error_code VARCHAR(50),
    error_description TEXT,
    settlement_status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. RETURNS, REPLACEMENTS & REFUNDS
-- ============================================================================

CREATE TYPE return_status_type AS ENUM (
    'REQUESTED',
    'APPROVED',
    'REJECTED',
    'PICKUP_SCHEDULED',
    'RECEIVED',
    'QC_PASSED',
    'QC_FAILED',
    'REFUND_ISSUED',
    'REPLACEMENT_ISSUED',
    'CLOSED'
);

CREATE TABLE returns (
    id SERIAL PRIMARY KEY,
    return_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. RET-49021
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status return_status_type NOT NULL DEFAULT 'REQUESTED',
    return_type VARCHAR(30) NOT NULL DEFAULT 'REFUND', -- REFUND or REPLACEMENT
    reason TEXT NOT NULL,
    customer_notes TEXT,
    admin_notes TEXT,
    photos TEXT[],
    pickup_awb VARCHAR(100),
    refund_amount DECIMAL(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE return_items (
    id SERIAL PRIMARY KEY,
    return_id INT NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    order_item_id INT NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    condition VARCHAR(50) DEFAULT 'SEALED_INTACT', -- SEALED_INTACT, DAMAGED, OPENED
    qc_remarks TEXT
);

CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    return_id INT REFERENCES returns(id) ON DELETE SET NULL,
    payment_id INT REFERENCES payments(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    gateway_refund_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED', -- PENDING, COMPLETED, FAILED
    refund_destination VARCHAR(50) NOT NULL DEFAULT 'ORIGINAL_PAYMENT', -- ORIGINAL_PAYMENT, WALLET
    initiated_by UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. COUPONS, OFFERS & BANNERS
-- ============================================================================

CREATE TYPE coupon_type AS ENUM ('PERCENTAGE', 'FLAT', 'FREE_SHIPPING');

CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    type coupon_type NOT NULL DEFAULT 'PERCENTAGE',
    value DECIMAL(10,2) NOT NULL,       -- percentage value (e.g. 5) or flat INR (e.g. 200)
    max_discount DECIMAL(10,2),         -- max cap in INR for percentage coupons
    min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    usage_limit_total INT,
    usage_limit_per_user INT NOT NULL DEFAULT 1,
    usage_count INT NOT NULL DEFAULT 0,
    is_first_order_only BOOLEAN NOT NULL DEFAULT FALSE,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE coupon_usages (
    id BIGSERIAL PRIMARY KEY,
    coupon_id INT NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subtitle TEXT,
    tag VARCHAR(80),
    image_url TEXT NOT NULL,
    cta_text VARCHAR(50) NOT NULL DEFAULT 'Shop Now',
    cta_link VARCHAR(255) NOT NULL DEFAULT '/#bestsellers',
    banner_type VARCHAR(50) NOT NULL DEFAULT 'HERO_SLIDER', -- HERO_SLIDER, OFFER_PILL, PROMO_DEAL
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. AUTHENTICITY / HOLOGRAM SCRATCH CODES
-- ============================================================================

CREATE TABLE scratch_batches (
    id SERIAL PRIMARY KEY,
    batch_code VARCHAR(80) UNIQUE NOT NULL, -- e.g. GPN-IN-889104
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    importer_name VARCHAR(150) NOT NULL DEFAULT 'Glanbia Performance Nutrition (India)',
    quantity INT NOT NULL,
    mfg_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    protein_content_percent DECIMAL(5,2) NOT NULL DEFAULT 81.40,
    lab_report_url TEXT,
    created_by UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scratch_codes (
    id BIGSERIAL PRIMARY KEY,
    batch_id INT NOT NULL REFERENCES scratch_batches(id) ON DELETE CASCADE,
    code VARCHAR(32) UNIQUE NOT NULL, -- e.g. PE-8842-9901
    status VARCHAR(30) NOT NULL DEFAULT 'UNUSED', -- UNUSED, VERIFIED, FLAGGED_SUSPICIOUS
    verification_count INT NOT NULL DEFAULT 0,
    first_verified_at TIMESTAMPTZ,
    last_verified_at TIMESTAMPTZ,
    last_verified_ip VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. REVIEWS & SUPPORT DESK
-- ============================================================================

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    is_verified_buyer BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    staff_reply TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. TKT-2026-904
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'ORDER_INQUIRY', -- ORDER_INQUIRY, AUTHENTICITY, REFUND, PRODUCT_ADVICE
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',       -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',          -- OPEN, IN_PROGRESS, WAITING, RESOLVED, CLOSED
    assigned_to UUID REFERENCES staff_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ticket_messages (
    id BIGSERIAL PRIMARY KEY,
    ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL, -- CUSTOMER, STAFF, SYSTEM
    sender_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    attachments TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. CMS, SETTINGS & NOTIFICATIONS
-- ============================================================================

CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_title VARCHAR(150),
    meta_description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- ORDER_PLACED, LOW_STOCK, EXPIRY_WARNING, RETURN_REQUESTED, SUPPORT_TICKET
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 11. INDEXES FOR HIGH-THROUGHPUT QUERIES
-- ============================================================================

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_scratch_codes_code ON scratch_codes(code);
CREATE INDEX idx_scratch_codes_batch ON scratch_codes(batch_id);
CREATE INDEX idx_audit_logs_staff ON audit_logs(staff_id);
CREATE INDEX idx_audit_logs_module ON audit_logs(module);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(is_read) WHERE is_read = FALSE;
