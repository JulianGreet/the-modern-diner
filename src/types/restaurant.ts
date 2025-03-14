
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export type TableSize = 'small' | 'medium' | 'large' | 'booth';

export type OrderStatus = 'pending' | 'in-progress' | 'served' | 'completed' | 'canceled';

export type CourseType = 'appetizer' | 'main' | 'dessert' | 'drink';

export type UserRole = 'host' | 'server' | 'kitchen' | 'manager' | 'admin';

export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  size: TableSize;
  combinedWith: number[] | null;
  assignedServer: string | null;
  currentOrder: number | null;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  courseType: CourseType;
  preparationTime: number;
  available: boolean;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  specialRequests: string;
  status: OrderStatus;
  courseType: CourseType;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface Order {
  id: number;
  tableId: number;
  serverId: string | null;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  specialNotes: string;
  isHighPriority: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: UserRole;
  assignedTables: number[];
  activeOrders: number[];
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  preferences: string[];
  allergies: string[];
  visits: number;
  lastVisit: Date | null;
}

export interface Reservation {
  id: number;
  customerId: number | null;
  customerName: string;
  date: Date;
  partySize: number;
  tableIds: number[];
  specialRequests: string;
  status: 'confirmed' | 'canceled' | 'seated' | 'no-show';
}
