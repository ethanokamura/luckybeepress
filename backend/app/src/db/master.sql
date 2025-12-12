-- Core business entities
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    tax_id VARCHAR(50), -- EIN or similar for wholesale
    account_status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
    net_terms INTEGER DEFAULT 0, -- net 30, net 60, etc.
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    first_order_date TIMESTAMP,
    total_orders INTEGER DEFAULT 0,
    lifetime_value DECIMAL(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID REFERENCES customers (id) ON DELETE CASCADE,
    address_type VARCHAR(50) NOT NULL, -- shipping, billing, both
    is_default BOOLEAN DEFAULT false,
    company_name VARCHAR(255),
    street_address_1 VARCHAR(255) NOT NULL,
    street_address_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'United States of America',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Product catalog
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- birthday, love, valentine, etc.
    wholesale_price DECIMAL(10, 2) NOT NULL, -- WSP
    suggested_retail_price DECIMAL(10, 2), -- SRP
    cost DECIMAL(10, 2), -- your cost to produce
    is_active BOOLEAN DEFAULT true,
    minimum_order_quantity INTEGER DEFAULT 1,
    has_box BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    image_url VARCHAR(500),
    weight_oz DECIMAL(8, 2), -- for shipping calculations
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Shopping cart for wholesale customers
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID REFERENCES customers (id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'active', -- active, abandoned, converted
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (customer_id, status) -- one active cart per customer
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    cart_id UUID REFERENCES carts (id) ON DELETE CASCADE,
    product_id UUID REFERENCES products (id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    variant VARCHAR(20) NOT NULL DEFAULT 'single' CHECK (variant IN ('single', 'box')),
    unit_price DECIMAL(10, 2) NOT NULL, -- locked price at time of adding
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (cart_id, product_id, variant)
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- like EK2REBD5WK
    customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,

    -- Addresses (denormalized for historical record)
    shipping_company_name VARCHAR(255),
    shipping_address_1 VARCHAR(255) NOT NULL,
    shipping_address_2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    shipping_phone VARCHAR(50),
    billing_company_name VARCHAR(255),
    billing_address_1 VARCHAR(255),
    billing_address_2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),

    -- Order details
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Status and dates
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid, partial, overdue
    payment_method VARCHAR(50), -- net_terms, credit_card, wire_transfer
    payment_due_date DATE,
    order_date TIMESTAMP NOT NULL,
    ship_date TIMESTAMP,
    delivery_date TIMESTAMP,
    cancelled_date TIMESTAMP,

    -- Tracking and notes
tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    internal_notes TEXT,
    customer_notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,

    -- Product details (denormalized for historical record)
    sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant VARCHAR(20) NOT NULL DEFAULT 'single' CHECK (variant IN ('single', 'box')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_wholesale_price DECIMAL(10, 2) NOT NULL,
    unit_retail_price DECIMAL(10, 2), -- SRP for reference
    subtotal DECIMAL(10, 2) NOT NULL,

    -- Status for partial fulfillment
    status VARCHAR(50) DEFAULT 'pending', -- pending, fulfilled, damaged, missing, returned
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
