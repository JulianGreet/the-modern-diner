import { 
  Table, 
  Staff, 
  Order, 
  MenuItem,
  Customer,
  Reservation
} from '@/types/restaurant';

// Create tables
export const mockTables: Table[] = [
  {
    id: 1,
    name: 'A1',
    capacity: 2,
    status: 'available',
    size: 'small',
    combinedWith: null,
    assignedServer: '1',
    currentOrder: null
  },
  {
    id: 2,
    name: 'A2',
    capacity: 2,
    status: 'occupied',
    size: 'small',
    combinedWith: null,
    assignedServer: '1',
    currentOrder: 1
  },
  {
    id: 3,
    name: 'A3',
    capacity: 4,
    status: 'available',
    size: 'medium',
    combinedWith: null,
    assignedServer: null,
    currentOrder: null
  },
  {
    id: 4,
    name: 'A4',
    capacity: 4,
    status: 'reserved',
    size: 'medium',
    combinedWith: null,
    assignedServer: '2',
    currentOrder: null
  },
  {
    id: 5,
    name: 'B1',
    capacity: 6,
    status: 'available',
    size: 'large',
    combinedWith: null,
    assignedServer: null,
    currentOrder: null
  },
  {
    id: 6,
    name: 'B2',
    capacity: 8,
    status: 'occupied',
    size: 'large',
    combinedWith: null,
    assignedServer: '2',
    currentOrder: 2
  },
  {
    id: 7,
    name: 'C1',
    capacity: 4,
    status: 'available',
    size: 'booth',
    combinedWith: null,
    assignedServer: null,
    currentOrder: null
  },
  {
    id: 8,
    name: 'C2',
    capacity: 4,
    status: 'cleaning',
    size: 'booth',
    combinedWith: null,
    assignedServer: null,
    currentOrder: null
  },
  {
    id: 9,
    name: 'C3',
    capacity: 4,
    status: 'occupied',
    size: 'booth',
    combinedWith: null,
    assignedServer: '3',
    currentOrder: 3
  },
];

// Create staff
export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'server',
    assignedTables: [1, 2],
    activeOrders: [1]
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'server',
    assignedTables: [4, 6],
    activeOrders: [2]
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'server',
    assignedTables: [9],
    activeOrders: [3]
  },
  {
    id: '4',
    name: 'Jessica Davis',
    role: 'host',
    assignedTables: [],
    activeOrders: []
  },
  {
    id: '5',
    name: 'David Wilson',
    role: 'kitchen',
    assignedTables: [],
    activeOrders: [1, 2, 3]
  },
  {
    id: '6',
    name: 'Amanda Martinez',
    role: 'manager',
    assignedTables: [],
    activeOrders: []
  }
];

// Create menu items
export const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
    price: 8.99,
    category: 'Salad',
    courseType: 'appetizer',
    preparationTime: 10,
    available: true
  },
  {
    id: 2,
    name: 'Tomato Soup',
    description: 'Creamy tomato soup with basil garnish',
    price: 6.99,
    category: 'Soup',
    courseType: 'appetizer',
    preparationTime: 8,
    available: true
  },
  {
    id: 3,
    name: 'Grilled Salmon',
    description: 'Fresh grilled salmon with lemon butter sauce, asparagus, and rice pilaf',
    price: 22.99,
    category: 'Seafood',
    courseType: 'main',
    preparationTime: 20,
    available: true
  },
  {
    id: 4,
    name: 'Filet Mignon',
    description: '8oz filet mignon with garlic mashed potatoes and seasonal vegetables',
    price: 28.99,
    category: 'Steak',
    courseType: 'main',
    preparationTime: 25,
    available: true
  },
  {
    id: 5,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 8.99,
    category: 'Dessert',
    courseType: 'dessert',
    preparationTime: 15,
    available: true
  },
  {
    id: 6,
    name: 'Cheesecake',
    description: 'Classic New York cheesecake with strawberry topping',
    price: 7.99,
    category: 'Dessert',
    courseType: 'dessert',
    preparationTime: 5,
    available: true
  }
];

// Create orders
export const mockOrders: Order[] = [
  {
    id: 1,
    tableId: 2,
    serverId: '1',
    items: [
      {
        id: 1,
        menuItemId: 1,
        name: 'Caesar Salad',
        price: 8.99,
        quantity: 1,
        specialRequests: 'No croutons',
        status: 'served',
        courseType: 'appetizer',
        startedAt: new Date(Date.now() - 30 * 60000),
        completedAt: new Date(Date.now() - 15 * 60000)
      },
      {
        id: 2,
        menuItemId: 3,
        name: 'Grilled Salmon',
        price: 22.99,
        quantity: 1,
        specialRequests: 'Well done',
        status: 'in-progress',
        courseType: 'main',
        startedAt: new Date(Date.now() - 15 * 60000),
        completedAt: null
      }
    ],
    status: 'in-progress',
    createdAt: new Date(Date.now() - 45 * 60000),
    updatedAt: new Date(Date.now() - 10 * 60000),
    specialNotes: 'Allergic to nuts',
    isHighPriority: false
  },
  {
    id: 2,
    tableId: 6,
    serverId: '2',
    items: [
      {
        id: 3,
        menuItemId: 2,
        name: 'Tomato Soup',
        price: 6.99,
        quantity: 2,
        specialRequests: 'Extra croutons',
        status: 'served',
        courseType: 'appetizer',
        startedAt: new Date(Date.now() - 35 * 60000),
        completedAt: new Date(Date.now() - 25 * 60000)
      },
      {
        id: 4,
        menuItemId: 4,
        name: 'Filet Mignon',
        price: 28.99,
        quantity: 2,
        specialRequests: 'One medium rare, one medium well',
        status: 'pending',
        courseType: 'main',
        startedAt: null,
        completedAt: null
      }
    ],
    status: 'in-progress',
    createdAt: new Date(Date.now() - 40 * 60000),
    updatedAt: new Date(Date.now() - 25 * 60000),
    specialNotes: 'Anniversary celebration',
    isHighPriority: true
  },
  {
    id: 3,
    tableId: 9,
    serverId: '3',
    items: [
      {
        id: 5,
        menuItemId: 3,
        name: 'Grilled Salmon',
        price: 22.99,
        quantity: 1,
        specialRequests: '',
        status: 'pending',
        courseType: 'main',
        startedAt: null,
        completedAt: null
      },
      {
        id: 6,
        menuItemId: 5,
        name: 'Chocolate Lava Cake',
        price: 8.99,
        quantity: 1,
        specialRequests: '',
        status: 'pending',
        courseType: 'dessert',
        startedAt: null,
        completedAt: null
      }
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 10 * 60000),
    updatedAt: new Date(Date.now() - 10 * 60000),
    specialNotes: '',
    isHighPriority: false
  }
];

// Create customers
export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Robert Johnson',
    phone: '555-123-4567',
    email: 'robert.j@example.com',
    preferences: ['Window seat', 'Red wine'],
    allergies: ['Peanuts'],
    visits: 5,
    lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  },
  {
    id: 2,
    name: 'Jennifer Smith',
    phone: '555-987-6543',
    email: 'jennifer.s@example.com',
    preferences: ['Booth', 'Sparkling water'],
    allergies: ['Gluten', 'Dairy'],
    visits: 3,
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
  },
  {
    id: 3,
    name: 'William Davis',
    phone: '555-456-7890',
    email: 'william.d@example.com',
    preferences: ['Private room', 'Whiskey'],
    allergies: [],
    visits: 8,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  }
];

// Create reservations
export const mockReservations: Reservation[] = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Robert Johnson',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    partySize: 2,
    tableIds: [1],
    specialRequests: 'Anniversary celebration',
    status: 'confirmed'
  },
  {
    id: 2,
    customerId: 2,
    customerName: 'Jennifer Smith',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    partySize: 4,
    tableIds: [3],
    specialRequests: 'Gluten-free options needed',
    status: 'confirmed'
  },
  {
    id: 3,
    customerId: null,
    customerName: 'Michael Wilson',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    partySize: 6,
    tableIds: [5],
    specialRequests: '',
    status: 'seated'
  }
];
