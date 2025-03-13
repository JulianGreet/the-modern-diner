
import React, { useState } from 'react';
import { mockOrders } from '@/services/mockData';
import { Order, OrderStatus } from '@/types/restaurant';
import OrderGrid from '@/components/orders/OrderGrid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Timer, UtensilsCrossed, User } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleViewOrderDetails = (orderId: number) => {
    const order = orders.find(o => o.id === orderId) || null;
    setSelectedOrder(order);
    setOrderDialogOpen(true);
  };

  const handleUpdateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          return { ...order, status, updatedAt: new Date() };
        }
        return order;
      })
    );
    
    toast({
      title: `Order #${orderId} Updated`,
      description: `Status changed to ${status}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button>Create New Order</Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <ClipboardList className="h-8 w-8 mb-2 text-restaurant-burgundy" />
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Timer className="h-8 w-8 mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending' || o.status === 'in-progress').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Orders</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 mb-2 text-restaurant-success" />
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed Today</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <User className="h-8 w-8 mb-2 text-blue-500" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Active Servers</div>
          </CardContent>
        </Card>
      </div>
      
      <OrderGrid 
        orders={orders} 
        onViewOrderDetails={handleViewOrderDetails}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
      
      {selectedOrder && (
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order #{selectedOrder.id}</span>
                <Badge className={
                  selectedOrder.status === 'pending' ? 'bg-yellow-500' :
                  selectedOrder.status === 'in-progress' ? 'bg-blue-500' :
                  selectedOrder.status === 'served' ? 'bg-green-500' :
                  selectedOrder.status === 'completed' ? 'bg-restaurant-success' :
                  'bg-restaurant-danger'
                }>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Table</p>
                  <p>#{selectedOrder.tableId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Server</p>
                  <p>#{selectedOrder.serverId}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Order Items</p>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Item</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm">
                            <div>{item.name}</div>
                            {item.specialRequests && (
                              <div className="text-xs text-muted-foreground">
                                Note: {item.specialRequests}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">${(item.price * item.quantity).toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">
                            <Badge variant="outline" className={
                              item.status === 'pending' ? 'border-yellow-500 text-yellow-500' :
                              item.status === 'in-progress' ? 'border-blue-500 text-blue-500' :
                              item.status === 'served' ? 'border-green-500 text-green-500' :
                              'border-restaurant-success text-restaurant-success'
                            }>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted">
                      <tr>
                        <td className="px-4 py-2 text-sm font-medium">Total</td>
                        <td className="px-4 py-2 text-sm">
                          {selectedOrder.items.reduce((total, item) => total + item.quantity, 0)}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium" colSpan={2}>
                          ${selectedOrder.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {selectedOrder.specialNotes && (
                <div>
                  <p className="text-sm font-medium">Special Notes</p>
                  <p className="text-sm">{selectedOrder.specialNotes}</p>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>
                Close
              </Button>
              
              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'canceled' && (
                <div className="space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <Button onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'in-progress')}>
                      Start Preparing
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'in-progress' && (
                    <Button onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'served')}>
                      Mark as Served
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'served' && (
                    <Button 
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'completed')}
                      className="bg-restaurant-success hover:bg-restaurant-success/90"
                    >
                      Complete Order
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="text-restaurant-danger border-restaurant-danger"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'canceled')}
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrdersPage;
