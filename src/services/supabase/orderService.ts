
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem, OrderStatus } from "@/types/restaurant";

export async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items:order_items(
        menu_item_id,
        quantity,
        special_requests,
        status,
        course_type,
        started_at,
        completed_at,
        menu_items:menu_items(
          name,
          description,
          price,
          course_type,
          preparation_time,
          available
        )
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
  
  // Transform joined Supabase data to frontend types
  console.log('Raw orders data from DB:', data);
  const orders = data.map(order => {
    return {
      id: order.id,
      tableId: order.table_id,
      serverId: order.server_id,
      items: order.order_items.map((item: any) => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        name: item.menu_items?.name || '[MENU ITEM NOT FOUND]',
        description: item.menu_items?.description || '',
        price: item.menu_items?.price || 0,
        preparationTime: item.menu_items?.preparation_time || 0,
        available: item.menu_items?.available ?? false,
        quantity: item.quantity,
        specialRequests: item.special_requests || '',
        status: item.status as OrderStatus,
        courseType: item.course_type,
        startedAt: item.started_at ? new Date(item.started_at) : null,
        completedAt: item.completed_at ? new Date(item.completed_at) : null
      })),
      status: order.status as OrderStatus,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at),
      specialNotes: order.special_notes || '',
      isHighPriority: order.is_high_priority
    };
  });
  
  return orders;
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, restaurantId?: string) {
  // Convert serverId from number to string if it exists
  const serverIdAsString = order.serverId ? String(order.serverId) : null;
  
  // Log the order being created to help debugging
  console.log('Creating order with data:', JSON.stringify(order, null, 2));
  
  // Determine restaurant ID - either from parameter or authenticated user
  let restaurant_id: string | undefined;
  
  if (restaurantId) {
    restaurant_id = restaurantId;
  } else {
    const { data: user } = await supabase.auth.getUser();
    restaurant_id = user.user?.id;
  }
  
  if (!restaurant_id) {
    throw new Error('No restaurant ID provided and no authenticated user found');
  }
  
  const { data, error } = await supabase
    .from('orders')
    .insert({
      restaurant_id,
      table_id: order.tableId,
      server_id: serverIdAsString,
      status: order.status,
      special_notes: order.specialNotes,
      is_high_priority: order.isHighPriority
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }
  
  // Insert order items with complete details
  if (order.items.length > 0) {
    const orderItems = order.items.map(item => ({
      order_id: data.id,
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      special_requests: item.specialRequests,
      status: item.status,
      course_type: item.courseType
    }));
    
    console.log('Creating order items with data:', JSON.stringify(orderItems, null, 2));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }
  }
  
  return data;
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  const updatedAt = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: updatedAt })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
  
  return data;
}

export async function updateOrderItemStatus(itemId: number, status: OrderStatus) {
  const now = new Date().toISOString();
  const updates: any = { 
    status, 
    updated_at: now
  };
  
  if (status === 'in-progress') {
    updates.started_at = now;
  }
  
  if (status === 'completed') {
    updates.completed_at = now;
  }
  
  const { data, error } = await supabase
    .from('order_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order item status:', error);
    throw error;
  }
  
  return data;
}
