
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from '@/types/restaurant';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronsRight,
  MoreHorizontal 
} from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500 text-white';
    case 'in-progress':
      return 'bg-blue-500 text-white';
    case 'served':
      return 'bg-green-500 text-white';
    case 'completed':
      return 'bg-restaurant-success text-white';
    case 'canceled':
      return 'bg-restaurant-danger text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    case 'served':
      return 'Served';
    case 'completed':
      return 'Completed';
    case 'canceled':
      return 'Canceled';
    default:
      return 'Unknown';
  }
};

const getNextStatusButton = (
  currentStatus: OrderStatus, 
  onUpdateStatus: (status: OrderStatus) => void
) => {
  switch (currentStatus) {
    case 'pending':
      return (
        <Button 
          size="sm" 
          onClick={() => onUpdateStatus('in-progress')}
          className="text-xs h-8"
        >
          Start Preparing
          <ChevronsRight size={14} className="ml-1" />
        </Button>
      );
    case 'in-progress':
      return (
        <Button 
          size="sm" 
          onClick={() => onUpdateStatus('served')}
          className="text-xs h-8"
        >
          Mark as Served
          <ChevronsRight size={14} className="ml-1" />
        </Button>
      );
    case 'served':
      return (
        <Button 
          size="sm" 
          onClick={() => onUpdateStatus('completed')}
          className="text-xs h-8 bg-restaurant-success hover:bg-restaurant-success/90"
        >
          Complete Order
          <CheckCircle2 size={14} className="ml-1" />
        </Button>
      );
    default:
      return null;
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onUpdateStatus }) => {
  const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const timeElapsed = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true });
  
  return (
    <Card className={cn(
      "w-full",
      order.isHighPriority && "border-restaurant-danger border-2",
      order.status === 'pending' && "animate-pulse-subtle"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">Order #{order.id}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Table #{order.tableId} • Server #{order.serverId}
            </div>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm mb-2">
          <span>{totalItems} items</span>
          <span className="font-medium">${totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="text-xs flex items-center mt-2">
          <Clock size={14} className="mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{timeElapsed}</span>
          
          {order.isHighPriority && (
            <Badge variant="outline" className="ml-2 text-restaurant-danger border-restaurant-danger">
              <AlertTriangle size={12} className="mr-1" />
              High Priority
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetails(order.id)}
          className="text-xs h-8"
        >
          View Details
          <MoreHorizontal size={14} className="ml-1" />
        </Button>
        
        {getNextStatusButton(order.status, (status) => onUpdateStatus(order.id, status))}
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
