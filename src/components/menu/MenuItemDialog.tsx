
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MenuForm from './MenuForm';
import { MenuItem } from '@/types/restaurant';

interface MenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: MenuItem | null;
  onClose: () => void;
}

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  isOpen,
  onOpenChange,
  editingItem,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {editingItem 
              ? "Update the details for this menu item." 
              : "Fill in the information to add a new menu item."}
          </DialogDescription>
        </DialogHeader>

        <MenuForm 
          initialData={editingItem || undefined} 
          onSuccess={onClose} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;
