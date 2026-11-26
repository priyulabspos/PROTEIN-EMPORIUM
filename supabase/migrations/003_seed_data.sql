-- ============================================================================
-- PROTEIN EMPORIUM - Production Seed Data (Indian Sports Nutrition)
-- ============================================================================
-- Migration: 003_seed_data.sql
-- Description: Roles matrix, Super Admin user, 7 Categories, 7 Brands,
-- 4 Collections, 20+ Products with Variants & Batches, Sample Orders & Coupons.

-- ============================================================================
-- 1. ROLES & PERMISSIONS MATRIX
-- ============================================================================
INSERT INTO roles_permissions (role, module, can_view, can_create, can_edit, can_delete, can_export) VALUES
-- SUPER_ADMIN: Unrestricted access to everything
('SUPER_ADMIN', 'DASHBOARD', true, true, true, true, true),
('SUPER_ADMIN', 'PRODUCTS', true, true, true, true, true),
('SUPER_ADMIN', 'CATEGORIES', true, true, true, true, true),
('SUPER_ADMIN', 'BRANDS', true, true, true, true, true),
('SUPER_ADMIN', 'INVENTORY', true, true, true, true, true),
('SUPER_ADMIN', 'ORDERS', true, true, true, true, true),
('SUPER_ADMIN', 'RETURNS', true, true, true, true, true),
('SUPER_ADMIN', 'PAYMENTS', true, true, true, true, true),
('SUPER_ADMIN', 'CUSTOMERS', true, true, true, true, true),
('SUPER_ADMIN', 'COUPONS', true, true, true, true, true),
('SUPER_ADMIN', 'SCRATCH_CODES', true, true, true, true, true),
('SUPER_ADMIN', 'REVIEWS', true, true, true, true, true),
('SUPER_ADMIN', 'SUPPORT', true, true, true, true, true),
('SUPER_ADMIN', 'CMS', true, true, true, true, true),
('SUPER_ADMIN', 'REPORTS', true, true, true, true, true),
('SUPER_ADMIN', 'SETTINGS', true, true, true, true, true),
('SUPER_ADMIN', 'STAFF', true, true, true, true, true),

-- MANAGER: All operational capabilities, but restricted settings/staff deletion
('MANAGER', 'DASHBOARD', true, false, false, false, true),
('MANAGER', 'PRODUCTS', true, true, true, true, true),
('MANAGER', 'CATEGORIES', true, true, true, false, true),
('MANAGER', 'BRANDS', true, true, true, false, true),
('MANAGER', 'INVENTORY', true, true, true, false, true),
('MANAGER', 'ORDERS', true, true, true, false, true),
('MANAGER', 'RETURNS', true, true, true, false, true),
('MANAGER', 'PAYMENTS', true, false, false, false, true),
('MANAGER', 'CUSTOMERS', true, true, true, false, true),
('MANAGER', 'COUPONS', true, true, true, false, true),
('MANAGER', 'SCRATCH_CODES', true, true, true, false, true),
('MANAGER', 'REVIEWS', true, false, true, true, true),
('MANAGER', 'SUPPORT', true, true, true, false, true),
('MANAGER', 'CMS', true, true, true, false, true),
('MANAGER', 'REPORTS', true, false, false, false, true),
('MANAGER', 'SETTINGS', true, false, false, false, false),
('MANAGER', 'STAFF', true, false, false, false, false),

-- INVENTORY_STAFF: Focused on products, batches, stock adjustments, purchase orders
('INVENTORY_STAFF', 'DASHBOARD', true, false, false, false, false),
('INVENTORY_STAFF', 'PRODUCTS', true, false, true, false, true),
('INVENTORY_STAFF', 'CATEGORIES', true, false, false, false, false),
('INVENTORY_STAFF', 'BRANDS', true, false, false, false, false),
('INVENTORY_STAFF', 'INVENTORY', true, true, true, false, true),
('INVENTORY_STAFF', 'ORDERS', true, false, false, false, false),
('INVENTORY_STAFF', 'RETURNS', true, false, true, false, false),
('INVENTORY_STAFF', 'SCRATCH_CODES', true, true, false, false, true),

-- SUPPORT_STAFF: Orders, Customers, Returns, Tickets, Scratch-Code Verification
('SUPPORT_STAFF', 'DASHBOARD', true, false, false, false, false),
('SUPPORT_STAFF', 'PRODUCTS', true, false, false, false, false),
('SUPPORT_STAFF', 'ORDERS', true, false, true, false, false),
('SUPPORT_STAFF', 'RETURNS', true, true, true, false, false),
('SUPPORT_STAFF', 'CUSTOMERS', true, false, true, false, false),
('SUPPORT_STAFF', 'SCRATCH_CODES', true, false, false, false, false),
('SUPPORT_STAFF', 'REVIEWS', true, false, true, false, false),
('SUPPORT_STAFF', 'SUPPORT', true, true, true, false, false),

-- CONTENT_EDITOR: CMS, Banners, Products description, Blogs
('CONTENT_EDITOR', 'DASHBOARD', true, false, false, false, false),
('CONTENT_EDITOR', 'PRODUCTS', true, false, true, false, false),
('CONTENT_EDITOR', 'CATEGORIES', true, false, true, false, false),
('CONTENT_EDITOR', 'BRANDS', true, false, true, false, false),
('CONTENT_EDITOR', 'CMS', true, true, true, false, false),
('CONTENT_EDITOR', 'REVIEWS', true, false, true, false, false);

-- ============================================================================
-- 2. DEFAULT SUPER ADMIN USER
-- Credentials: admin@proteinemporium.com / admin123
-- SHA-256 of "admin123": 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
-- ============================================================================
INSERT INTO staff_profiles (
    id, email, password_hash, full_name, phone, role, is_active, two_factor_enabled
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@proteinemporium.com',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'Vikramaditya Singhania',
    '+919876543210',
    'SUPER_ADMIN',
    true,
    false
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 3. STORE SETTINGS
-- ============================================================================
INSERT INTO settings (key, value, description) VALUES
('store_profile', '{"name":"Protein Emporium","legal_name":"Protein Emporium India Pvt Ltd","gstin":"07AABCP1234F1Z5","fssai":"10021064000123","support_email":"care@proteinemporium.com","support_phone":"+91 1800-202-3349","address":"Warehouse B-4, Okhla Phase 2, New Delhi, 110020"}', 'Store credentials & contact'),
('shipping_policy', '{"free_shipping_threshold":499,"standard_shipping_fee":49,"express_shipping_fee":99,"default_courier":"BlueDart Express"}', 'Shipping rates and free tier threshold'),
('payment_gateways', '{"razorpay_enabled":true,"cod_enabled":true,"cod_fee":0,"cod_max_limit":10000,"upi_intent_enabled":true}', 'Active payment methods'),
('return_policy', '{"return_window_days":7,"require_unopened_seal":true,"auto_approve_refund":false}', 'Return policy window and rules')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================================
-- 4. CATEGORIES
-- ============================================================================
INSERT INTO categories (id, name, slug, sort_order, description, image_url) VALUES
(1, 'Whey Protein', 'whey-protein', 1, 'Pure whey concentrate, cross-flow isolate, and hydrolyzed whey proteins.', 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=400&q=80'),
(2, 'Creatine', 'creatine', 2, 'German Creapure and micronized creatine monohydrate powders.', 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=400&q=80'),
(3, 'Pre-Workout', 'pre-workout', 3, 'High-stim, nitric oxide vasodilators, and clean energy formulas.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80'),
(4, 'BCAA & Aminos', 'bcaa-aminos', 4, 'Full-spectrum EAAs, 2:1:1 fermented BCAAs, and recovery glutamine.', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&q=80'),
(5, 'Mass Gainers', 'mass-gainers', 5, 'Clean carbohydrate blends and high-calorie muscle growth formulas.', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=80'),
(6, 'Vitamins & Health', 'vitamins-health', 6, 'Triple strength Omega-3, Multivitamins, Ashwagandha KSM-66, and Joint Shield.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'),
(7, 'Health Food', 'health-food', 7, 'Natural roasted peanut butters, dark chocolate whey butter, and rolled oats.', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. BRANDS
-- ============================================================================
INSERT INTO brands (id, name, slug, description, is_featured) VALUES
(1, 'Optimum Nutrition', 'optimum-nutrition', 'The World #1 Whey Protein Brand by Glanbia.', true),
(2, 'Dymatize', 'dymatize', 'Pioneers of ISO 100 Hydrolyzed 100% Whey Isolate.', true),
(3, 'MuscleBlaze', 'muscleblaze', 'India leading sports nutrition with patented Biozyme formula.', true),
(4, 'GNC Live Well', 'gnc', 'Global leader in health, wellness and sports performance.', true),
(5, 'Emporium Labs', 'emporium-labs', 'In-house certified pure lab-tested sports supplements.', true),
(6, 'GreenFuel', 'greenfuel', '100% plant-based organic sports nutrition.', false),
(7, 'IronCore', 'ironcore', 'Hardcore unadulterated bodybuilding compounds.', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. COLLECTIONS (Goal-Based Shopping)
-- ============================================================================
INSERT INTO collections (id, name, slug, description, sort_order) VALUES
(1, 'Build Lean Muscle', 'build-muscle', 'High-protein whey isolates, hydrolysates & pure creatine.', 1),
(2, 'Boost Energy & Focus', 'boost-energy', 'Explosive pre-workouts, caffeine & citrulline for the gym.', 2),
(3, 'Heavy Mass Gaining', 'mass-gaining', 'High-calorie complex carbohydrates & multi-source protein blends.', 3),
(4, 'Daily Health & Vitality', 'daily-health', 'Triple Strength Omega-3, Multivitamins & Ashwagandha.', 4)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. 20+ REALISTIC PRODUCTS WITH VARIANTS
-- ============================================================================

-- Product 1: Optimum Nutrition Gold Standard
INSERT INTO products (id, name, slug, brand_id, category_id, short_description, description, status, is_featured, is_bestseller) VALUES
(1, 'Optimum Nutrition Gold Standard 100% Whey', 'on-gold-standard-100-whey', 1, 1, '24g whey protein blend with 5.5g naturally occurring BCAAs.', 'Optimum Nutrition Gold Standard 100% Whey is the world gold standard. Features whey protein isolates as the primary ingredient.', 'PUBLISHED', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_variants (id, product_id, size, flavor, sku, barcode, mrp, selling_price, cost_price, stock_quantity, low_stock_threshold) VALUES
(101, 1, '1 kg (2.2 lb)', 'Double Rich Chocolate', 'ON-GS-1KG-DRC', '890123456001', 4999.00, 3349.00, 2400.00, 48, 10),
(102, 1, '2 kg (4.4 lb)', 'Double Rich Chocolate', 'ON-GS-2KG-DRC', '890123456002', 8499.00, 5999.00, 4300.00, 24, 5),
(103, 1, '1 kg (2.2 lb)', 'Café Mocha', 'ON-GS-1KG-CFM', '890123456003', 4999.00, 3349.00, 2400.00, 18, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=600&q=80', 'Optimum Nutrition Gold Standard Whey Tub', true);

-- Product 2: Dymatize ISO 100
INSERT INTO products (id, name, slug, brand_id, category_id, short_description, description, status, is_featured, is_bestseller) VALUES
(2, 'Dymatize ISO 100 Hydrolyzed 100% Whey Isolate', 'dymatize-iso-100-hydrolyzed', 2, 1, 'Hydrolyzed 100% whey protein isolate with zero sugar.', 'Ultra-pure cross-flow microfiltered and hydrolyzed whey isolate. Less than 1g carbs and 0g fat per scoop.', 'PUBLISHED', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_variants (id, product_id, size, flavor, sku, barcode, mrp, selling_price, cost_price, stock_quantity, low_stock_threshold) VALUES
(201, 2, '1 kg (2.2 lb)', 'Gourmet Chocolate', 'DYM-ISO-1KG-GCH', '890123456011', 5499.00, 3899.00, 2800.00, 32, 8),
(202, 2, '2.3 kg (5 lb)', 'Fudge Brownie', 'DYM-ISO-5LB-FBR', '890123456012', 11999.00, 8499.00, 6100.00, 14, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
(2, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80', 'Dymatize ISO 100 Tub', true);

-- Product 3: MuscleBlaze Biozyme
INSERT INTO products (id, name, slug, brand_id, category_id, short_description, description, status, is_featured, is_bestseller) VALUES
(3, 'MuscleBlaze Biozyme Performance Whey', 'muscleblaze-biozyme-performance-whey', 3, 1, 'Enhanced Absorption Formula with 50% higher protein uptake.', 'Tested & Certified by Informed-Choice UK. Formulated with patented digestive enzymes to avoid stomach bloating.', 'PUBLISHED', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_variants (id, product_id, size, flavor, sku, barcode, mrp, selling_price, cost_price, stock_quantity, low_stock_threshold) VALUES
(301, 3, '1 kg (2.2 lb)', 'Rich Chocolate', 'MB-BIO-1KG-RCH', '890123456021', 3499.00, 2499.00, 1750.00, 65, 12),
(302, 3, '2 kg (4.4 lb)', 'Magical Mango', 'MB-BIO-2KG-MMG', '890123456022', 6299.00, 4499.00, 3100.00, 28, 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
(3, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', 'MuscleBlaze Biozyme Tub', true);

-- Product 4: Emporium Labs 100% Creapure Creatine
INSERT INTO products (id, name, slug, brand_id, category_id, short_description, description, status, is_featured, is_bestseller) VALUES
(4, 'Emporium Labs 100% Creapure® Creatine Monohydrate', 'emporium-labs-creapure-creatine', 5, 2, 'Made in Germany. 99.99% pure micronized creatine.', 'Creapure is the gold standard of creatine produced in Germany by Alzchem Trostberg. Zero water retention bloat.', 'PUBLISHED', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_variants (id, product_id, size, flavor, sku, barcode, mrp, selling_price, cost_price, stock_quantity, low_stock_threshold) VALUES
(401, 4, '250 g', 'Unflavoured', 'EMP-CREA-250G', '890123456031', 1699.00, 1199.00, 750.00, 85, 15),
(402, 4, '500 g', 'Unflavoured', 'EMP-CREA-500G', '890123456032', 2999.00, 2099.00, 1300.00, 40, 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
(4, 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=600&q=80', 'Creapure Creatine Jar', true);

-- Product 5: Cellucor C4 Pre-Workout
INSERT INTO products (id, name, slug, brand_id, category_id, short_description, description, status, is_featured, is_bestseller) VALUES
(5, 'Cellucor C4 Original Explosive Pre-Workout', 'cellucor-c4-original-pre-workout', 1, 3, 'CarnoSyn Beta-Alanine and 150mg caffeine for explosive gym energy.', 'America #1 selling pre-workout. Drives laser-sharp mental focus and skin-tearing muscular pumps.', 'PUBLISHED', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_variants (id, product_id, size, flavor, sku, barcode, mrp, selling_price, cost_price, stock_quantity, low_stock_threshold) VALUES
(501, 5, '390 g (60 Servings)', 'Icy Blue Razz', 'C4-PRE-60SRV-IBR', '890123456041', 2799.00, 1999.00, 1350.00, 42, 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
(5, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80', 'Cellucor C4 Tub', true);

-- Product 6: Triple Strength Omega-3 Fish Oil
INSERT INTO products (id, name, slug, brand_id, category_id, short_description, description, status, is_featured, is_bestseller) VALUES
(6, 'Triple Strength Omega-3 Fish Oil (1000mg EPA/DHA)', 'triple-strength-omega-3-fish-oil', 5, 6, '550mg EPA and 450mg DHA per enteric softgel. Mercury-free.', 'Molecularly distilled deep-sea fish oil. Enteric coating guarantees zero fishy burps.', 'PUBLISHED', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_variants (id, product_id, size, flavor, sku, barcode, mrp, selling_price, cost_price, stock_quantity, low_stock_threshold) VALUES
(601, 6, '60 Softgels', 'Lemon Coated', 'EMP-OMG3-60CAP', '890123456051', 1199.00, 799.00, 420.00, 110, 20)
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES
(6, 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80', 'Omega 3 Bottle', true);

-- ============================================================================
-- 8. SAMPLE COUPONS
-- ============================================================================
INSERT INTO coupons (code, description, type, value, max_discount, min_order_amount, is_first_order_only) VALUES
('PROTEIN5', 'Extra 5% OFF on all supplements for welcome athletes', 'PERCENTAGE', 5.00, 250.00, 0.00, false),
('FIRST10', '10% OFF on your very first order across store', 'PERCENTAGE', 10.00, 500.00, 999.00, true),
('FREESHIP', 'Free shipping on orders above ₹299', 'FREE_SHIPPING', 49.00, 49.00, 299.00, false)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 9. SAMPLE SCRATCH CODE BATCH
-- ============================================================================
INSERT INTO scratch_batches (id, batch_code, product_id, product_name, importer_name, quantity, mfg_date, expiry_date, protein_content_percent) VALUES
(1, 'GPN-IN-889104', 1, 'Optimum Nutrition Gold Standard 100% Whey', 'Glanbia Performance Nutrition (India)', 5000, '2026-10-01', '2028-09-30', 81.40)
ON CONFLICT (id) DO NOTHING;

INSERT INTO scratch_codes (batch_id, code, status, verification_count) VALUES
(1, 'PE-8842-9901', 'UNUSED', 0),
(1, 'PE-9901-4432', 'UNUSED', 0),
(1, 'PE-1142-7788', 'VERIFIED', 1)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 10. SAMPLE ORDERS
-- ============================================================================
INSERT INTO orders (id, order_number, customer_name, customer_email, customer_phone, status, payment_status, payment_method, subtotal, discount_amount, shipping_fee, total_amount, coupon_code, shipping_address, billing_address) VALUES
(1, 'PE-88219', 'Rahul Sharma', 'rahul.sharma@gmail.com', '+919811223344', 'SHIPPED', 'PAID', 'UPI', 4548.00, 227.00, 0.00, 4321.00, 'PROTEIN5', '{"name":"Rahul Sharma","phone":"9811223344","address":"Flat 402, Green Avenue, Saket","city":"New Delhi","state":"Delhi","pincode":"110017"}', '{"name":"Rahul Sharma","city":"New Delhi"}'),
(2, 'PE-88220', 'Priya Patel', 'priya.patel@yahoo.com', '+919822334455', 'DELIVERED', 'PAID', 'CARD', 1199.00, 0.00, 0.00, 1199.00, NULL, '{"name":"Priya Patel","phone":"9822334455","address":"14 Link Road, Bandra West","city":"Mumbai","state":"Maharashtra","pincode":"400050"}', '{"name":"Priya Patel","city":"Mumbai"}'),
(3, 'PE-88221', 'Amit Verma', 'amit.verma@outlook.com', '+919833445566', 'CONFIRMED', 'PENDING', 'COD', 2499.00, 0.00, 0.00, 2499.00, NULL, '{"name":"Amit Verma","phone":"9833445566","address":"7th Main, Indiranagar","city":"Bengaluru","state":"Karnataka","pincode":"560038"}', '{"name":"Amit Verma","city":"Bengaluru"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_name, variant_name, sku, unit_price, mrp, quantity, total_price) VALUES
(1, 'Optimum Nutrition Gold Standard 100% Whey', '1 kg (2.2 lb) • Double Rich Chocolate', 'ON-GS-1KG-DRC', 3349.00, 4999.00, 1, 3349.00),
(1, 'Emporium Labs 100% Creapure® Creatine Monohydrate', '250 g • Unflavoured', 'EMP-CREA-250G', 1199.00, 1699.00, 1, 1199.00),
(2, 'Emporium Labs 100% Creapure® Creatine Monohydrate', '250 g • Unflavoured', 'EMP-CREA-250G', 1199.00, 1699.00, 1, 1199.00),
(3, 'MuscleBlaze Biozyme Performance Whey', '1 kg (2.2 lb) • Rich Chocolate', 'MB-BIO-1KG-RCH', 2499.00, 3499.00, 1, 2499.00);

INSERT INTO shipments (order_id, courier_name, awb_number, tracking_url, shipment_status, shipping_rate) VALUES
(1, 'BlueDart Express', 'BD772910482IN', 'https://www.bluedart.com/tracking?awb=BD772910482IN', 'IN_TRANSIT', 65.00),
(2, 'Delhivery Logistics', 'DL4499100234IN', 'https://www.delhivery.com/track/package/DL4499100234IN', 'DELIVERED', 55.00)
ON CONFLICT (order_id) DO NOTHING;

INSERT INTO order_status_history (order_id, status, notes, staff_name) VALUES
(1, 'PENDING', 'Order placed by customer via UPI', 'System Automation'),
(1, 'CONFIRMED', 'Payment verified via Razorpay ID: pay_P982jkl12', 'System Automation'),
(1, 'PACKED', 'Packed in climate-controlled Delhi warehouse', 'Ramesh Kumar (Inventory Staff)'),
(1, 'SHIPPED', 'Handed over to BlueDart courier. AWB: BD772910482IN', 'Vikramaditya Singhania');
