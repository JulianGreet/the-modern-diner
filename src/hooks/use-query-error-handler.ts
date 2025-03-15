
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
