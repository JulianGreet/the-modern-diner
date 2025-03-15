
import { useToast } from "@/hooks/use-toast";

export function useQueryErrorHandler() {
  const { toast } = useToast();
  
  const handleError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    toast({
      title: "Error",
      description: `Failed to ${context.toLowerCase()}: ${error.message || "Unknown error"}`,
      variant: "destructive",
    });
  };
  
  return { handleError };
}

// For global error handling without requiring the hook in component context
export const queryErrorHandler = (error: Error) => {
  console.error("Query error:", error);
  
  // Since we're outside a component context, we need to import and call toast directly
  const { toast } = useToast();
  toast({
    title: "Error",
    description: `An error occurred: ${error.message || "Unknown error"}`,
    variant: "destructive",
  });
};
