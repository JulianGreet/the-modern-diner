
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableSize, TableStatus } from '@/types/restaurant';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tableFormSchema = z.object({
  name: z.string().min(1, 'Table name is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  size: z.enum(['small', 'medium', 'large', 'booth'] as const),
  status: z.enum(['available', 'occupied', 'reserved', 'cleaning'] as const).default('available'),
});

type TableFormValues = z.infer<typeof tableFormSchema>;

interface AddTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTable: (tableData: TableFormValues) => Promise<void>;
}

const AddTableDialog: React.FC<AddTableDialogProps> = ({
  open,
  onOpenChange,
  onAddTable
}) => {
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      name: '',
      capacity: 2,
      size: 'medium',
      status: 'available',
    }
  });

  const onSubmit = async (values: TableFormValues) => {
    await onAddTable(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Table 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select table size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="booth">Booth</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
                Add Table
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableDialog;
