
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { menuFormSchema } from './menuFormSchema';

interface PreparationFieldsProps {
  form: UseFormReturn<z.infer<typeof menuFormSchema>>;
}

const PreparationFields: React.FC<PreparationFieldsProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="preparationTime"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Preparation Time (minutes)</FormLabel>
          <FormControl>
            <Input type="number" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PreparationFields;
