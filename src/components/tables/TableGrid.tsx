
import React from 'react';
import { Table } from '@/types/restaurant';
import TableCard from './TableCard';
import { Button } from '@/components/ui/button';
import { QrCode, Trash2 } from 'lucide-react';

interface TableGridProps {
  tables: Table[];
  onTableClick: (tableId: number) => void;
  onShowQRCode: (tableId: number) => void;
  onDeleteTable: (tableId: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ 
  tables, 
  onTableClick,
  onShowQRCode,
  onDeleteTable
}) => {
  // Group tables by size for better layout
  const smallTables = tables.filter(table => table.size === 'small');
  const mediumTables = tables.filter(table => table.size === 'medium');
  const largeTables = tables.filter(table => table.size === 'large');
  const boothTables = tables.filter(table => table.size === 'booth');
  
  const TableActions = ({ tableId }: { tableId: number }) => (
    <div className="flex justify-end gap-1 mt-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={(e) => {
          e.stopPropagation();
          onShowQRCode(tableId);
        }}
      >
        <QrCode className="h-3.5 w-3.5" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600" 
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Are you sure you want to delete this table?')) {
            onDeleteTable(tableId);
          }
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {boothTables.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">Booths</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {boothTables.map(table => (
              <div key={table.id} className="flex flex-col">
                <TableCard table={table} onClick={onTableClick} />
                <TableActions tableId={table.id} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {largeTables.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-3">Large Tables</h3>
            <div className="grid grid-cols-2 gap-4">
              {largeTables.map(table => (
                <div key={table.id} className="flex flex-col">
                  <TableCard table={table} onClick={onTableClick} />
                  <TableActions tableId={table.id} />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {mediumTables.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-3">Medium Tables</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mediumTables.map(table => (
                <div key={table.id} className="flex flex-col">
                  <TableCard table={table} onClick={onTableClick} />
                  <TableActions tableId={table.id} />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {smallTables.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-3">Small Tables</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {smallTables.map(table => (
                <div key={table.id} className="flex flex-col">
                  <TableCard table={table} onClick={onTableClick} />
                  <TableActions tableId={table.id} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      
      {tables.length === 0 && (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
          <p className="text-muted-foreground">No tables found. Create your first table!</p>
        </div>
      )}
    </div>
  );
};

export default TableGrid;
