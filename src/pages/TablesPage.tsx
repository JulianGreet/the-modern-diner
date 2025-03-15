import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStaff } from '@/services/mockData';
import TableGrid from '@/components/tables/TableGrid';
import TableActionDialog from '@/components/tables/TableActionDialog';
import AddTableDialog from '@/components/tables/AddTableDialog';
import TableQRCode from '@/components/tables/TableQRCode';
import { Table, TableStatus, TableSize } from '@/types/restaurant';
import { useToast } from '@/hooks/use-toast';
import { fetchTables, updateTableStatus, assignServerToTable, updateCurrentOrder, createTable, deleteTable } from '@/services/supabase/tableService';
import { LayoutGrid, Users, Circle, Ban, Clock, Plus, QrCode, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TablesPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoading(true);
        const tablesData = await fetchTables();
        
        const formattedTables = tablesData.map((table: any) => ({
          id: table.id,
          name: table.name,
          capacity: table.capacity,
          status: table.status as TableStatus,
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

  const handleAssignServer = async (tableId: number, serverId: string) => {
    try {
      await assignServerToTable(tableId, serverId);
      
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

  const handleAddTable = async (tableData: any) => {
    try {
      const newTable = {
        ...tableData,
        combinedWith: null,
        assignedServer: null,
        currentOrder: null
      };
      
      const createdTable = await createTable(newTable);
      
      setTables(prev => [...prev, {
        id: createdTable.id,
        name: createdTable.name,
        capacity: createdTable.capacity,
        status: createdTable.status as TableStatus,
        size: createdTable.size as TableSize,
        combinedWith: null,
        assignedServer: null,
        currentOrder: null
      }]);
      
      toast({
        title: 'Table Added',
        description: `${createdTable.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Failed to add table:', error);
      toast({
        title: 'Error Adding Table',
        description: 'Could not add a new table.',
        variant: 'destructive'
      });
    }
  };

  const handleShowQRCode = (tableId: number) => {
    const table = tables.find(t => t.id === tableId) || null;
    setSelectedTable(table);
    setQrDialogOpen(true);
  };

  const handleDeleteTable = async (tableId: number) => {
    try {
      await deleteTable(tableId);
      
      setTables(prev => prev.filter(table => table.id !== tableId));
      
      toast({
        title: 'Table Deleted',
        description: `Table has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Failed to delete table:', error);
      toast({
        title: 'Error Deleting Table',
        description: 'Could not delete the table.',
        variant: 'destructive'
      });
    }
  };

  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;
  const cleaningTables = tables.filter(t => t.status === 'cleaning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-gray-700">Table Overview</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Table
          </Button>
          <Button className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
            Configure Floor Plan
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <Circle className="h-6 w-6 text-green-600 fill-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{availableTables}</div>
              <div className="text-sm text-green-700">Available Tables</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-2 mr-3">
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{occupiedTables}</div>
              <div className="text-sm text-red-700">Occupied Tables</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{reservedTables}</div>
              <div className="text-sm text-blue-700">Reserved Tables</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-2 mr-3">
              <Ban className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{cleaningTables}</div>
              <div className="text-sm text-yellow-700">Cleaning Tables</div>
            </div>
          </div>
        </Card>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading tables...</p>
        </div>
      ) : (
        <TableGrid 
          tables={tables} 
          onTableClick={handleTableClick} 
          onShowQRCode={handleShowQRCode}
          onDeleteTable={handleDeleteTable}
        />
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
      
      <AddTableDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddTable={handleAddTable}
      />
      
      <TableQRCode
        table={selectedTable}
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        restaurantId={user?.id}
      />
    </div>
  );
};

export default TablesPage;
