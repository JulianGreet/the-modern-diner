'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createPublicOrder } from '@/services/supabase/publicOrderService';
import { MenuItem, CourseType } from '@/types/restaurant';
import { supabase } from '@/integrations/supabase/client';

interface DBMenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  course_type: string;
  preparation_time: number;
  available: boolean;
  restaurant_id: string;
}

export default function PublicOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    async function loadMenuItems() {
      try {
        const { restaurantId } = params;
        
        if (!restaurantId || Array.isArray(restaurantId)) {
          setError('Invalid URL parameters');
          return;
        }

        const { data, error } = await supabase
          .from('menu_items')
          .select('id, name, description, price, category, course_type, preparation_time, available, restaurant_id')
          .eq('restaurant_id', restaurantId)
          .eq('available', true);

        if (error) throw error;

        // Transform the data to match MenuItem type
        const transformedItems: MenuItem[] = (data as DBMenuItem[] || []).map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category,
          courseType: item.course_type as CourseType,
          preparationTime: item.preparation_time,
          available: item.available
        }));

        setMenuItems(transformedItems);
      } catch (err) {
        console.error('Error loading menu items:', err);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    }

    loadMenuItems();
  }, [params]);

  const handleQuantityChange = (itemId: number, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      const { restaurantId, tableId } = params;
      
      if (!restaurantId || !tableId) {
        setError('Invalid URL parameters');
        return;
      }

      const orderItems = Object.entries(selectedItems)
        .filter(([_, quantity]) => quantity > 0)
        .map(([itemId, quantity]) => ({
          menuItemId: parseInt(itemId),
          quantity
        }));

      if (orderItems.length === 0) {
        setError('Please select at least one item');
        return;
      }

      const result = await createPublicOrder({
        tableId: parseInt(tableId as string),
        restaurantId: restaurantId as string,
        items: orderItems
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to place order');
      }

      // Redirect to order confirmation
      router.push(`/order/${restaurantId}/${tableId}/confirmation/${result.orderId}`);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId));
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Place Your Order</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
          <div className="space-y-4">
            {menuItems.map(item => (
              <div key={item.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <p className="text-green-600 font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, (selectedItems[item.id] || 0) - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{selectedItems[item.id] || 0}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, (selectedItems[item.id] || 0) + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border p-4 rounded-lg">
            <div className="space-y-2">
              {Object.entries(selectedItems)
                .filter(([_, quantity]) => quantity > 0)
                .map(([itemId, quantity]) => {
                  const item = menuItems.find(item => item.id === parseInt(itemId));
                  return (
                    <div key={itemId} className="flex justify-between">
                      <span>{item?.name} x {quantity}</span>
                      <span>${((item?.price || 0) * quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={Object.values(selectedItems).every(qty => qty === 0)}
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 