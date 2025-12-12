-- Migration for cart_items
ALTER TABLE cart_items 
ADD COLUMN variant VARCHAR(20) NOT NULL DEFAULT 'single' 
CHECK (variant IN ('single', 'box'));

-- Migration for order_items
ALTER TABLE order_items 
ADD COLUMN variant VARCHAR(20) NOT NULL DEFAULT 'single' 
CHECK (variant IN ('single', 'box'));