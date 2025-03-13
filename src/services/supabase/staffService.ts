
import { supabase } from "@/integrations/supabase/client";
import { Staff, UserRole } from "@/types/restaurant";

export async function fetchStaff() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('role');
  
  if (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
  
  // Transform Supabase data to match our frontend types
  const staff = data.map(profile => {
    return {
      id: profile.id,
      name: profile.restaurant_name || 'Unknown Staff',
      role: profile.role as UserRole,
      assignedTables: [], // We'll need to join with tables to get this
      activeOrders: [] // We'll need to join with orders to get this
    };
  });
  
  return staff;
}

export async function createStaffMember(staff: Omit<Staff, 'id' | 'assignedTables' | 'activeOrders'>) {
  // This would typically involve creating a user in auth and then a profile
  // For now, we'll just create a profile (in a real app, you'd use Supabase auth APIs)
  const { data, error } = await supabase
    .from('profiles')
    .insert([{
      restaurant_name: staff.name,
      role: staff.role
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
  
  return data;
}

export async function updateStaffRole(staffId: string, role: UserRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date() })
    .eq('id', staffId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating staff role:', error);
    throw error;
  }
  
  return data;
}
