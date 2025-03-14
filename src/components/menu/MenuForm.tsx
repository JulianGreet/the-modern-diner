
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { MenuItem } from "@/types/restaurant";
import { createMenuItem, updateMenuItem } from "@/services/supabase/menuService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryErrorHandler } from "@/hooks/use-query-error-handler";
import { menuFormSchema, MenuFormValues } from './form/menuFormSchema';
import BasicInfoFields from './form/BasicInfoFields';
import PricingFields from './form/PricingFields';
import CourseTypeSelect from './form/CourseTypeSelect';
import PreparationFields from './form/PreparationFields';
import AvailabilityToggle from './form/AvailabilityToggle';
import FormActions from './form/FormActions';

interface MenuFormProps {
  initialData?: MenuItem;
  onSuccess: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({ initialData, onSuccess }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { handleError } = useQueryErrorHandler();
  const isEditing = !!initialData;

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      price: initialData.price,
      category: initialData.category,
      courseType: initialData.courseType,
      preparationTime: initialData.preparationTime,
      available: initialData.available,
    } : {
      name: "",
      description: "",
      price: 0,
      category: "",
      courseType: "main",
      preparationTime: 15,
      available: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: MenuFormValues) => {
      // Ensure all required fields are present
      return createMenuItem({
        name: data.name,
        description: data.description || '',
        price: data.price,
        category: data.category,
        courseType: data.courseType,
        preparationTime: data.preparationTime,
        available: data.available
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Menu item created",
        description: "The menu item has been added successfully."
      });
      onSuccess();
    },
    onError: (error) => handleError(error, "Create menu item")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<MenuFormValues>) => 
      updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Menu item updated",
        description: "The menu item has been updated successfully."
      });
      onSuccess();
    },
    onError: (error) => handleError(error, "Update menu item")
  });

  const onSubmit = async (values: MenuFormValues) => {
    if (isEditing && initialData) {
      updateMutation.mutate({ id: initialData.id, ...values });
    } else {
      createMutation.mutate(values);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields form={form} />
        <PricingFields form={form} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CourseTypeSelect form={form} />
          <PreparationFields form={form} />
        </div>
        
        <AvailabilityToggle form={form} />
        
        <FormActions 
          isEditing={isEditing} 
          isLoading={isLoading}
          onCancel={onSuccess} 
        />
      </form>
    </Form>
  );
};

export default MenuForm;
