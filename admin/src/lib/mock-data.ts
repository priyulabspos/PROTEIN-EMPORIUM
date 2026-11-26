// ============================================================================
// PROTEIN EMPORIUM ADMIN - Realistic Indian Sports Nutrition Seed Data
// ============================================================================

import { 
  StaffProfile, Category, Brand, Collection, Product, 
  Order, InventoryBatch, Coupon, ScratchCode, AuditLog, NotificationItem 
} from './types';

export const INITIAL_STAFF: StaffProfile[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@proteinemporium.com',
    full_name: 'Vikramaditya Singhania',
    phone: '+91 98765 43210',
    role: 'SUPER_ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    is_active: true,
    two_factor_enabled: false,
    failed_login_attempts: 0,
    last_sign_in_at: '2026-11-26T18:30:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    email: 'manager@proteinemporium.com',
    full_name: 'Anita Desai',
    phone: '+91 98223 11223',
    role: 'MANAGER',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    is_active: true,
    two_factor_enabled: true,
    failed_login_attempts: 0,
    last_sign_in_at: '2026-11-26T14:15:00Z',
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    email: 'inventory@proteinemporium.com',
    full_name: 'Ramesh Kumar',
    phone: '+91 98111 22334',
    role: 'INVENTORY_STAFF',
    is_active: true,
    two_factor_enabled: false,
    failed_login_attempts: 0,
    last_sign_in_at: '2026-11-26T10:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    email: 'support@proteinemporium.com',
    full_name: 'Pooja Sharma',
    phone: '+91 98444 55667',
    role: 'SUPPORT_STAFF',
    is_active: true,
    two_factor_enabled: false,
    failed_login_attempts: 0,
    last_sign_in_at: '2026-11-26T16:45:00Z',
    created_at: '2026-04-10T00:00:00Z',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    email: 'editor@proteinemporium.com',
    full_name: 'Amit Roy',
    phone: '+91 98555 66778',
    role: 'CONTENT_EDITOR',
    is_active: true,
    two_factor_enabled: false,
    failed_login_attempts: 0,
    last_sign_in_at: '2026-11-25T11:20:00Z',
    created_at: '2026-05-01T00:00:00Z',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Whey Protein', slug: 'whey-protein', sort_order: 1, description: 'Concentrate, isolate, and hydrolyzed whey proteins.', image_url: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=400&q=80', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Creatine', slug: 'creatine', sort_order: 2, description: 'German Creapure & micronized creatine monohydrate.', image_url: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=400&q=80', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 3, name: 'Pre-Workout', slug: 'pre-workout', sort_order: 3, description: 'High-stim, nitric oxide pump and clean focus formulas.', image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 4, name: 'BCAA & Aminos', slug: 'bcaa-aminos', sort_order: 4, description: 'Full-spectrum EAAs and fermented BCAAs.', image_url: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&q=80', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 5, name: 'Mass Gainers', slug: 'mass-gainers', sort_order: 5, description: 'Clean complex carbs and high-calorie gainers.', image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=80', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 6, name: 'Vitamins & Health', slug: 'vitamins-health', sort_order: 6, description: 'Omega-3 Fish Oil, Multivitamins, Ashwagandha KSM-66.', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 7, name: 'Health Food', slug: 'health-food', sort_order: 7, description: 'Natural roasted peanut butters, dark chocolate whey butter & oats.', image_url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=400&q=80', is_active: true, created_at: '2026-01-01T00:00:00Z' }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 1, name: 'Optimum Nutrition', slug: 'optimum-nutrition', description: 'World #1 Whey Protein Brand by Glanbia.', is_featured: true, is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Dymatize', slug: 'dymatize', description: 'Pioneers of ISO 100 Hydrolyzed 100% Whey Isolate.', is_featured: true, is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 3, name: 'MuscleBlaze', slug: 'muscleblaze', description: 'India leading sports nutrition with Biozyme formula.', is_featured: true, is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 4, name: 'GNC Live Well', slug: 'gnc', description: 'Global leader in health, wellness and sports performance.', is_featured: true, is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 5, name: 'Emporium Labs', slug: 'emporium-labs', description: 'In-house certified pure lab-tested sports supplements.', is_featured: true, is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 6, name: 'GreenFuel', slug: 'greenfuel', description: '100% plant-based organic sports nutrition.', is_featured: false, is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 7, name: 'IronCore', slug: 'ironcore', description: 'Hardcore unadulterated bodybuilding compounds.', is_featured: false, is_active: true, created_at: '2026-01-01T00:00:00Z' }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  { id: 1, name: 'Build Lean Muscle', slug: 'build-muscle', description: 'High-protein whey isolates, hydrolysates & pure creatine.', sort_order: 1, is_active: true },
  { id: 2, name: 'Boost Energy & Focus', slug: 'boost-energy', description: 'Explosive pre-workouts, caffeine & citrulline for the gym.', sort_order: 2, is_active: true },
  { id: 3, name: 'Heavy Mass Gaining', slug: 'mass-gaining', description: 'High-calorie complex carbohydrates & multi-source protein blends.', sort_order: 3, is_active: true },
  { id: 4, name: 'Daily Health & Vitality', slug: 'daily-health', description: 'Triple Strength Omega-3, Multivitamins & Ashwagandha.', sort_order: 4, is_active: true }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    slug: 'on-gold-standard-100-whey',
    brand_id: 1,
    category_id: 1,
    short_description: '24g whey protein blend with 5.5g naturally occurring BCAAs.',
    description: 'Optimum Nutrition Gold Standard 100% Whey is the world standard for purity. Contains whey protein isolates as the primary ingredient.',
    key_benefits: ['24g Pure Protein per scoop', '5.5g naturally occurring BCAAs', '4g Glutamine & Glutamic Acid', 'Informed-Choice Certified'],
    serving_size: '30.4 g (1 Scoop)',
    protein_per_serving: '24 g',
    bcaa_per_serving: '5.5 g',
    is_veg: true,
    fssai_license: '10021064000123',
    status: 'PUBLISHED',
    is_featured: true,
    is_bestseller: true,
    is_new_launch: false,
    tags: ['Whey', 'Post-workout', 'Lean Muscle'],
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-11-20T00:00:00Z',
    variants: [
      { id: 101, product_id: 1, size: '1 kg (2.2 lb)', flavor: 'Double Rich Chocolate', sku: 'ON-GS-1KG-DRC', barcode: '890123456001', mrp: 4999, selling_price: 3349, cost_price: 2400, gst_rate: 18, weight_grams: 1000, stock_quantity: 48, low_stock_threshold: 10, is_active: true },
      { id: 102, product_id: 1, size: '2 kg (4.4 lb)', flavor: 'Double Rich Chocolate', sku: 'ON-GS-2KG-DRC', barcode: '890123456002', mrp: 8499, selling_price: 5999, cost_price: 4300, gst_rate: 18, weight_grams: 2000, stock_quantity: 24, low_stock_threshold: 5, is_active: true },
      { id: 103, product_id: 1, size: '1 kg (2.2 lb)', flavor: 'Café Mocha', sku: 'ON-GS-1KG-CFM', barcode: '890123456003', mrp: 4999, selling_price: 3349, cost_price: 2400, gst_rate: 18, weight_grams: 1000, stock_quantity: 18, low_stock_threshold: 5, is_active: true }
    ],
    images: [
      { id: 1, product_id: 1, image_url: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=600&q=80', alt_text: 'Gold Standard Tub', is_primary: true, sort_order: 0 }
    ]
  },
  {
    id: 2,
    name: 'Dymatize ISO 100 Hydrolyzed 100% Whey Isolate',
    slug: 'dymatize-iso-100-hydrolyzed',
    brand_id: 2,
    category_id: 1,
    short_description: 'Hydrolyzed 100% whey protein isolate with zero sugar.',
    description: 'Dymatize ISO 100 is formulated with hydrolyzed whey isolate for rapid digestion, low lactose, and immediate post-workout amino uptake.',
    key_benefits: ['25g Hydrolyzed Whey Isolate', '<1g Sugar and Carbohydrates', '5.7g BCAAs with 2.7g Leucine', 'Gluten Free'],
    serving_size: '30 g',
    protein_per_serving: '25 g',
    bcaa_per_serving: '5.7 g',
    is_veg: true,
    status: 'PUBLISHED',
    is_featured: true,
    is_bestseller: true,
    is_new_launch: false,
    tags: ['Isolate', 'Hydrolyzed', 'Zero Sugar'],
    created_at: '2026-01-12T00:00:00Z',
    updated_at: '2026-11-22T00:00:00Z',
    variants: [
      { id: 201, product_id: 2, size: '1 kg (2.2 lb)', flavor: 'Gourmet Chocolate', sku: 'DYM-ISO-1KG-GCH', barcode: '890123456011', mrp: 5499, selling_price: 3899, cost_price: 2800, gst_rate: 18, weight_grams: 1000, stock_quantity: 32, low_stock_threshold: 8, is_active: true },
      { id: 202, product_id: 2, size: '2.3 kg (5 lb)', flavor: 'Fudge Brownie', sku: 'DYM-ISO-5LB-FBR', barcode: '890123456012', mrp: 11999, selling_price: 8499, cost_price: 6100, gst_rate: 18, weight_grams: 2300, stock_quantity: 14, low_stock_threshold: 4, is_active: true }
    ],
    images: [
      { id: 2, product_id: 2, image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80', alt_text: 'Dymatize ISO 100 Tub', is_primary: true, sort_order: 0 }
    ]
  },
  {
    id: 3,
    name: 'MuscleBlaze Biozyme Performance Whey',
    slug: 'muscleblaze-biozyme-performance-whey',
    brand_id: 3,
    category_id: 1,
    short_description: 'Enhanced Absorption Formula with 50% higher protein uptake.',
    description: 'Clinically tested on Indian bodies. Features patented digestive enzymes to eradicate bloating and maximize leucine utilization.',
    key_benefits: ['25g Protein per serving', '50% Higher Protein Absorption', 'Certified by Informed-Choice UK', 'Zero Bloat Formula'],
    serving_size: '36 g',
    protein_per_serving: '25 g',
    bcaa_per_serving: '5.5 g',
    is_veg: true,
    status: 'PUBLISHED',
    is_featured: true,
    is_bestseller: true,
    is_new_launch: false,
    tags: ['Biozyme', 'Indian Athletes', 'High Absorption'],
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-11-20T00:00:00Z',
    variants: [
      { id: 301, product_id: 3, size: '1 kg (2.2 lb)', flavor: 'Rich Chocolate', sku: 'MB-BIO-1KG-RCH', barcode: '890123456021', mrp: 3499, selling_price: 2499, cost_price: 1750, gst_rate: 18, weight_grams: 1000, stock_quantity: 65, low_stock_threshold: 12, is_active: true },
      { id: 302, product_id: 3, size: '2 kg (4.4 lb)', flavor: 'Magical Mango', sku: 'MB-BIO-2KG-MMG', barcode: '890123456022', mrp: 6299, selling_price: 4499, cost_price: 3100, gst_rate: 18, weight_grams: 2000, stock_quantity: 28, low_stock_threshold: 6, is_active: true }
    ],
    images: [
      { id: 3, product_id: 3, image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80', alt_text: 'MuscleBlaze Biozyme Tub', is_primary: true, sort_order: 0 }
    ]
  },
  {
    id: 4,
    name: 'Emporium Labs 100% Creapure® Creatine Monohydrate',
    slug: 'emporium-labs-creapure-creatine',
    brand_id: 5,
    category_id: 2,
    short_description: 'Made in Germany. 99.99% pure micronized creatine.',
    description: 'Produced in Germany by Alzchem Trostberg. 200-mesh micro-pulverized powder dissolves instantly without gastrointestinal discomfort.',
    key_benefits: ['100% Creapure German Origin', 'Zero Water Retention Bloat', 'Rapid ATP Cellular Energy', 'Unadulterated Raw Powder'],
    serving_size: '3 g',
    protein_per_serving: '0 g',
    is_veg: true,
    status: 'PUBLISHED',
    is_featured: true,
    is_bestseller: true,
    is_new_launch: false,
    tags: ['Creapure', 'Strength', 'Power'],
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-11-25T00:00:00Z',
    variants: [
      { id: 401, product_id: 4, size: '250 g', flavor: 'Unflavoured', sku: 'EMP-CREA-250G', barcode: '890123456031', mrp: 1699, selling_price: 1199, cost_price: 750, gst_rate: 18, weight_grams: 250, stock_quantity: 85, low_stock_threshold: 15, is_active: true },
      { id: 402, product_id: 4, size: '500 g', flavor: 'Unflavoured', sku: 'EMP-CREA-500G', barcode: '890123456032', mrp: 2999, selling_price: 2099, cost_price: 1300, gst_rate: 18, weight_grams: 500, stock_quantity: 40, low_stock_threshold: 10, is_active: true }
    ],
    images: [
      { id: 4, product_id: 4, image_url: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=600&q=80', alt_text: 'Creapure Creatine Jar', is_primary: true, sort_order: 0 }
    ]
  },
  {
    id: 5,
    name: 'Cellucor C4 Original Explosive Pre-Workout',
    slug: 'cellucor-c4-original-pre-workout',
    brand_id: 1,
    category_id: 3,
    short_description: 'CarnoSyn Beta-Alanine and 150mg caffeine for explosive gym energy.',
    description: 'America #1 selling pre-workout with clinically studied CarnoSyn Beta-Alanine, TeaCrine, and Arginine AKG for skin-tearing muscular pumps.',
    key_benefits: ['150mg PurCaf Organic Caffeine', '1.6g CarnoSyn Beta-Alanine', '1g Creatine Nitrate', 'Zero Sugar'],
    serving_size: '6.5 g',
    is_veg: true,
    status: 'PUBLISHED',
    is_featured: true,
    is_bestseller: true,
    is_new_launch: false,
    tags: ['Pre-workout', 'High Energy', 'Pumps'],
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-11-20T00:00:00Z',
    variants: [
      { id: 501, product_id: 5, size: '390 g (60 Servings)', flavor: 'Icy Blue Razz', sku: 'C4-PRE-60SRV-IBR', barcode: '890123456041', mrp: 2799, selling_price: 1999, cost_price: 1350, gst_rate: 18, weight_grams: 390, stock_quantity: 42, low_stock_threshold: 8, is_active: true }
    ],
    images: [
      { id: 5, product_id: 5, image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80', alt_text: 'Cellucor C4 Tub', is_primary: true, sort_order: 0 }
    ]
  },
  {
    id: 6,
    name: 'Triple Strength Omega-3 Fish Oil (1000mg EPA/DHA)',
    slug: 'triple-strength-omega-3-fish-oil',
    brand_id: 5,
    category_id: 6,
    short_description: '550mg EPA and 450mg DHA per enteric softgel. Mercury-free.',
    description: 'Molecularly distilled deep-sea coldwater fish oil. Enteric coating ensures bypass of gastric acid for zero fishy burps.',
    key_benefits: ['1000mg Active EPA+DHA', 'Molecularly Distilled Mercury Free', 'Enteric Coated (Zero Burps)', 'Promotes Joint and Heart Health'],
    serving_size: '1 Softgel',
    is_veg: false,
    status: 'PUBLISHED',
    is_featured: true,
    is_bestseller: true,
    is_new_launch: false,
    tags: ['Omega 3', 'Fish Oil', 'Joint Health'],
    created_at: '2026-03-15T00:00:00Z',
    updated_at: '2026-11-24T00:00:00Z',
    variants: [
      { id: 601, product_id: 6, size: '60 Softgels', flavor: 'Lemon Coated', sku: 'EMP-OMG3-60CAP', barcode: '890123456051', mrp: 1199, selling_price: 799, cost_price: 420, gst_rate: 18, weight_grams: 120, stock_quantity: 110, low_stock_threshold: 20, is_active: true }
    ],
    images: [
      { id: 6, product_id: 6, image_url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80', alt_text: 'Omega 3 Softgels Bottle', is_primary: true, sort_order: 0 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1,
    order_number: 'PE-88219',
    customer_id: 'c0000000-0000-0000-0000-000000000001',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.sharma@gmail.com',
    customer_phone: '+91 98112 23344',
    status: 'SHIPPED',
    payment_status: 'PAID',
    payment_method: 'UPI',
    subtotal: 4548,
    discount_amount: 227,
    shipping_fee: 0,
    tax_amount: 659,
    total_amount: 4321,
    coupon_code: 'PROTEIN5',
    shipping_address: {
      name: 'Rahul Sharma',
      phone: '9811223344',
      address: 'Flat 402, Green Avenue, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017'
    },
    created_at: '2026-11-24T10:30:00Z',
    updated_at: '2026-11-25T14:20:00Z',
    items: [
      { id: 1, order_id: 1, product_id: 1, variant_id: 101, product_name: 'Optimum Nutrition Gold Standard 100% Whey', variant_name: '1 kg • Double Rich Chocolate', sku: 'ON-GS-1KG-DRC', unit_price: 3349, mrp: 4999, quantity: 1, total_price: 3349 },
      { id: 2, order_id: 1, product_id: 4, variant_id: 401, product_name: 'Emporium Labs 100% Creapure® Creatine Monohydrate', variant_name: '250 g • Unflavoured', sku: 'EMP-CREA-250G', unit_price: 1199, mrp: 1699, quantity: 1, total_price: 1199 }
    ],
    shipment: {
      id: 1,
      order_id: 1,
      courier_name: 'BlueDart Express',
      awb_number: 'BD772910482IN',
      tracking_url: 'https://www.bluedart.com/tracking?awb=BD772910482IN',
      shipment_status: 'IN_TRANSIT',
      shipping_rate: 65,
      dispatched_at: '2026-11-25T14:20:00Z'
    }
  },
  {
    id: 2,
    order_number: 'PE-88220',
    customer_id: 'c0000000-0000-0000-0000-000000000002',
    customer_name: 'Priya Patel',
    customer_email: 'priya.patel@yahoo.com',
    customer_phone: '+91 98223 34455',
    status: 'DELIVERED',
    payment_status: 'PAID',
    payment_method: 'CARD',
    subtotal: 1199,
    discount_amount: 0,
    shipping_fee: 0,
    tax_amount: 182,
    total_amount: 1199,
    shipping_address: {
      name: 'Priya Patel',
      phone: '9822334455',
      address: '14 Link Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050'
    },
    created_at: '2026-11-22T16:00:00Z',
    updated_at: '2026-11-24T18:00:00Z',
    items: [
      { id: 3, order_id: 2, product_id: 4, variant_id: 401, product_name: 'Emporium Labs 100% Creapure® Creatine Monohydrate', variant_name: '250 g • Unflavoured', sku: 'EMP-CREA-250G', unit_price: 1199, mrp: 1699, quantity: 1, total_price: 1199 }
    ]
  },
  {
    id: 3,
    order_number: 'PE-88221',
    customer_id: 'c0000000-0000-0000-0000-000000000003',
    customer_name: 'Amit Verma',
    customer_email: 'amit.verma@outlook.com',
    customer_phone: '+91 98334 45566',
    status: 'CONFIRMED',
    payment_status: 'PENDING',
    payment_method: 'COD',
    subtotal: 2499,
    discount_amount: 0,
    shipping_fee: 0,
    tax_amount: 381,
    total_amount: 2499,
    shipping_address: {
      name: 'Amit Verma',
      phone: '9833445566',
      address: '7th Main, 100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    created_at: '2026-11-26T09:15:00Z',
    updated_at: '2026-11-26T09:20:00Z',
    items: [
      { id: 4, order_id: 3, product_id: 3, variant_id: 301, product_name: 'MuscleBlaze Biozyme Performance Whey', variant_name: '1 kg • Rich Chocolate', sku: 'MB-BIO-1KG-RCH', unit_price: 2499, mrp: 3499, quantity: 1, total_price: 2499 }
    ]
  }
];

export const INITIAL_BATCHES: InventoryBatch[] = [
  { id: 1, variant_id: 101, batch_number: 'GPN-26-081', mfg_date: '2026-08-15', expiry_date: '2028-08-14', initial_quantity: 60, current_quantity: 48, product_name: 'Optimum Nutrition Gold Standard 100% Whey (1 kg)', variant_sku: 'ON-GS-1KG-DRC', created_at: '2026-08-20T00:00:00Z' },
  { id: 2, variant_id: 201, batch_number: 'DYM-26-104', mfg_date: '2026-09-01', expiry_date: '2028-08-31', initial_quantity: 40, current_quantity: 32, product_name: 'Dymatize ISO 100 (1 kg)', variant_sku: 'DYM-ISO-1KG-GCH', created_at: '2026-09-05T00:00:00Z' },
  { id: 3, variant_id: 401, batch_number: 'ALZ-26-219', mfg_date: '2026-10-10', expiry_date: '2029-10-09', initial_quantity: 100, current_quantity: 85, product_name: 'Creapure Creatine (250 g)', variant_sku: 'EMP-CREA-250G', created_at: '2026-10-15T00:00:00Z' }
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 1, code: 'PROTEIN5', description: 'Extra 5% OFF on all supplements for welcome athletes', type: 'PERCENTAGE', value: 5, max_discount: 250, min_order_amount: 0, usage_count: 142, is_first_order_only: false, starts_at: '2026-01-01T00:00:00Z', is_active: true },
  { id: 2, code: 'FIRST10', description: '10% OFF on your very first order', type: 'PERCENTAGE', value: 10, max_discount: 500, min_order_amount: 999, usage_count: 89, is_first_order_only: true, starts_at: '2026-01-01T00:00:00Z', is_active: true }
];

export const INITIAL_SCRATCH_CODES: ScratchCode[] = [
  { id: 1, batch_id: 1, code: 'PE-8842-9901', status: 'UNUSED', verification_count: 0, batch: { batch_code: 'GPN-IN-889104', product_name: 'Optimum Nutrition Gold Standard 100% Whey', mfg_date: '2026-10-01', expiry_date: '2028-09-30', protein_content_percent: 81.40 } },
  { id: 2, batch_id: 1, code: 'PE-9901-4432', status: 'UNUSED', verification_count: 0, batch: { batch_code: 'GPN-IN-889104', product_name: 'Optimum Nutrition Gold Standard 100% Whey', mfg_date: '2026-10-01', expiry_date: '2028-09-30', protein_content_percent: 81.40 } },
  { id: 3, batch_id: 1, code: 'PE-1142-7788', status: 'VERIFIED', verification_count: 1, first_verified_at: '2026-11-26T12:00:00Z', last_verified_at: '2026-11-26T12:00:00Z', batch: { batch_code: 'GPN-IN-889104', product_name: 'Optimum Nutrition Gold Standard 100% Whey', mfg_date: '2026-10-01', expiry_date: '2028-09-30', protein_content_percent: 81.40 } }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 1, staff_id: 'a0000000-0000-0000-0000-000000000001', staff_email: 'admin@proteinemporium.com', role: 'SUPER_ADMIN', action: 'STATUS_CHANGE', module: 'ORDERS', entity_id: 'PE-88219', entity_name: 'Order PE-88219', old_data: { status: 'PACKED' }, new_data: { status: 'SHIPPED', awb: 'BD772910482IN' }, created_at: '2026-11-25T14:20:00Z' },
  { id: 2, staff_id: 'a0000000-0000-0000-0000-000000000003', staff_email: 'inventory@proteinemporium.com', role: 'INVENTORY_STAFF', action: 'CREATE', module: 'INVENTORY', entity_id: 'ALZ-26-219', entity_name: 'Creapure Batch ALZ-26-219', new_data: { qty: 100, mfg: '2026-10-10' }, created_at: '2026-10-15T11:00:00Z' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, type: 'ORDER_PLACED', title: 'New COD Order PE-88221', message: 'Amit Verma placed order ₹2,499 in Bengaluru.', link: '/orders', is_read: false, created_at: '2026-11-26T09:15:00Z' },
  { id: 2, type: 'LOW_STOCK', title: 'Low Stock Alert: Dymatize ISO 5lb', message: 'Stock has fallen to 14 units (Threshold: 4).', link: '/inventory', is_read: false, created_at: '2026-11-25T18:00:00Z' },
  { id: 3, type: 'EXPIRY_WARNING', title: 'Batch Inspection Notice', message: 'Batch GPN-26-081 passes 3 months milestone. Quality verified.', link: '/inventory', is_read: true, created_at: '2026-11-24T12:00:00Z' }
];

export const INITIAL_RETURNS: any[] = [
  {
    id: 1,
    return_number: 'RET-1092',
    order_id: 2,
    order_number: 'PE-88220',
    customer_name: 'Priya Patel',
    customer_phone: '+91 98223 34455',
    customer_email: 'priya.patel@yahoo.com',
    product_name: 'Emporium Labs 100% Creapure® Creatine Monohydrate',
    variant_name: '250 g • Unflavoured',
    quantity: 1,
    item_price: 1199,
    reason: 'DEFECTIVE_SEAL',
    customer_notes: 'Outer plastic seal was loose upon opening the parcel box. Want replacement or refund.',
    image_urls: ['https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=400&q=80'],
    status: 'REQUESTED',
    qc_status: 'PENDING',
    refund_mode: 'ORIGINAL_PAYMENT',
    refund_amount: 1199,
    created_at: '2026-11-25T10:30:00Z',
    updated_at: '2026-11-25T10:30:00Z'
  },
  {
    id: 2,
    return_number: 'RET-1091',
    order_id: 1,
    order_number: 'PE-88219',
    customer_name: 'Rahul Sharma',
    customer_phone: '+91 98765 43210',
    customer_email: 'rahul.fitness@gmail.com',
    product_name: 'Optimum Nutrition Gold Standard 100% Whey',
    variant_name: '1 kg • Double Rich Chocolate',
    quantity: 1,
    item_price: 3349,
    reason: 'DAMAGED_IN_TRANSIT',
    customer_notes: 'Jar bottom was cracked during shipping. Protein spilled inside the bubble bag.',
    image_urls: ['https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=400&q=80'],
    status: 'QC_PASSED',
    qc_status: 'DAMAGED_PACK',
    refund_mode: 'ORIGINAL_PAYMENT',
    refund_amount: 3349,
    razorpay_refund_id: 'rfnd_NzpX992LKa',
    restock_choice: 'MARK_DAMAGED',
    created_at: '2026-11-24T14:15:00Z',
    updated_at: '2026-11-25T11:00:00Z'
  }
];

export const INITIAL_PAYMENTS: any[] = [
  {
    id: 1,
    transaction_id: 'pay_Nzo981LKa091',
    order_number: 'PE-88219',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.fitness@gmail.com',
    amount: 3349,
    gateway_fee: 66.98,
    tax_on_fee: 12.06,
    net_amount: 3269.96,
    payment_method: 'UPI',
    status: 'CAPTURED',
    settlement_status: 'SETTLED',
    bank_rrn: '433290192831',
    upi_vpa: 'rahul@okhdfcbank',
    created_at: '2026-11-25T11:42:00Z'
  },
  {
    id: 2,
    transaction_id: 'pay_Nzk881LMb102',
    order_number: 'PE-88220',
    customer_name: 'Priya Patel',
    customer_email: 'priya.patel@yahoo.com',
    amount: 1199,
    gateway_fee: 23.98,
    tax_on_fee: 4.32,
    net_amount: 1170.70,
    payment_method: 'CREDIT_CARD',
    status: 'CAPTURED',
    settlement_status: 'SETTLED',
    bank_rrn: '433100291044',
    created_at: '2026-11-22T16:00:00Z'
  },
  {
    id: 3,
    transaction_id: 'pay_Nzf771LKc993',
    order_number: 'PE-88218',
    customer_name: 'Suresh Raina',
    customer_email: 'suresh.r@gmail.com',
    amount: 5499,
    gateway_fee: 0,
    tax_on_fee: 0,
    net_amount: 0,
    payment_method: 'UPI',
    status: 'FAILED',
    settlement_status: 'PENDING',
    bank_rrn: '',
    created_at: '2026-11-21T18:22:00Z'
  }
];

export const INITIAL_REVIEWS: any[] = [
  {
    id: 1,
    product_id: 1,
    product_name: 'Optimum Nutrition Gold Standard 100% Whey',
    customer_name: 'Varun Grover',
    rating: 5,
    title: '100% genuine batch! Checked scratch code on website',
    comment: 'Scratched the code on the seal, entered it on the site and verified the Glanbia import code instantly. Super quick delivery to Delhi!',
    is_verified_buyer: true,
    status: 'APPROVED',
    is_featured: true,
    admin_reply: 'Thank you Varun! We source every ON tub straight from official Glanbia India distributors.',
    created_at: '2026-11-24T16:30:00Z'
  },
  {
    id: 2,
    product_id: 2,
    product_name: 'Dymatize ISO 100 Hydrolyzed Whey Protein',
    customer_name: 'Karan Mehra',
    rating: 5,
    title: 'Flavour is unmatched - Gourmet Chocolate',
    comment: 'Dissolves cleanly without any lumps in cold water. Best isolate on the market for cutting.',
    is_verified_buyer: true,
    status: 'APPROVED',
    is_featured: true,
    created_at: '2026-11-23T11:00:00Z'
  },
  {
    id: 3,
    product_id: 4,
    product_name: 'Emporium Labs 100% Creapure® Creatine Monohydrate',
    customer_name: 'Manish Rawat',
    rating: 4,
    title: 'Authentic German Creapure',
    comment: 'Great solubility and no stomach upset. Delivery took 4 days to Pune, packaging was great.',
    is_verified_buyer: true,
    status: 'PENDING',
    is_featured: false,
    created_at: '2026-11-26T08:15:00Z'
  }
];

export const INITIAL_TICKETS: any[] = [
  {
    id: 1,
    ticket_number: 'TKT-4401',
    customer_name: 'Rahul Sharma',
    customer_email: 'rahul.fitness@gmail.com',
    customer_phone: '+91 98765 43210',
    subject: 'Damaged ON 1kg tub received during courier transit',
    order_number: 'PE-88219',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assigned_to: 'Pooja Sharma',
    created_at: '2026-11-25T14:30:00Z',
    updated_at: '2026-11-25T16:00:00Z',
    messages: [
      { id: 1, sender_name: 'Rahul Sharma', is_staff: false, message: 'Hi team, I received order PE-88219 today but the courier delivery boy dropped the package. The bottom seal is cracked and powder is leaking out.', created_at: '2026-11-25T14:30:00Z' },
      { id: 2, sender_name: 'Pooja Sharma (Support)', is_staff: true, message: 'Hello Rahul, extremely sorry about the transit damage. We have initiated a replacement order immediately and arranged reverse pickup.', created_at: '2026-11-25T16:00:00Z' }
    ]
  },
  {
    id: 2,
    ticket_number: 'TKT-4402',
    customer_name: 'Anand Kulkarni',
    customer_email: 'anand.k@gmail.com',
    customer_phone: '+91 99887 66554',
    subject: 'Scratch code verification guidance',
    priority: 'LOW',
    status: 'OPEN',
    assigned_to: 'Pooja Sharma',
    created_at: '2026-11-26T10:15:00Z',
    updated_at: '2026-11-26T10:15:00Z',
    messages: [
      { id: 1, sender_name: 'Anand Kulkarni', is_staff: false, message: 'Where do I find the scratch code on my MuscleBlaze Biozyme tub?', created_at: '2026-11-26T10:15:00Z' }
    ]
  }
];

export const INITIAL_BANNERS: any[] = [
  {
    id: 1,
    title: '100% Genuine Certified Nutrition',
    subtitle: 'Sourced directly from authorized brand importers with lab certificates and tamper-proof scratch verification.',
    badge_text: 'AUTHENTICITY GUARANTEE',
    image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Shop Authentic Whey',
    cta_link: '/products',
    sort_order: 1,
    is_active: true
  },
  {
    id: 2,
    title: 'Flat 5% OFF on Welcome Orders',
    subtitle: 'Use coupon code PROTEIN5 at checkout. Free express shipping across India on orders over ₹499.',
    badge_text: 'LIMITED TIME DEAL',
    image_url: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Claim Coupon',
    cta_link: '/coupons',
    sort_order: 2,
    is_active: true
  }
];

export const INITIAL_POLICIES: any[] = [
  {
    id: 1,
    title: 'Authenticity & Genuine Guarantee',
    slug: 'authenticity-guarantee',
    last_updated: '2026-11-01',
    content: 'Every product sold on Protein Emporium carries a genuine scratch-off holographic verification code. Sourced directly from brand brand-authorized importers (Glanbia, Bright Commodities, MuscleBlaze, MuscleTech). Never from grey market third-party intermediaries.'
  },
  {
    id: 2,
    title: 'Shipping & Delivery Policy',
    slug: 'shipping-policy',
    last_updated: '2026-11-01',
    content: 'Free courier shipping across all major Indian pincodes on orders above ₹499. Orders confirmed before 2:00 PM IST are dispatched same-day via BlueDart Express or Delhivery Air. Metro deliveries in 24-48 hours.'
  },
  {
    id: 3,
    title: '7-Day Return & Replacement Policy',
    slug: 'returns-policy',
    last_updated: '2026-11-01',
    content: 'Returns and replacements are accepted within 7 days of delivery for damaged shipments, seal tampering, or wrong products delivered. Due to food safety and FSSAI standards, opened or unsealed supplement containers cannot be returned for taste preferences.'
  }
];

export const INITIAL_ABANDONED_CARTS: any[] = [
  {
    id: 1,
    customer_name: 'Deepak Joshi',
    customer_phone: '+91 98199 88776',
    items_count: 2,
    cart_value: 4548,
    items_summary: 'ON Gold Standard 1kg + Creapure 250g',
    abandoned_at: '2026-11-26T15:20:00Z',
    recovery_status: 'PENDING'
  },
  {
    id: 2,
    customer_name: 'Simran Kaur',
    customer_phone: '+91 98777 66554',
    items_count: 1,
    cart_value: 3999,
    items_summary: 'Dymatize ISO 100 1kg Gourmet Chocolate',
    abandoned_at: '2026-11-25T19:40:00Z',
    recovery_status: 'SENT'
  }
];

export const INITIAL_SETTINGS: any = {
  store_name: 'Protein Emporium',
  legal_name: 'Protein Emporium Nutrition Pvt Ltd',
  gstin: '07AABCP1234F1Z5',
  fssai_number: '10021064000123',
  support_email: 'care@proteinemporium.com',
  support_phone: '+91 98765 43210',
  warehouse_address: 'Plot 44, Okhla Industrial Area Phase III, New Delhi 110020',
  free_shipping_threshold: 499,
  standard_shipping_fee: 50,
  razorpay_key_id: 'rzp_test_PE10928374',
  razorpay_key_secret: '••••••••••••••••••••••••',
  razorpay_mode: 'TEST',
  shiprocket_email: 'logistics@proteinemporium.com',
  shiprocket_token: '••••••••••••••••••••••••',
  return_window_days: 7
};
