
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { menuFormSchema } from './menuFormSchema';

interface AvailabilityToggleProps {
  form: UseFormReturn<z.infer<typeof menuFormSchema>>;
}

const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="available"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Available</FormLabel>
            <div className="text-sm text-muted-foreground">
              Item will be available for ordering
            </div>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default AvailabilityToggle;
