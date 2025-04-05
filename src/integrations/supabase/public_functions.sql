-- Functions to enable public users to place orders without authentication
-- Add these functions to your Supabase project via the SQL editor

-- Function to create a public order
CREATE OR REPLACE FUNCTION create_public_order(
  p_restaurant_id TEXT,
  p_table_id INTEGER,
  p_status TEXT DEFAULT 'pending',
  p_special_notes TEXT DEFAULT '',
  p_is_high_priority BOOLEAN DEFAULT false
) RETURNS RECORD AS $$
DECLARE
  new_order RECORD;
BEGIN
  -- Check if restaurant exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_restaurant_id) THEN
    RAISE EXCEPTION 'Restaurant not found';
  END IF;

  -- Insert the order with SECURITY DEFINER to bypass RLS
  INSERT INTO orders (
    restaurant_id,
    table_id,
    server_id,
    status,
    special_notes,
    is_high_priority
  ) VALUES (
    p_restaurant_id,
    p_table_id,
    null,
    p_status,
    p_special_notes,
    p_is_high_priority
  ) RETURNING id, table_id, restaurant_id, created_at, updated_at, status INTO new_order;

  RETURN new_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create public order items
CREATE OR REPLACE FUNCTION create_public_order_items(
  p_items JSONB
) RETURNS VOID AS $$
BEGIN
  -- Insert order items with SECURITY DEFINER to bypass RLS
  INSERT INTO order_items (
    order_id,
    menu_item_id,
    quantity,
    special_requests,
    status,
    course_type
  )
  SELECT 
    (item->>'order_id')::INTEGER,
    (item->>'menu_item_id')::INTEGER,
    (item->>'quantity')::INTEGER,
    (item->>'special_requests')::TEXT,
    (item->>'status')::TEXT,
    (item->>'course_type')::TEXT
  FROM jsonb_array_elements(p_items) AS item;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up RLS policies for public access
-- Allow public users to read menu items for a specific restaurant
CREATE POLICY "Public users can view menu items" ON menu_items
  FOR SELECT USING (true);

-- This SQL file contains functions needed to enable public order placement
-- To implement this solution:
-- 1. Log into your Supabase project dashboard
-- 2. Navigate to the SQL Editor
-- 3. Create a new query and paste the contents of this file
-- 4. Run the query to create the functions
-- 5. Test public order placement from your application 