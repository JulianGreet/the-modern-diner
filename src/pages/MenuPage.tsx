
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, PlusCircle, Trash } from 'lucide-react';
import { MenuItem } from '@/types/restaurant';
import { fetchMenuItems, deleteMenuItem } from '@/services/supabase/menuService';
import MenuForm from '@/components/menu/MenuForm';
import { useToast } from '@/hooks/use-toast';
import { useQueryErrorHandler } from '@/hooks/use-query-error-handler';

const MenuPage: React.FC = () => {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useQueryErrorHandler();

  const { data: menuItems = [], isLoading, error } = useQuery({
    queryKey: ['menuItems'],
    queryFn: fetchMenuItems
  });

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

  const getCourseTypeColor = (courseType: string) => {
    switch (courseType) {
      case 'appetizer':
        return 'bg-amber-500';
      case 'main':
        return 'bg-blue-500';
      case 'dessert':
        return 'bg-pink-500';
      case 'drink':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading menu data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading menu data</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <Button onClick={() => setIsAddingItem(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {menuItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No menu items found. Start by adding your first item.</p>
            <Button onClick={() => setIsAddingItem(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Menu Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category} className="mb-6">
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>{items.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Course Type</TableHead>
                    <TableHead>Prep Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge className={getCourseTypeColor(item.courseType)}>
                          {item.courseType.charAt(0).toUpperCase() + item.courseType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.preparationTime} min</TableCell>
                      <TableCell>{formatPrice(item.price)}</TableCell>
                      <TableCell>
                        <Badge variant={item.available ? "default" : "outline"}>
                          {item.available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))
      )}

      {/* Menu Item Add/Edit Dialog */}
      <Dialog 
        open={isAddingItem || !!editingItem} 
        onOpenChange={(open) => {
          if (!open) handleFormClose();
        }}
      >
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
            onSuccess={handleFormClose} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuPage;
