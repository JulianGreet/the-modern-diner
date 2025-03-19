
import React from 'react';
import { Table } from '@/types/restaurant';

interface TableInfoProps {
  table: Table | null;
}

const TableInfo: React.FC<TableInfoProps> = ({ table }) => {
  if (!table) return null;
  
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Place Your Order</h1>
      <p className="text-lg text-gray-600 mt-2">
        Table {table.name} • Seats {table.capacity}
      </p>
    </div>
  );
};

export default TableInfo;
