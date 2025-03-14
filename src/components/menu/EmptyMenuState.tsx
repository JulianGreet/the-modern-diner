
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyMenuStateProps {
  onAddItem: () => void;
}

const EmptyMenuState: React.FC<EmptyMenuStateProps> = ({ onAddItem }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground mb-4">No menu items found. Start by adding your first item.</p>
        <Button onClick={onAddItem}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Your First Menu Item
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyMenuState;
