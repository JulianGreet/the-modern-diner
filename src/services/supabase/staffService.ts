
import { supabase } from "@/integrations/supabase/client";
import { Staff, UserRole } from "@/types/restaurant";

export async function fetchStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
  
  // Transform to frontend types
  return data.map(staff => ({
    id: staff.id,
    name: staff.name,
    role: staff.role as UserRole,
    assignedTables: staff.assigned_tables || [],
    activeOrders: staff.active_orders || []
  })) as Staff[];
}

export async function createStaffMember(staff: Omit<Staff, 'id'>) {
  const { data, error } = await supabase
    .from('staff')
    .insert({
      restaurant_id: (await supabase.auth.getUser()).data.user?.id,
      name: staff.name,
      role: staff.role,
      assigned_tables: staff.assignedTables,
      active_orders: staff.activeOrders
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
  
  return data;
}

export async function updateStaff(staffId: string, updates: Partial<Omit<Staff, 'id'>>) {
  const dbUpdates: any = {};
  
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.role) dbUpdates.role = updates.role;
  if (updates.assignedTables) dbUpdates.assigned_tables = updates.assignedTables;
  if (updates.activeOrders) dbUpdates.active_orders = updates.activeOrders;
  
  dbUpdates.updated_at = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('staff')
    .update(dbUpdates)
    .eq('id', staffId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating staff member:', error);
    throw error;
  }
  
  return data;
}

export async function deleteStaff(staffId: string) {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', staffId);
  
  if (error) {
    console.error('Error deleting staff member:', error);
    throw error;
  }
  
  return true;
}
