import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableStatus } from '@/types/restaurant';
import { Staff } from '@/types/restaurant';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Utensils, Ban, CheckCircle2 } from 'lucide-react';

interface TableActionDialogProps {
  table: Table | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servers: Staff[];
  onUpdateTableStatus: (tableId: number, status: TableStatus) => void;
  onAssignServer: (tableId: number, serverId: string) => void;
  onCreateOrder: (tableId: number) => void;
}

const TableActionDialog: React.FC<TableActionDialogProps> = ({
  table,
  open,
  onOpenChange,
  servers,
  onUpdateTableStatus,
  onAssignServer,
  onCreateOrder
}) => {
  if (!table) return null;

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-500">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-500">Reserved</Badge>;
      case 'cleaning':
        return <Badge className="bg-yellow-500">Cleaning</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'occupied':
        return <Users className="h-5 w-5 text-red-500" />;
      case 'reserved':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'cleaning':
        return <Ban className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const assignedServer = servers.find(s => s.id === table.assignedServer);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Table {table.name}</span>
            {getStatusBadge(table.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">Capacity</Label>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{table.capacity} people</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <div className="flex items-center gap-1">
                {getStatusIcon(table.status)}
                <span className="capitalize">{table.status}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-sm text-muted-foreground">Assigned Server</Label>
            {table.status !== 'cleaning' ? (
              <Select
                defaultValue={table.assignedServer || ''}
                onValueChange={(value) => onAssignServer(table.id, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign a server" />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((server) => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-muted-foreground">Cannot assign server while table is being cleaned</div>
            )}
          </div>

          {table.status === 'available' && (
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">Actions</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onUpdateTableStatus(table.id, 'reserved')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Reserve
                </Button>
                <Button 
                  className="flex-1 bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                  onClick={() => onCreateOrder(table.id)}
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </div>
            </div>
          )}

          {table.status === 'occupied' && (
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">Current Order</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  View Order #{table.currentOrder}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onUpdateTableStatus(table.id, 'cleaning')}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Mark as Cleaning
                </Button>
              </div>
            </div>
          )}

          {table.status === 'reserved' && (
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">Actions</Label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onUpdateTableStatus(table.id, 'available')}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Available
                </Button>
                <Button 
                  className="flex-1 bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                  onClick={() => onCreateOrder(table.id)}
                >
                  <Utensils className="mr-2 h-4 w-4" />
                  Seat Guests
                </Button>
              </div>
            </div>
          )}

          {table.status === 'cleaning' && (
            <div className="flex flex-col gap-1">
              <Label className="text-sm text-muted-foreground">Actions</Label>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onUpdateTableStatus(table.id, 'available')}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Available
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableActionDialog;
