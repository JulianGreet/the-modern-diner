
import React from 'react';
import { Table, TableStatus } from '@/types/restaurant';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Users, User } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onClick: (tableId: number) => void;
}

const getStatusColor = (status: TableStatus): string => {
  switch (status) {
    case 'available':
      return 'bg-restaurant-available text-white';
    case 'occupied':
      return 'bg-restaurant-occupied text-white';
    case 'reserved':
      return 'bg-restaurant-reserved text-white';
    case 'cleaning':
      return 'bg-yellow-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusText = (status: TableStatus): string => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'occupied':
      return 'Occupied';
    case 'reserved':
      return 'Reserved';
    case 'cleaning':
      return 'Cleaning';
    default:
      return 'Unknown';
  }
};

const TableCard: React.FC<TableCardProps> = ({ table, onClick }) => {
  const cardSizeClass = 
    table.size === 'small' ? 'w-24 h-24' : 
    table.size === 'medium' ? 'w-32 h-32' : 
    table.size === 'large' ? 'w-40 h-40' : 
    'w-56 h-24'; // booth
    
  const isCombined = table.combinedWith && table.combinedWith.length > 0;
  
  return (
    <Card 
      className={cn(
        cardSizeClass,
        'flex flex-col justify-between cursor-pointer transition-all hover:shadow-md',
        table.status === 'occupied' && 'animate-pulse-subtle',
        isCombined && 'border-2 border-restaurant-gold'
      )}
      onClick={() => onClick(table.id)}
    >
      <CardContent className="p-3 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <span className="font-bold">{table.name}</span>
          <Badge variant="outline" className={cn('text-xs', getStatusColor(table.status))}>
            {getStatusText(table.status)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users size={14} className="mr-1" />
            <span>{table.capacity}</span>
          </div>
          
          {table.assignedServer && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User size={14} className="mr-1" />
              <span>Server #{table.assignedServer}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCard;
