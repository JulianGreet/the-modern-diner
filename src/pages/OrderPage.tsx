
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/supabase/menuService';
import { getTableById } from '@/services/supabase/tableService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Utensils, Search, Plus, Minus, ShoppingCart } from 'lucide-react';
import { formatPrice, getCourseTypeColor } from '@/components/menu/utils/menuUtils';
import { MenuItem, Table } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

interface CartItem extends MenuItem {
  quantity: number;
  specialRequests: string;
}

const OrderPage: React.FC = () => {
  const { restaurantId, tableId } = useParams<{ restaurantId: string; tableId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [table, setTable] = useState<Table | null>(null);
  const { toast } = useToast();
  
  // Fetch menu items
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });

  // Fetch table information
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
  
  // Filter menu items by search term and category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory && item.available;
  });
  
  // Get unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  
  // Add item to cart
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
  
  // Update item quantity in cart
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
  
  // Update special requests for an item
  const updateSpecialRequests = (itemId: number, requests: string) => {
    setCart(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, specialRequests: requests } 
          : item
      )
    );
  };
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Place order
  const placeOrder = async () => {
    try {
      // Here you would implement the order submission logic
      // For now, we'll just show a success toast
      
      toast({
        title: 'Order Placed Successfully',
        description: `Your order for Table ${table?.name} has been sent to the kitchen.`,
      });
      
      // Clear cart after successful order
      setCart([]);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast({
        title: 'Error Placing Order',
        description: 'Could not place your order. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Place Your Order</h1>
        {table && (
          <p className="text-lg text-gray-600 mt-2">
            Table {table.name} • Seats {table.capacity}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-medium">Menu</h3>
              
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="Search menu..." 
                  className="pl-8 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <div className="border-b px-4">
                <TabsList className="bg-transparent h-12">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="data-[state=active]:bg-restaurant-burgundy/10 data-[state=active]:text-restaurant-burgundy data-[state=active]:shadow-none capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              <TabsContent value={activeCategory} className="p-0 mt-0">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No items match your search" : "No menu items found in this category"}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredItems.map(item => (
                      <div key={item.id} className="p-4 flex items-center hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">
                                {formatPrice(item.price)}
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`${getCourseTypeColor(item.courseType)} text-xs capitalize`}
                              >
                                {item.courseType}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex justify-end">
                            <Button 
                              size="sm" 
                              className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" />
                              Add to Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div>
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
                    onClick={() => setCart([])}
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
                    >
                      <Utensils className="mr-2 h-4 w-4" />
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
