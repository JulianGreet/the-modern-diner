
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuItems } from '@/services/supabase/menuService';
import { MenuItem } from '@/types/restaurant';
import { useMenuActions } from '@/components/menu/hooks/useMenuActions';
import { formatPrice, getCourseTypeColor, groupItemsByCategory } from '@/components/menu/utils/menuUtils';
import MenuHeader from '@/components/menu/MenuHeader';
import EmptyMenuState from '@/components/menu/EmptyMenuState';
import CategoryMenuCard from '@/components/menu/CategoryMenuCard';
import MenuItemDialog from '@/components/menu/MenuItemDialog';

const MenuPage: React.FC = () => {
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

  if (isLoading) {
    return <div className="text-center p-8">Loading menu data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading menu data</div>;
  }

  // Group menu items by category
  const groupedItems = groupItemsByCategory<MenuItem>(menuItems);

  return (
    <div className="space-y-6">
      <MenuHeader onAddItem={handleAddItem} />

      {menuItems.length === 0 ? (
        <EmptyMenuState onAddItem={handleAddItem} />
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <CategoryMenuCard
            key={category}
            category={category}
            items={items}
            onEdit={handleEditItem}
            onDelete={handleDelete}
            formatPrice={formatPrice}
            getCourseTypeColor={getCourseTypeColor}
          />
        ))
      )}

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
