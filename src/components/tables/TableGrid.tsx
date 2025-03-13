
import React from 'react';
import { Table } from '@/types/restaurant';
import TableCard from './TableCard';

interface TableGridProps {
  tables: Table[];
  onTableClick: (tableId: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
  // Group tables by size for better layout
  const smallTables = tables.filter(table => table.size === 'small');
  const mediumTables = tables.filter(table => table.size === 'medium');
  const largeTables = tables.filter(table => table.size === 'large');
  const boothTables = tables.filter(table => table.size === 'booth');
  
  return (
    <div className="space-y-6">
      {boothTables.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-3">Booths</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {boothTables.map(table => (
              <TableCard key={table.id} table={table} onClick={onTableClick} />
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
                <TableCard key={table.id} table={table} onClick={onTableClick} />
              ))}
            </div>
          </section>
        )}
        
        {mediumTables.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-3">Medium Tables</h3>
            <div className="grid grid-cols-3 gap-3">
              {mediumTables.map(table => (
                <TableCard key={table.id} table={table} onClick={onTableClick} />
              ))}
            </div>
          </section>
        )}
        
        {smallTables.length > 0 && (
          <section>
            <h3 className="text-lg font-medium mb-3">Small Tables</h3>
            <div className="grid grid-cols-4 gap-2">
              {smallTables.map(table => (
                <TableCard key={table.id} table={table} onClick={onTableClick} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TableGrid;
