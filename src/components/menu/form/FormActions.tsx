
import React from 'react';
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isEditing, 
  isLoading,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isEditing ? "Update Item" : "Create Item"}
      </Button>
    </div>
  );
};

export default FormActions;
