
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { menuFormSchema } from './menuFormSchema';

interface CourseTypeSelectProps {
  form: UseFormReturn<z.infer<typeof menuFormSchema>>;
}

const CourseTypeSelect: React.FC<CourseTypeSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="courseType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Course Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select course type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="appetizer">Appetizer</SelectItem>
              <SelectItem value="main">Main Course</SelectItem>
              <SelectItem value="dessert">Dessert</SelectItem>
              <SelectItem value="drink">Drink</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CourseTypeSelect;
