
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Receipt, ShoppingBag } from 'lucide-react';
import { OrderItem } from '@/types/restaurant';
import { formatPrice } from '@/components/menu/utils/menuUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface OrderSuccessProps {
  onNewOrder: () => void;
  orderItems?: OrderItem[];
  tableNumber?: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onNewOrder, orderItems = [], tableNumber = '' }) => {
  const navigate = useNavigate();
  
  // Calculate the total price
  const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed!</h1>
        <p className="text-lg text-gray-600 mb-4">Your order has been sent to the kitchen. Thank you!</p>
        
        <Alert className="mb-6 bg-green-50 border-green-200 max-w-md mx-auto">
          <AlertTitle className="text-green-700 flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Order Confirmed
          </AlertTitle>
          <AlertDescription className="text-green-600">
            The kitchen has received your order and is preparing it now.
          </AlertDescription>
        </Alert>
        
        {orderItems.length > 0 && (
          <div className="max-w-md mx-auto mb-8 bg-white border rounded-md shadow-sm">
            <div className="border-b px-4 py-3 flex items-center">
              <Receipt className="h-4 w-4 mr-2 text-restaurant-burgundy" />
              <h3 className="font-medium">Your Receipt</h3>
            </div>
            <div className="p-4">
              {tableNumber && (
                <div className="text-sm text-center mb-2 text-gray-500">
                  Table: {tableNumber}
                </div>
              )}
              <div className="space-y-2 divide-y">
                {orderItems.map((item, index) => (
                  <div key={index} className="pt-2 first:pt-0">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </div>
                        {item.specialRequests && (
                          <div className="text-xs text-gray-500 italic">
                            Note: {item.specialRequests}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
          <Button 
            onClick={onNewOrder}
            className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
          >
            Place Another Order
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="border-restaurant-burgundy text-restaurant-burgundy hover:bg-restaurant-burgundy/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
