
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';
export type TableSize = 'small' | 'medium' | 'large' | 'booth';
export type OrderStatus = 'pending' | 'in-progress' | 'served' | 'completed' | 'canceled';
export type CourseType = 'appetizer' | 'main' | 'dessert' | 'drink';
export type UserRole = 'host' | 'server' | 'kitchen' | 'manager' | 'admin';
export type ReservationStatus = 'confirmed' | 'canceled' | 'seated' | 'no-show';

export interface Profile {
  id: string;
  restaurant_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: number;
  restaurant_id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  size: TableSize;
  combined_with: number[] | null;
  assigned_server: string | null;
  current_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  course_type: CourseType;
  preparation_time: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  restaurant_id: string;
  table_id: number | null;
  server_id: string | null;
  status: OrderStatus;
  special_notes: string | null;
  is_high_priority: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number | null;
  quantity: number;
  special_requests: string | null;
  status: OrderStatus;
  course_type: CourseType;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  restaurant_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  preferences: string[] | null;
  allergies: string[] | null;
  visits: number;
  last_visit: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: number;
  restaurant_id: string;
  customer_id: number | null;
  customer_name: string;
  date: string;
  party_size: number;
  table_ids: number[] | null;
  special_requests: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
}
