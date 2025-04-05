import { supabase } from "@/integrations/supabase/client";
import { OrderStatus } from "@/types/restaurant";

interface CreatePublicOrderInput {
  tableId: number;
  restaurantId: string;
  items: Array<{
    menuItemId: number;
    quantity: number;
  }>;
}

export async function createPublicOrder(input: CreatePublicOrderInput) {
  try {
    // 1. Validate table availability
    const { data: table, error: tableError } = await supabase
      .from('tables')
      .select('id, status')
      .eq('id', input.tableId)
      .eq('restaurant_id', input.restaurantId)
      .single();

    if (tableError) {
      console.error('Table validation error:', tableError);
      throw new Error('Unable to validate table');
    }

    if (!table) {
      throw new Error('Table not found');
    }

    if (table.status !== 'available') {
      throw new Error('Table is not available');
    }

    // 2. Calculate total amount
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, price')
      .in('id', input.items.map(item => item.menuItemId));

    if (menuError) {
      console.error('Menu items fetch error:', menuError);
      throw new Error('Unable to fetch menu items');
    }

    const totalAmount = input.items.reduce((sum, item) => {
      const menuItem = menuItems?.find(mi => mi.id === item.menuItemId);
      return sum + (menuItem?.price || 0) * item.quantity;
    }, 0);

    // 3. Create order in a transaction-like manner
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        table_id: input.tableId,
        restaurant_id: input.restaurantId,
        status: 'pending',
        total_amount: totalAmount
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // 4. Create order items
    const orderItems = input.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      status: 'pending' as OrderStatus,
      course_type: 'main' // Default course type
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Try to rollback the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error('Failed to create order items');
    }

    // 5. Update table status
    const { error: updateError } = await supabase
      .from('tables')
      .update({ 
        status: 'occupied',
        current_order: order.id
      })
      .eq('id', input.tableId);

    if (updateError) {
      console.error('Table update error:', updateError);
      // Try to rollback the order and items
      await supabase.from('orders').delete().eq('id', order.id);
      throw new Error('Failed to update table status');
    }

    return {
      success: true,
      orderId: order.id,
      error: null
    };

  } catch (error) {
    console.error('Create public order error:', error);
    return {
      success: false,
      orderId: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
} 