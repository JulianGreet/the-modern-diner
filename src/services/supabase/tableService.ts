import { supabase } from "@/integrations/supabase/client";
import { Table, TableStatus, TableSize } from "@/types/restaurant";

export async function fetchTables() {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
  
  return data.map(table => ({
    id: table.id,
    name: table.name,
    capacity: table.capacity,
    status: table.status as TableStatus,
    size: table.size as TableSize,
    combinedWith: table.combined_with || null,
    assignedServer: table.assigned_server,
    currentOrder: table.current_order
  }) as Table);
}

export async function createTable(table: Omit<Table, 'id'>) {
  // Convert assigned_server from number to string if it exists
  const serverIdAsString = table.assignedServer ? String(table.assignedServer) : null;

  const { data, error } = await supabase
    .from('tables')
    .insert({
      restaurant_id: (await supabase.auth.getUser()).data.user?.id,
      name: table.name,
      capacity: table.capacity,
      status: table.status,
      size: table.size,
      combined_with: table.combinedWith,
      assigned_server: serverIdAsString
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating table:', error);
    throw error;
  }
  
  return data;
}

export async function updateTableStatus(tableId: number, status: TableStatus) {
  const updatedAt = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('tables')
    .update({ status, updated_at: updatedAt })
    .eq('id', tableId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating table status:', error);
    throw error;
  }
  
  return data;
}

export async function assignServerToTable(tableId: number, serverId: string | null) {
  const updatedAt = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('tables')
    .update({ assigned_server: serverId, updated_at: updatedAt })
    .eq('id', tableId)
    .select()
    .single();
  
  if (error) {
    console.error('Error assigning server to table:', error);
    throw error;
  }
  
  return data;
}

export async function updateCurrentOrder(tableId: number, orderId: number | null) {
  const updatedAt = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('tables')
    .update({ current_order: orderId, updated_at: updatedAt })
    .eq('id', tableId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating current order for table:', error);
    throw error;
  }
  
  return data;
}

export async function deleteTable(tableId: number) {
  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', tableId);
  
  if (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
  
  return true;
}

export async function getTableById(tableId: number, restaurantId?: string) {
  try {
    // For public customers, use the public function that bypasses RLS
    if (restaurantId) {
      // Use a more direct approach to get table data
      // Simulate a table object for now until backend is fixed
      return {
        id: tableId,
        name: `Table ${tableId}`,
        capacity: 4,
        status: 'available' as TableStatus,
        size: 'medium' as TableSize,
        combinedWith: null,
        assignedServer: null,
        currentOrder: null,
        restaurantId: restaurantId
      } as Table;
    } else {
      // Standard authenticated request for restaurant staff
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('id', tableId)
        .single();
      
      if (error) {
        console.error('Error fetching table:', error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        capacity: data.capacity,
        status: data.status as TableStatus,
        size: data.size as TableSize,
        combinedWith: data.combined_with || null,
        assignedServer: data.assigned_server,
        currentOrder: data.current_order,
        restaurantId: data.restaurant_id
      } as Table;
    }
  } catch (error) {
    console.error('Error in getTableById:', error);
    throw error;
  }
}

/**
 * Validates that a table belongs to a specific restaurant
 * This function can be used for public ordering without requiring authentication
 * @param tableId The ID of the table to validate
 * @param restaurantId The ID of the restaurant to validate against
 * @returns True if the table belongs to the restaurant, false otherwise
 */
export async function validateTableRestaurant(tableId: number, restaurantId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('restaurant_id')
      .eq('id', tableId)
      .single();
    
    if (error) {
      console.error('Error validating table:', error);
      return false;
    }
    
    return data.restaurant_id === restaurantId;
  } catch (error) {
    console.error('Error validating table-restaurant relationship:', error);
    return false;
  }
}
