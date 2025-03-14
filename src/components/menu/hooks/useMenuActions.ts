
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMenuItem } from '@/services/supabase/menuService';
import { useToast } from '@/hooks/use-toast';
import { useQueryErrorHandler } from '@/hooks/use-query-error-handler';
import { MenuItem } from '@/types/restaurant';

export const useMenuActions = () => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useQueryErrorHandler();

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Menu item deleted",
        description: "The menu item has been removed successfully."
      });
    },
    onError: (error) => handleError(error, "Delete menu item")
  });

  const handleDelete = (itemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      deleteMutation.mutate(itemId);
    }
  };

  const handleFormClose = () => {
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const handleAddItem = () => {
    setIsAddingItem(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  return {
    isAddingItem,
    editingItem,
    handleDelete,
    handleFormClose,
    handleAddItem,
    handleEditItem,
    isDialogOpen: isAddingItem || !!editingItem,
    setIsDialogOpen: (open: boolean) => {
      if (!open) handleFormClose();
    }
  };
};
