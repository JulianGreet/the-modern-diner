
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

export async function getTableById(tableId: number) {
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
    currentOrder: data.current_order
  } as Table;
}
