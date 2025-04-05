-- Enable RLS on tables
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to tables
CREATE POLICY "Public read access to tables"
ON tables FOR SELECT
TO public
USING (true);

-- Policy for public read access to menu items
CREATE POLICY "Public read access to menu items"
ON menu_items FOR SELECT
TO public
USING (available = true);

-- Policy for public order creation
CREATE POLICY "Public order creation"
ON orders FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM tables
    WHERE tables.id = table_id
    AND tables.restaurant_id = restaurant_id
    AND tables.status = 'available'
  )
);

-- Policy for public order items creation
CREATE POLICY "Public order items creation"
ON order_items FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_id
    AND orders.status = 'pending'
  )
);

-- Policy for public read access to their own orders
CREATE POLICY "Public read access to their own orders"
ON orders FOR SELECT
TO public
USING (
  created_at > (CURRENT_TIMESTAMP - INTERVAL '24 hours')
);

-- Policy for public read access to their own order items
CREATE POLICY "Public read access to their own order items"
ON order_items FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_id
    AND orders.created_at > (CURRENT_TIMESTAMP - INTERVAL '24 hours')
  )
); 