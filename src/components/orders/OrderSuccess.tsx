
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Receipt, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/components/menu/utils/menuUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  specialRequests?: string;
}

interface OrderSuccessProps {
  onNewOrder: () => void;
  orderItems?: OrderItem[];
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onNewOrder, orderItems = [] }) => {
  const navigate = useNavigate();
  
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <ShoppingBag className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed!</h1>
        <p className="text-lg text-gray-600 mb-8">Your order has been sent to the kitchen. Thank you!</p>
        
        <Alert className="bg-green-50 border-green-200 mb-8 max-w-md mx-auto">
          <AlertTitle className="text-green-800 font-medium">Order Confirmed</AlertTitle>
          <AlertDescription className="text-green-700">
            Your order has been received and is being prepared. You'll be notified when it's ready.
          </AlertDescription>
        </Alert>
      </div>
      
      {orderItems.length > 0 && (
        <Card className="mb-8 max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Order Receipt
              </h2>
            </div>
            
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity} x {formatPrice(item.price)}
                      </div>
                      {item.specialRequests && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="italic">"{item.specialRequests}"</span>
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
  );
};

export default OrderSuccess;
