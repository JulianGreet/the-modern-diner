
import { supabase } from "@/integrations/supabase/client";
import { Reservation } from "@/types/restaurant";

export async function fetchReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('*, customers(*)')
    .order('date');
  
  if (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
  
  // Transform Supabase data to match our frontend types
  const reservations = data.map(reservation => {
    return {
      id: reservation.id,
      customerId: reservation.customer_id,
      customerName: reservation.customer_name,
      date: new Date(reservation.date),
      partySize: reservation.party_size,
      tableIds: reservation.table_ids || [],
      specialRequests: reservation.special_requests || '',
      status: reservation.status
    } as Reservation;
  });
  
  return reservations;
}

export async function createReservation(reservation: Omit<Reservation, 'id'>) {
  const { data, error } = await supabase
    .from('reservations')
    .insert([{
      restaurant_id: (await supabase.auth.getUser()).data.user?.id,
      customer_id: reservation.customerId,
      customer_name: reservation.customerName,
      date: reservation.date.toISOString(),
      party_size: reservation.partySize,
      table_ids: reservation.tableIds,
      special_requests: reservation.specialRequests,
      status: reservation.status
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
  
  return data;
}

export async function updateReservationStatus(reservationId: number, status: 'confirmed' | 'canceled' | 'seated' | 'no-show') {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status, updated_at: new Date() })
    .eq('id', reservationId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
  
  return data;
}
