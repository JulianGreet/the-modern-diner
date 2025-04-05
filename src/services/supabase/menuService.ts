import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types/restaurant";

export async function fetchMenuItems(restaurantId?: string) {
  try {
    let query = supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .eq('available', true);
    
    // If restaurantId is provided, use it directly (public access)
    // Otherwise, try to get the authenticated user's ID (admin access)
    if (restaurantId) {
      query = query
        .eq('restaurant_id', restaurantId)
        .eq('available', true);
    } else {
      const { data: user } = await supabase.auth.getUser();
      if (user.user?.id) {
        query = query
        .eq('restaurant_id', user.user.id)
        .eq('available', true);
      } else {
        throw new Error('No restaurant ID provided and no authenticated user found');
      }
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching menu items:', error);
      // If this is a public order and there's an error, use fallback data
      if (restaurantId) {
        console.log('Using fallback menu for public user');
        return getDummyMenuItems();
      }
      throw error;
    }
    
    // If no items found for public user, use fallback data
    if (restaurantId && (!data || data.length === 0)) {
      console.log('No menu items found, using fallback menu for public user');
      return getDummyMenuItems();
    }
    
    // Transform to frontend types
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      courseType: item.course_type,
      preparationTime: item.preparation_time,
      available: item.available
    })) as MenuItem[];
  } catch (error) {
    console.error('Error in fetchMenuItems:', error);
    // If this is a public order and there's an error, use fallback data
    if (restaurantId) {
      console.log('Using fallback menu after error for public user');
      return getDummyMenuItems();
    }
    throw error;
  }
}

// Function to provide some dummy menu items when database access fails
function getDummyMenuItems(): MenuItem[] {
  return [
    {
      id: 1,
      name: "House Salad",
      description: "Fresh mixed greens with house dressing",
      price: 8,
      category: "appetizers",
      courseType: "appetizer",
      preparationTime: 5,
      available: true
    },
    {
      id: 2,
      name: "Margherita Pizza",
      description: "Classic tomato and mozzarella pizza",
      price: 12,
      category: "mains",
      courseType: "main",
      preparationTime: 15,
      available: true
    },
    {
      id: 3,
      name: "Pasta Carbonara",
      description: "Creamy pasta with bacon and egg",
      price: 14,
      category: "mains",
      courseType: "main",
      preparationTime: 12,
      available: true
    },
    {
      id: 4,
      name: "Chocolate Cake",
      description: "Rich chocolate cake with vanilla ice cream",
      price: 8,
      category: "desserts",
      courseType: "dessert",
      preparationTime: 5,
      available: true
    }
  ];
}

export async function createMenuItem(menuItem: Omit<MenuItem, 'id'>) {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      restaurant_id: (await supabase.auth.getUser()).data.user?.id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      course_type: menuItem.courseType,
      preparation_time: menuItem.preparationTime,
      available: menuItem.available
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
  const dbUpdates: any = {};
  
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.courseType !== undefined) dbUpdates.course_type = updates.courseType;
  if (updates.preparationTime !== undefined) dbUpdates.preparation_time = updates.preparationTime;
  if (updates.available !== undefined) dbUpdates.available = updates.available;
  
  dbUpdates.updated_at = new Date().toISOString();
  
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
