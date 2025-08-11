'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import type { TableData } from '@/lib/csv';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';

interface DataTableProps {
  data: TableData;
  onUpdate: (newData: TableData) => void;
  isProcessing?: boolean;
  className?: string;
}

export function DataTable({ data, onUpdate, isProcessing, className }: DataTableProps) {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleHeaderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    colIndex: number
  ) => {
    const newHeaders = [...tableData.headers];
    newHeaders[colIndex] = e.target.value;
    const newData = { ...tableData, headers: newHeaders };
    setTableData(newData);
    onUpdate(newData);
  };

  const handleCellChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const newRows = [...tableData.rows];
    newRows[rowIndex][colIndex] = e.target.value;
    const newData = { ...tableData, rows: newRows };
    setTableData(newData);
    onUpdate(newData);
  };

  return (
    <div className={cn("rounded-lg border overflow-hidden", className)}>
      <Table className="bg-card">
        <TableHeader>
          <TableRow>
            {tableData.headers.map((header, colIndex) => (
              <TableHead key={colIndex}>
                <Input
                  value={header}
                  onChange={(e) => handleHeaderChange(e, colIndex)}
                  className="font-bold bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                  disabled={isProcessing}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, colIndex) => (
                <TableCell key={colIndex}>
                  <Input
                    value={cell}
                    onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                    className="bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-offset-0"
                    disabled={isProcessing}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
