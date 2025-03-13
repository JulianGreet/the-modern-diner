
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStaff } from '@/services/mockData';
import TableGrid from '@/components/tables/TableGrid';
import TableActionDialog from '@/components/tables/TableActionDialog';
import { Table, TableStatus } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';
import { fetchTables, updateTableStatus, assignServerToTable, updateCurrentOrder } from '@/services/supabase/tableService';

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoading(true);
        const tablesData = await fetchTables();
        
        // Transform the data to match our frontend types
        const formattedTables = tablesData.map((table: any) => ({
          id: table.id,
          name: table.name,
          capacity: table.capacity,
          status: table.status,
          size: table.size,
          combinedWith: table.combined_with || null,
          assignedServer: table.assigned_server || null,
          currentOrder: table.current_order || null
        }));
        
        setTables(formattedTables);
      } catch (error) {
        console.error('Failed to load tables:', error);
        toast({
          title: 'Error Loading Tables',
          description: 'Could not load tables from the database.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, [toast]);

  const handleTableClick = (tableId: number) => {
    const table = tables.find(t => t.id === tableId) || null;
    setSelectedTable(table);
    setDialogOpen(true);
  };

  const handleUpdateTableStatus = async (tableId: number, status: TableStatus) => {
    try {
      await updateTableStatus(tableId, status);
      
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
    } catch (error) {
      console.error('Failed to update table status:', error);
      toast({
        title: 'Error Updating Table',
        description: 'Could not update table status.',
        variant: 'destructive'
      });
    }
  };

  const handleAssignServer = async (tableId: number, serverId: number) => {
    try {
      // Convert number to string as our database expects a UUID
      const serverUuid = mockStaff.find(s => s.id === serverId)?.id.toString() || null;
      await assignServerToTable(tableId, serverUuid);
      
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
    } catch (error) {
      console.error('Failed to assign server:', error);
      toast({
        title: 'Error Assigning Server',
        description: 'Could not assign server to table.',
        variant: 'destructive'
      });
    }
  };

  const handleCreateOrder = async (tableId: number) => {
    try {
      // In a real app, this would create a new order in the orders table
      // For now, we'll just update the table status to occupied and set a mock order ID
      const newOrderId = Math.floor(Math.random() * 1000) + 100;
      await updateCurrentOrder(tableId, newOrderId);
      await updateTableStatus(tableId, 'occupied');
      
      setTables(prev => 
        prev.map(table => 
          table.id === tableId 
            ? { ...table, status: 'occupied', currentOrder: newOrderId } 
            : table
        )
      );
      
      toast({
        title: `New Order Created`,
        description: `Order created for Table ${tables.find(t => t.id === tableId)?.name}`,
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      toast({
        title: 'Error Creating Order',
        description: 'Could not create a new order.',
        variant: 'destructive'
      });
    }
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
      
      {loading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading tables...</p>
        </div>
      ) : (
        <TableGrid tables={tables} onTableClick={handleTableClick} />
      )}
      
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
