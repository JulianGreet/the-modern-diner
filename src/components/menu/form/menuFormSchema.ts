
import { z } from "zod";

export const menuFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
  category: z.string().min(1, { message: "Category is required." }),
  courseType: z.enum(["appetizer", "main", "dessert", "drink"]),
  preparationTime: z.coerce.number().min(0, { message: "Preparation time cannot be negative." }),
  available: z.boolean(),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;
