// TableComponent.tsx
import React, { memo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Spinner,
} from "@chakra-ui/react";

export interface TableColumn<T> {
  label: string;
  accessor?: keyof T | string;
  isAction?: boolean;
  action?: (id: string) => void;
  actionLabel?: (item: T) => string;
  actionColorScheme?: (item: T) => string;
  render?: (item: T) => React.ReactNode;
}

export interface TableComponentProps<T> {
  caption: string;
  data: T[];
  columns: TableColumn<T>[];
  error?: string | null;
  isLoading?: boolean;
}

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const TableRow = memo(<T extends { _id: string }>({ 
  row, 
  index, 
  columns 
}: { 
  row: T; 
  index: number; 
  columns: TableColumn<T>[];
}) => (
  <Tr>
    <Td>{index + 1}</Td>
    {columns.map((col, colIndex) => (
      <Td key={colIndex}>
        {col.render ? (
          col.render(row)
        ) : col.isAction && col.action ? (
          <Button
            colorScheme={col.actionColorScheme?.(row) || "blue"}
            onClick={() => col.action?.(row._id)}
            size="sm"
          >
            {col.actionLabel?.(row)}
          </Button>
        ) : col.accessor ? (
          String(getNestedValue(row, col.accessor) || 'N/A')
        ) : null}
      </Td>
    ))}
  </Tr>
));

const TableComponent = memo(<T extends { _id: string }>({
  caption,
  data,
  columns,
  error,
  isLoading,
}: TableComponentProps<T>) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex justify-center items-center">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </div>
    );
  }

  return (
    <TableContainer className="w-full">
      <Table variant="simple">
        <TableCaption>{caption}</TableCaption>
        <Thead>
          <Tr>
            <Th className="w-16">No.</Th>
            {columns.map((col, index) => (
              <Th key={index}>{col.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {error ? (
            <Tr>
              <Td 
                colSpan={columns.length + 1} 
                className="text-center text-red-500 font-medium"
              >
                {error}
              </Td>
            </Tr>
          ) : data.length === 0 ? (
            <Tr>
              <Td 
                colSpan={columns.length + 1} 
                className="text-center text-gray-500 font-medium"
              >
                No data available
              </Td>
            </Tr>
          ) : (
            data.map((row, index) => (
              <TableRow<T>
                key={row._id}
                row={row}
                index={index}
                columns={columns}
              />
            ))
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
});

TableRow.displayName = 'TableRow';
TableComponent.displayName = 'TableComponent';

export default TableComponent;
