
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/supabase/menuService';
import { MenuItem } from '@/types/restaurant';
import { useMenuActions } from '@/components/menu/hooks/useMenuActions';
import { formatPrice, getCourseTypeColor, groupItemsByCategory } from '@/components/menu/utils/menuUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MenuItemDialog from '@/components/menu/MenuItemDialog';

const MenuPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const { 
    isAddingItem,
    editingItem,
    handleDelete,
    handleFormClose,
    handleAddItem,
    handleEditItem,
    isDialogOpen,
    setIsDialogOpen
  } = useMenuActions();

  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });

  // Filter menu items by search term and category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  if (isLoading) {
    return <div className="text-center p-8">Loading menu data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading menu data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-gray-700">Menu Management</h2>
            <p className="text-sm text-gray-500">Create and manage your restaurant menu</p>
          </div>
          <Button className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90" onClick={handleAddItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="border-b p-4 flex justify-between items-center">
          <h3 className="font-medium">Menu Items</h3>
          
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search items..." 
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
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      {/* Replace with actual image when available */}
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <BarChart3 size={24} />
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            {formatPrice(item.price)}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getCourseTypeColor(item.course_type)} text-xs capitalize`}
                          >
                            {item.course_type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-500">
                          <span className={item.available ? "text-green-600" : "text-gray-500"}>
                            {item.available ? "Available" : "Unavailable"}
                          </span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span>Prep time: {item.preparation_time} mins</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50" 
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <MenuItemDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingItem={editingItem}
        onClose={handleFormClose}
      />
    </div>
  );
};

export default MenuPage;
