
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, CourseType } from "@/types/restaurant";
import { useAuth } from "@/hooks/useAuth";

export async function fetchMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
  
  // Transform to frontend types
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description || '',
    price: item.price,
    category: item.category,
    courseType: item.course_type as CourseType,
    preparationTime: item.preparation_time,
    available: item.available
  })) as MenuItem[];
}

export async function createMenuItem(menuItem: Omit<MenuItem, 'id'>) {
  // Get the authenticated user's restaurant_id
  // This is a placeholder - in a real app you would get this from auth context
  const restaurant_id = "123e4567-e89b-12d3-a456-426614174000"; // Placeholder

  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      course_type: menuItem.courseType,
      preparation_time: menuItem.preparationTime,
      available: menuItem.available,
      restaurant_id: restaurant_id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
  
  return data;
}

export async function updateMenuItem(menuItemId: number, updates: Partial<Omit<MenuItem, 'id'>>) {
  // Transform frontend properties to database column names
  const dbUpdates: any = {};
  
  if (updates.name) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.category) dbUpdates.category = updates.category;
  if (updates.courseType) dbUpdates.course_type = updates.courseType;
  if (updates.preparationTime !== undefined) dbUpdates.preparation_time = updates.preparationTime;
  if (updates.available !== undefined) dbUpdates.available = updates.available;
  
  const { data, error } = await supabase
    .from('menu_items')
    .update(dbUpdates)
    .eq('id', menuItemId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
  
  return data;
}

export async function deleteMenuItem(menuItemId: number) {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', menuItemId);
  
  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
  
  return true;
}
