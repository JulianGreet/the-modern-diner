
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface MenuHeaderProps {
  onAddItem: () => void;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({ onAddItem }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Menu Management</h1>
      <Button onClick={onAddItem}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
};

export default MenuHeader;
