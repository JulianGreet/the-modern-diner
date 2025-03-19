
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Utensils } from 'lucide-react';
import { formatPrice } from '@/components/menu/utils/menuUtils';
import { MenuItem } from '@/types/restaurant';

interface CartItem extends MenuItem {
  quantity: number;
  specialRequests: string;
}

interface CartSectionProps {
  cart: CartItem[];
  updateQuantity: (itemId: number, change: number) => void;
  updateSpecialRequests: (itemId: number, requests: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
  isPlacingOrder: boolean;
}

const CartSection: React.FC<CartSectionProps> = ({ 
  cart, 
  updateQuantity, 
  updateSpecialRequests, 
  clearCart,
  placeOrder,
  isPlacingOrder
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Your Order
          </h3>
          {cart.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={clearCart}
            >
              Clear All
            </Button>
          )}
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Your order is empty. Add items from the menu.
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="border-b pb-4">
                <div className="flex justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <span className="text-sm">{formatPrice(item.price)} each</span>
                </div>
                
                <div className="mt-2">
                  <Input 
                    type="text"
                    placeholder="Special requests..."
                    className="text-sm h-8"
                    value={item.specialRequests}
                    onChange={(e) => updateSpecialRequests(item.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <Button 
                className="w-full mt-4 bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                onClick={placeOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Utensils className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartSection;
