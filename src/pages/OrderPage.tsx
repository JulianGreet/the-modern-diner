
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/supabase/menuService';
import { getTableById } from '@/services/supabase/tableService';
import { createOrder } from '@/services/supabase/orderService';
import { MenuItem, Table, OrderItem, Order, OrderStatus, CourseType } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

// Import components
import TableInfo from '@/components/orders/TableInfo';
import MenuSection from '@/components/orders/MenuSection';
import CartSection from '@/components/orders/CartSection';
import OrderSuccess from '@/components/orders/OrderSuccess';

interface CartItem extends MenuItem {
  quantity: number;
  specialRequests: string;
}

const OrderPage: React.FC = () => {
  const { restaurantId, tableId } = useParams<{ restaurantId: string; tableId: string }>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [table, setTable] = useState<Table | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['menuItems', restaurantId],
    queryFn: () => fetchMenuItems(restaurantId),
    enabled: !!restaurantId
  });

  useEffect(() => {
    const loadTable = async () => {
      try {
        if (tableId) {
          const tableData = await getTableById(parseInt(tableId));
          setTable(tableData);
        }
      } catch (error) {
        console.error('Failed to load table:', error);
        toast({
          title: 'Error Loading Table',
          description: 'Could not load table information.',
          variant: 'destructive'
        });
      }
    };
    
    loadTable();
  }, [tableId, toast]);
  
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1, specialRequests: '' }];
      }
    });
    
    toast({
      title: 'Item Added',
      description: `${item.name} added to your order.`,
    });
  };
  
  const updateQuantity = (itemId: number, change: number) => {
    setCart(prev => {
      const updatedCart = prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      return updatedCart.filter(item => item.quantity > 0);
    });
  };
  
  const updateSpecialRequests = (itemId: number, requests: string) => {
    setCart(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, specialRequests: requests } 
          : item
      )
    );
  };
  
  const clearCart = () => setCart([]);
  
  const placeOrder = async () => {
    try {
      setIsPlacingOrder(true);
      
      if (!tableId || !restaurantId || cart.length === 0) {
        toast({
          title: 'Cannot Place Order',
          description: 'Your cart is empty or table information is missing.',
          variant: 'destructive'
        });
        setIsPlacingOrder(false);
        return;
      }

      // Store a copy of the current cart for the receipt
      setCompletedOrder([...cart]);

      const orderItems = cart.map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        specialRequests: item.specialRequests,
        status: 'pending' as OrderStatus,
        courseType: item.courseType as CourseType,
        startedAt: null,
        completedAt: null
      }));

      const newOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        tableId: parseInt(tableId),
        serverId: null,
        items: orderItems as OrderItem[],
        status: 'pending' as OrderStatus,
        specialNotes: '',
        isHighPriority: false
      };

      await createOrder(newOrder, restaurantId);
      
      toast({
        title: 'Order Placed Successfully',
        description: `Your order for Table ${table?.name} has been sent to the kitchen.`,
      });
      
      setCart([]);
      setOrderPlaced(true);
      setIsPlacingOrder(false);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast({
        title: 'Error Placing Order',
        description: 'Could not place your order. Please try again.',
        variant: 'destructive'
      });
      setIsPlacingOrder(false);
    }
  };

  // Render the order success screen if order is placed
  if (orderPlaced) {
    return <OrderSuccess 
      onNewOrder={() => {
        setOrderPlaced(false);
        setCompletedOrder([]);
      }}
      orderItems={completedOrder}
    />;
  }
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <TableInfo table={table} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <MenuSection 
            menuItems={menuItems} 
            addToCart={addToCart}
          />
        </div>
        
        <div>
          <CartSection 
            cart={cart}
            updateQuantity={updateQuantity}
            updateSpecialRequests={updateSpecialRequests}
            clearCart={clearCart}
            placeOrder={placeOrder}
            isPlacingOrder={isPlacingOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
