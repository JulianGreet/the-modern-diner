
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { BadgeInfo, MoreVertical, PlusCircle, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Staff } from '@/types/restaurant';
import { fetchStaff, deleteStaff } from '@/services/supabase/staffService';
import StaffForm from '@/components/staff/StaffForm';
import { useToast } from '@/hooks/use-toast';

const StaffPage: React.FC = () => {
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: staff = [], isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Staff member deleted",
        description: "The staff member has been removed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete staff member.",
        variant: "destructive"
      });
      console.error("Delete error:", error);
    }
  });

  const handleDelete = (staffId: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      deleteMutation.mutate(staffId);
    }
  };

  const handleFormClose = () => {
    setIsAddingStaff(false);
    setEditingStaff(null);
    queryClient.invalidateQueries({ queryKey: ['staff'] });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-red-500';
      case 'admin':
        return 'bg-purple-500';
      case 'server':
        return 'bg-blue-500';
      case 'host':
        return 'bg-green-500';
      case 'kitchen':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading staff data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading staff data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={() => setIsAddingStaff(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff List</CardTitle>
          <CardDescription>Manage your restaurant staff and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No staff members found. Add your first staff member to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Tables</TableHead>
                  <TableHead>Active Orders</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.assignedTables.length > 0 ? 
                        member.assignedTables.map(table => `#${table}`).join(', ') : 
                        <span className="text-muted-foreground">None</span>
                      }
                    </TableCell>
                    <TableCell>
                      {member.activeOrders.length > 0 ? 
                        member.activeOrders.length : 
                        <span className="text-muted-foreground">None</span>
                      }
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
                            onClick={() => setEditingStaff(member)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(member.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Staff Add/Edit Dialog */}
      <Dialog 
        open={isAddingStaff || !!editingStaff} 
        onOpenChange={(open) => {
          if (!open) handleFormClose();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
            </DialogTitle>
            <DialogDescription>
              {editingStaff 
                ? "Update the details for this staff member." 
                : "Fill in the information to add a new staff member."}
            </DialogDescription>
          </DialogHeader>

          <StaffForm 
            initialData={editingStaff || undefined} 
            onSuccess={handleFormClose} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;
