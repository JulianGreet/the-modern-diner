
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface OrderSuccessProps {
  onNewOrder: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onNewOrder }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed!</h1>
        <p className="text-lg text-gray-600 mb-8">Your order has been sent to the kitchen. Thank you!</p>
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
