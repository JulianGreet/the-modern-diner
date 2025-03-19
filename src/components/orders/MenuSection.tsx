
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { formatPrice, getCourseTypeColor } from '@/components/menu/utils/menuUtils';
import { MenuItem } from '@/types/restaurant';

interface MenuSectionProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ menuItems, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase()?.includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory && item.available;
  });
  
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  
  return (
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
  );
};

export default MenuSection;
