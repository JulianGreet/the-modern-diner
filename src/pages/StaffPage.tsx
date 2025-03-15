
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Pencil, Plus, Trash2, UserPlus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserRole, Staff } from "@/types/restaurant";
import { fetchStaff, createStaffMember, updateStaff, deleteStaff } from "@/services/supabase/staffService";
import StaffForm from '@/components/staff/StaffForm';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useQueryErrorHandler } from '@/hooks/use-query-error-handler';
import { useToast } from '@/hooks/use-toast';

function StaffPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const queryClient = useQueryClient();
  const { handleError } = useQueryErrorHandler();
  const { toast } = useToast();

  const { data: staff, isLoading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff,
  });

  const createMutation = useMutation({
    mutationFn: createStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setIsOpen(false);
      toast({
        title: "Staff member added",
        description: "New staff member has been added successfully.",
      });
    },
    onError: (error) => handleError(error as Error, "Create staff member"),
  });

  const updateMutation = useMutation({
    mutationFn: (staff: Staff) => updateStaff(staff.id, staff),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setIsOpen(false);
      toast({
        title: "Staff updated",
        description: "Staff member has been updated successfully.",
      });
    },
    onError: (error) => handleError(error as Error, "Update staff member"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Staff removed",
        description: "Staff member has been removed successfully.",
      });
    },
    onError: (error) => handleError(error as Error, "Delete staff member"),
  });

  const handleAddStaff = () => {
    setSelectedStaff(undefined);
    setIsOpen(true);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsOpen(true);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      deleteMutation.mutate(staffId);
    }
  };

  const handleFormSubmit = () => {
    setIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ['staff'] });
  };

  const filteredStaff = staff?.filter(
    s => selectedRole === 'all' || s.role === selectedRole
  );

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'manager': return "bg-blue-500";
      case 'server': return "bg-green-500";
      case 'host': return "bg-purple-500";
      case 'kitchen': return "bg-orange-500";
      case 'admin': return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load staff members. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button onClick={handleAddStaff}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setSelectedRole(value as UserRole | 'all')}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="manager">Managers</TabsTrigger>
          <TabsTrigger value="server">Servers</TabsTrigger>
          <TabsTrigger value="host">Hosts</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedRole}>
          {filteredStaff && filteredStaff.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Assigned Tables</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staffMember) => (
                    <TableRow key={staffMember.id}>
                      <TableCell className="font-medium">{staffMember.name}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(staffMember.role)}>
                          {staffMember.role.charAt(0).toUpperCase() + staffMember.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {staffMember.assignedTables && staffMember.assignedTables.length > 0 
                          ? staffMember.assignedTables.join(', ') 
                          : 'None'}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditStaff(staffMember)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500" onClick={() => handleDeleteStaff(staffMember.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <p className="mb-2 text-muted-foreground">No staff members found</p>
                <Button variant="outline" onClick={handleAddStaff}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>{selectedStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <StaffForm 
            initialData={selectedStaff} 
            onSuccess={handleFormSubmit} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StaffPage;
