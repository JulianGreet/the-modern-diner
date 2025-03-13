
import { supabase } from "@/integrations/supabase/client";

// This function can be used to create some initial sample data
// after a user signs up
export async function seedInitialData() {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Check if user already has tables
  const { data: existingTables } = await supabase
    .from('tables')
    .select('id')
    .limit(1);
    
  // Only seed if no tables exist
  if (existingTables && existingTables.length === 0) {
    // Create some sample tables
    const sampleTables = [
      {
        restaurant_id: user.id,
        name: 'T1',
        capacity: 2,
        status: 'available',
        size: 'small'
      },
      {
        restaurant_id: user.id,
        name: 'T2',
        capacity: 4,
        status: 'available',
        size: 'medium'
      },
      {
        restaurant_id: user.id,
        name: 'T3',
        capacity: 6,
        status: 'available',
        size: 'large'
      },
      {
        restaurant_id: user.id,
        name: 'T4',
        capacity: 8,
        status: 'available',
        size: 'booth'
      }
    ];
    
    const { error } = await supabase
      .from('tables')
      .insert(sampleTables);
      
    if (error) {
      console.error('Error seeding initial tables:', error);
      throw error;
    }
    
    return true;
  }
  
  return false;
}
