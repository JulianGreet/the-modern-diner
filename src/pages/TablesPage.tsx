
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockTables, mockStaff } from '@/services/mockData';
import TableGrid from '@/components/tables/TableGrid';
import TableActionDialog from '@/components/tables/TableActionDialog';
import { Table, TableStatus } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleTableClick = (tableId: number) => {
    const table = tables.find(t => t.id === tableId) || null;
    setSelectedTable(table);
    setDialogOpen(true);
  };

  const handleUpdateTableStatus = (tableId: number, status: TableStatus) => {
    setTables(prev => 
      prev.map(table => 
        table.id === tableId 
          ? { ...table, status } 
          : table
      )
    );
    
    toast({
      title: `Table ${tables.find(t => t.id === tableId)?.name} Status Updated`,
      description: `Status changed to ${status}`,
    });
  };

  const handleAssignServer = (tableId: number, serverId: number) => {
    setTables(prev => 
      prev.map(table => 
        table.id === tableId 
          ? { ...table, assignedServer: serverId } 
          : table
      )
    );
    
    const serverName = mockStaff.find(s => s.id === serverId)?.name;
    const tableName = tables.find(t => t.id === tableId)?.name;
    
    toast({
      title: `Server Assigned`,
      description: `${serverName} has been assigned to Table ${tableName}`,
    });
  };

  const handleCreateOrder = (tableId: number) => {
    // In a real app, this would create a new order and assign it to the table
    // For now, we'll just update the table status to occupied
    setTables(prev => 
      prev.map(table => 
        table.id === tableId 
          ? { ...table, status: 'occupied', currentOrder: Math.floor(Math.random() * 1000) + 100 } 
          : table
      )
    );
    
    toast({
      title: `New Order Created`,
      description: `Order created for Table ${tables.find(t => t.id === tableId)?.name}`,
    });
  };

  // Count tables by status
  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;
  const cleaningTables = tables.filter(t => t.status === 'cleaning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Table Management</h1>
        <Button>Configure Floor Plan</Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-restaurant-available/10 border-restaurant-available">
          <div className="text-3xl font-bold text-restaurant-available">{availableTables}</div>
          <div className="text-sm text-muted-foreground">Available Tables</div>
        </Card>
        
        <Card className="p-4 bg-restaurant-occupied/10 border-restaurant-occupied">
          <div className="text-3xl font-bold text-restaurant-occupied">{occupiedTables}</div>
          <div className="text-sm text-muted-foreground">Occupied Tables</div>
        </Card>
        
        <Card className="p-4 bg-restaurant-reserved/10 border-restaurant-reserved">
          <div className="text-3xl font-bold text-restaurant-reserved">{reservedTables}</div>
          <div className="text-sm text-muted-foreground">Reserved Tables</div>
        </Card>
        
        <Card className="p-4 bg-yellow-500/10 border-yellow-500">
          <div className="text-3xl font-bold text-yellow-500">{cleaningTables}</div>
          <div className="text-sm text-muted-foreground">Cleaning Tables</div>
        </Card>
      </div>
      
      <TableGrid tables={tables} onTableClick={handleTableClick} />
      
      <TableActionDialog 
        table={selectedTable}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        servers={mockStaff}
        onUpdateTableStatus={handleUpdateTableStatus}
        onAssignServer={handleAssignServer}
        onCreateOrder={handleCreateOrder}
      />
    </div>
  );
};

export default TablesPage;
