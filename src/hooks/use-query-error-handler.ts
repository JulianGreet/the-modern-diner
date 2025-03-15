
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

// For backward compatibility with existing code
export const queryErrorHandler = (error: Error) => {
  console.error("Query error:", error);
  // This function will be used as a fallback for existing code
  // The useQueryErrorHandler hook should be preferred going forward
};
