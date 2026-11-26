-- ============================================================================
-- PROTEIN EMPORIUM - Row Level Security (RLS) Policies
-- ============================================================================
-- Migration: 002_rls_policies.sql
-- Description: Enforce server-side security, RBAC, and secure public read-access.

-- Enable RLS on every table
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scratch_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE scratch_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Get staff role of authenticated user
CREATE OR REPLACE FUNCTION get_current_staff_role()
RETURNS VARCHAR AS $$
DECLARE
    staff_role VARCHAR;
BEGIN
    SELECT role::text INTO staff_role 
    FROM staff_profiles 
    WHERE auth_user_id = auth.uid() AND is_active = TRUE;
    RETURN staff_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current caller is any authenticated active staff member
CREATE OR REPLACE FUNCTION is_active_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM staff_profiles
        WHERE (auth_user_id = auth.uid() OR id::text = current_setting('request.jwt.claims', true)::json->>'sub')
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if caller is Super Admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM staff_profiles
        WHERE auth_user_id = auth.uid()
        AND role = 'SUPER_ADMIN'
        AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 1. PUBLIC STOREFRONT READ POLICIES (Anonymous & Customer Access)
-- ============================================================================

-- Public can read active categories
CREATE POLICY "Public read active categories"
ON categories FOR SELECT
USING (is_active = TRUE);

-- Public can read active brands
CREATE POLICY "Public read active brands"
ON brands FOR SELECT
USING (is_active = TRUE);

-- Public can read active collections
CREATE POLICY "Public read active collections"
ON collections FOR SELECT
USING (is_active = TRUE);

-- Public can read published products (not deleted)
CREATE POLICY "Public read published products"
ON products FOR SELECT
USING (status = 'PUBLISHED' AND deleted_at IS NULL);

-- Public can read active variants of published products
CREATE POLICY "Public read active variants"
ON product_variants FOR SELECT
USING (
    is_active = TRUE AND 
    EXISTS (SELECT 1 FROM products p WHERE p.id = product_variants.product_id AND p.status = 'PUBLISHED' AND p.deleted_at IS NULL)
);

-- Public can read images of published products
CREATE POLICY "Public read product images"
ON product_images FOR SELECT
USING (
    EXISTS (SELECT 1 FROM products p WHERE p.id = product_images.product_id AND p.status = 'PUBLISHED' AND p.deleted_at IS NULL)
);

-- Public can read active banners
CREATE POLICY "Public read active banners"
ON banners FOR SELECT
USING (is_active = TRUE AND starts_at <= NOW() AND (ends_at IS NULL OR ends_at >= NOW()));

-- Public can read published pages
CREATE POLICY "Public read published pages"
ON pages FOR SELECT
USING (is_published = TRUE);

-- Public can read approved reviews
CREATE POLICY "Public read approved reviews"
ON reviews FOR SELECT
USING (is_approved = TRUE);

-- Public can read active coupons for cart validation
CREATE POLICY "Public validate active coupons"
ON coupons FOR SELECT
USING (is_active = TRUE AND starts_at <= NOW() AND (expires_at IS NULL OR expires_at >= NOW()));

-- Public can view scratch code verification status (read only code and verification count)
CREATE POLICY "Public verify scratch codes"
ON scratch_codes FOR SELECT
USING (true);

-- Public can view batch info for scratch codes
CREATE POLICY "Public view scratch batches"
ON scratch_batches FOR SELECT
USING (true);

-- Public customer can insert new orders via storefront checkout
CREATE POLICY "Public create order"
ON orders FOR INSERT
WITH CHECK (true);

-- Public customer can insert order items
CREATE POLICY "Public create order items"
ON order_items FOR INSERT
WITH CHECK (true);

-- Public can track shipment by order number and phone
CREATE POLICY "Public track orders"
ON orders FOR SELECT
USING (true);

-- ============================================================================
-- 2. STAFF & ADMIN RBAC POLICIES (Super Admin, Manager, Inventory, Support)
-- ============================================================================

-- Super Admins and Staff full access on Catalog tables
CREATE POLICY "Staff manage categories"
ON categories FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage brands"
ON brands FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage collections"
ON collections FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage products"
ON products FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage variants"
ON product_variants FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage product images"
ON product_images FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage product collections"
ON product_collections FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage inventory batches"
ON inventory_batches FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage stock movements"
ON stock_movements FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage suppliers"
ON suppliers FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage purchase orders"
ON purchase_orders FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage customers"
ON customers FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage customer addresses"
ON addresses FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage orders"
ON orders FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage order items"
ON order_items FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage order history"
ON order_status_history FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage shipments"
ON shipments FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage payments"
ON payments FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage returns"
ON returns FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage return items"
ON return_items FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage refunds"
ON refunds FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage coupons"
ON coupons FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage coupon usages"
ON coupon_usages FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage banners"
ON banners FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage pages"
ON pages FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage reviews"
ON reviews FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage tickets"
ON tickets FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage ticket messages"
ON ticket_messages FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage scratch batches"
ON scratch_batches FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff manage scratch codes"
ON scratch_codes FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff view audit logs"
ON audit_logs FOR SELECT
USING (is_active_staff());

CREATE POLICY "Staff insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (is_active_staff());

CREATE POLICY "Staff manage settings"
ON settings FOR ALL
USING (is_active_staff());

CREATE POLICY "Staff view notifications"
ON notifications FOR ALL
USING (is_active_staff());

CREATE POLICY "Super admin manage staff"
ON staff_profiles FOR ALL
USING (is_super_admin() OR auth.uid() = auth_user_id);

CREATE POLICY "Staff view roles permissions"
ON roles_permissions FOR SELECT
USING (is_active_staff());
