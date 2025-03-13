
import React from 'react';
import { Order, OrderStatus } from '@/types/restaurant';
import OrderCard from './OrderCard';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

interface OrderGridProps {
  orders: Order[];
  onViewOrderDetails: (orderId: number) => void;
  onUpdateOrderStatus: (orderId: number, status: OrderStatus) => void;
}

const OrderGrid: React.FC<OrderGridProps> = ({ 
  orders, 
  onViewOrderDetails, 
  onUpdateOrderStatus 
}) => {
  // Group orders by status
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const inProgressOrders = orders.filter(order => order.status === 'in-progress');
  const servedOrders = orders.filter(order => order.status === 'served');
  const completedOrders = orders.filter(order => order.status === 'completed');
  
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="pending" className="relative">
          Pending
          {pendingOrders.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-restaurant-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingOrders.length}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="served">Served</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        {pendingOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={onViewOrderDetails}
                onUpdateStatus={(status) => onUpdateOrderStatus(order.id, status)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No pending orders
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="in-progress">
        {inProgressOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={onViewOrderDetails}
                onUpdateStatus={(status) => onUpdateOrderStatus(order.id, status)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No orders in progress
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="served">
        {servedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={onViewOrderDetails}
                onUpdateStatus={(status) => onUpdateOrderStatus(order.id, status)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No served orders
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="completed">
        {completedOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={onViewOrderDetails}
                onUpdateStatus={(status) => onUpdateOrderStatus(order.id, status)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            No completed orders
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default OrderGrid;
