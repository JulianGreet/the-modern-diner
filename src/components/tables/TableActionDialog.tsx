
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Table, Staff, TableStatus } from '@/types/restaurant';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Timer,
  ClipboardCheck,
  AlertCircle,
  UserCheck,
  Utensils
} from 'lucide-react';

interface TableActionDialogProps {
  table: Table | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servers: Staff[];
  onUpdateTableStatus: (tableId: number, status: TableStatus) => void;
  onAssignServer: (tableId: number, serverId: number) => void;
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
  const [activeTab, setActiveTab] = useState('info');
  const [selectedServerId, setSelectedServerId] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState('');
  
  if (!table) return null;
  
  const availableServers = servers.filter(server => server.role === 'server');
  
  const handleStatusChange = (status: TableStatus) => {
    if (table) {
      onUpdateTableStatus(table.id, status);
    }
  };
  
  const handleServerAssign = () => {
    if (table && selectedServerId) {
      onAssignServer(table.id, parseInt(selectedServerId));
      setSelectedServerId('');
    }
  };
  
  const handleCreateOrder = () => {
    if (table) {
      onCreateOrder(table.id);
      onOpenChange(false);
    }
  };
  
  const assignedServer = table.assignedServer 
    ? servers.find(s => s.id === table.assignedServer)
    : null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Table {table.name}</span>
            <Badge className={
              table.status === 'available' ? 'bg-restaurant-available' :
              table.status === 'occupied' ? 'bg-restaurant-occupied' :
              table.status === 'reserved' ? 'bg-restaurant-reserved' :
              'bg-yellow-500'
            }>
              {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="order">Order</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity</label>
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-muted-foreground" />
                  <span>{table.capacity} people</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <span className="capitalize">{table.size}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned Server</label>
              {assignedServer ? (
                <div className="flex items-center">
                  <UserCheck size={16} className="mr-2 text-restaurant-success" />
                  <span>{assignedServer.name}</span>
                </div>
              ) : (
                <div className="flex items-center text-muted-foreground">
                  <AlertCircle size={16} className="mr-2" />
                  <span>No server assigned</span>
                </div>
              )}
            </div>
            
            {table.currentOrder && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Order</label>
                <div className="flex items-center">
                  <ClipboardCheck size={16} className="mr-2 text-restaurant-burgundy" />
                  <span>Order #{table.currentOrder}</span>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="status" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Change Status</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={table.status === 'available' ? 'default' : 'outline'}
                  className={table.status === 'available' ? 'bg-restaurant-available' : ''}
                  onClick={() => handleStatusChange('available')}
                >
                  Available
                </Button>
                <Button 
                  variant={table.status === 'reserved' ? 'default' : 'outline'}
                  className={table.status === 'reserved' ? 'bg-restaurant-reserved' : ''}
                  onClick={() => handleStatusChange('reserved')}
                >
                  Reserved
                </Button>
                <Button 
                  variant={table.status === 'occupied' ? 'default' : 'outline'}
                  className={table.status === 'occupied' ? 'bg-restaurant-occupied' : ''}
                  onClick={() => handleStatusChange('occupied')}
                >
                  Occupied
                </Button>
                <Button 
                  variant={table.status === 'cleaning' ? 'default' : 'outline'}
                  className={table.status === 'cleaning' ? 'bg-yellow-500' : ''}
                  onClick={() => handleStatusChange('cleaning')}
                >
                  Cleaning
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Server</label>
              <div className="flex space-x-2">
                <Select value={selectedServerId} onValueChange={setSelectedServerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select server" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServers.map(server => (
                      <SelectItem key={server.id} value={server.id.toString()}>
                        {server.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleServerAssign} disabled={!selectedServerId}>
                  Assign
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Special Notes</label>
              <Textarea 
                placeholder="Add any special notes for this table"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="order" className="space-y-4 pt-4">
            {table.currentOrder ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClipboardCheck size={20} className="mr-2 text-restaurant-burgundy" />
                    <span className="text-lg font-medium">Order #{table.currentOrder}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Actions</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">
                      <Timer size={16} className="mr-2" />
                      Check Status
                    </Button>
                    <Button variant="outline">
                      <Utensils size={16} className="mr-2" />
                      Add Items
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted rounded-md p-4 text-center">
                  <p className="mb-2">No active order for this table</p>
                  <Button onClick={handleCreateOrder}>
                    Create New Order
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
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
