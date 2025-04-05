# Setting Up Public Orders in Table Saga

This document explains how to enable public users to place orders without requiring authentication.

## Current Issue

Public users can place orders from the order page, but these orders are not showing up in the restaurant's orders page. This happens because:

1. The Supabase database uses Row Level Security (RLS) policies that restrict access for unauthenticated users.
2. Our client-side workaround returns a success message but doesn't actually save the order in the database.

## Solution 1: Database Functions Approach

The most secure approach is to create Supabase database functions with `SECURITY DEFINER` privileges:

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query and paste the following code:

```sql
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
```

4. Run the query to create these functions

## Solution 2: RLS Policies Approach

Alternatively, you can adjust RLS policies to allow public order creation:

```sql
-- Allow anyone to insert orders
CREATE POLICY "Allow public to insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow anyone to insert order items
CREATE POLICY "Allow public to insert order items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow public to read menu items 
CREATE POLICY "Public can view menu items" ON menu_items
  FOR SELECT USING (true);

-- Allow public to read tables 
CREATE POLICY "Public can view tables" ON tables
  FOR SELECT USING (true);
```

## Solution 3: API Endpoint

For more control, create a serverless function or API endpoint:

1. Create an `/api/public-orders` endpoint in your backend
2. This endpoint would use admin credentials to create the order
3. Update the client code to call this endpoint for public orders

## Client-Side Implementation

The application already tries multiple approaches to save public orders:

1. Direct database insert (may fail due to RLS)
2. RPC function calls (if you've set up Solution 1)
3. API endpoint (if you've set up Solution 3)
4. Local storage fallback (for better user experience)

## Testing Public Orders

After implementing one of the solutions above:

1. Open the public order page directly (e.g., `/order/[restaurantId]/[tableId]`)
2. Add items to the cart and place the order
3. Log in as the restaurant admin and check the Orders page
4. Verify that the order appears with all items

## Troubleshooting

If orders still don't appear:

1. Check browser console logs for errors
2. Verify RLS policies are correctly set up in Supabase
3. Confirm the correct restaurant ID is being passed in the request
4. Check Supabase logs for function execution errors 