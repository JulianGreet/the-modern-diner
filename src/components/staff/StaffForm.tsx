
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Staff, UserRole } from "@/types/restaurant";
import { createStaffMember, updateStaff } from "@/services/supabase/staffService";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.enum(["host", "server", "kitchen", "manager", "admin"]),
});

interface StaffFormProps {
  initialData?: Staff;
  onSuccess: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ initialData, onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      role: initialData.role,
    } : {
      name: "",
      role: "server",
    },
  });

  const createMutation = useMutation({
    mutationFn: createStaffMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Staff member created",
        description: `Staff member has been added successfully.`,
      });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Staff) => updateStaff(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Staff member updated",
        description: `Staff member has been updated successfully.`,
      });
      onSuccess();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && initialData) {
        await updateMutation.mutate({
          ...initialData,
          ...values,
        });
      } else {
        await createMutation.mutate({
          name: values.name,
          role: values.role,
          assignedTables: [],
          activeOrders: []
        });
      }
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast({
        title: "Error",
        description: "There was an error saving the staff member.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter staff name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="host">Host</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? "Update Staff" : "Add Staff"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffForm;
