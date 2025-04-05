import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

type PendingOrder = {
  id: number;
  tableId: number;
  timestamp: string;
};

type StoredOrder = {
  id: number;
  table_id: number;
  restaurant_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    id: number;
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
    specialRequests: string;
    status: string;
    courseType: string;
  }>;
};

const PendingPublicOrders: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  
  useEffect(() => {
    if (user) {
      loadPendingOrders();
    }
  }, [user]);
  
  const loadPendingOrders = () => {
    if (!user?.id) return;
    
    try {
      const pendingOrdersKey = `pendingOrders_${user.id}`;
      const storedOrders = localStorage.getItem(pendingOrdersKey);
      
      if (storedOrders) {
        const orders = JSON.parse(storedOrders) as PendingOrder[];
        setPendingOrders(orders);
      }
    } catch (error) {
      console.error('Error loading pending orders:', error);
    }
  };
  
  const handleSyncOrder = async (orderId: number) => {
    if (!user?.id) return;
    
    try {
      setSyncingId(orderId);
      const orderKey = `pendingOrder_${user.id}_${orderId}`;
      const storedOrderJson = localStorage.getItem(orderKey);
      
      if (!storedOrderJson) {
        toast({
          title: 'Order Not Found',
          description: 'Could not find the stored order data.',
          variant: 'destructive'
        });
        setSyncingId(null);
        return;
      }
      
      const storedOrder = JSON.parse(storedOrderJson) as StoredOrder;
      
      // Create the order in the database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          restaurant_id: user.id,
          table_id: storedOrder.table_id,
          server_id: null,
          status: storedOrder.status,
          special_notes: '',
          is_high_priority: false
        })
        .select()
        .single();
      
      if (orderError) {
        console.error('Error syncing order:', orderError);
        toast({
          title: 'Sync Failed',
          description: 'Could not sync order to the database.',
          variant: 'destructive'
        });
        setSyncingId(null);
        return;
      }
      
      // Create order items
      if (storedOrder.items.length > 0 && orderData) {
        const orderItems = storedOrder.items.map(item => ({
          order_id: orderData.id,
          menu_item_id: item.menuItemId,
          quantity: item.quantity,
          special_requests: item.specialRequests,
          status: item.status,
          course_type: item.courseType
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) {
          console.error('Error creating order items:', itemsError);
          toast({
            title: 'Item Sync Failed',
            description: 'Order was created but items could not be synced.',
            variant: 'default'
          });
          setSyncingId(null);
          return;
        }
      }
      
      // Remove the order from localStorage
      localStorage.removeItem(orderKey);
      
      // Update the pending orders list
      const pendingOrdersKey = `pendingOrders_${user.id}`;
      const updatedOrders = pendingOrders.filter(order => order.id !== orderId);
      localStorage.setItem(pendingOrdersKey, JSON.stringify(updatedOrders));
      setPendingOrders(updatedOrders);
      
      toast({
        title: 'Order Synced',
        description: 'The order has been successfully synced to the database.',
      });
    } catch (error) {
      console.error('Error syncing order:', error);
      toast({
        title: 'Sync Error',
        description: 'An unexpected error occurred while syncing the order.',
        variant: 'destructive'
      });
    } finally {
      setSyncingId(null);
    }
  };
  
  if (pendingOrders.length === 0) {
    return null;
  }
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Pending Public Orders</CardTitle>
        <CardDescription>
          These orders were placed by customers but could not be saved to the database.
          Sync them to add them to your order list.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>Table {order.tableId}</TableCell>
                <TableCell>
                  {formatDistance(new Date(order.timestamp), new Date(), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSyncOrder(order.id)}
                    disabled={syncingId === order.id}
                  >
                    {syncingId === order.id ? 'Syncing...' : 'Sync Order'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button 
          variant="secondary"
          onClick={loadPendingOrders}
          disabled={loading}
        >
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingPublicOrders; 