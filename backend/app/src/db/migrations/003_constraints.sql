BEGIN;

ALTER TABLE cart_items 
DROP CONSTRAINT cart_items_cart_id_product_id_key,
ADD CONSTRAINT cart_items_cart_product_variant_unique 
UNIQUE (cart_id, product_id, variant);

COMMIT;
