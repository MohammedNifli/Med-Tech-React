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

// Base interface for items that must have an _id
interface BaseItem {
  _id: string;
}

// Updated TableColumn interface with better generic constraints
export interface TableColumn<T extends BaseItem> {
  label: string;
  accessor?: keyof T | string;
  isAction?: boolean;
  action?: (id: string) => void;
  actionLabel?: (item: T) => string;
  actionColorScheme?: (item: T) => string;
  render?: (item: T) => React.ReactNode;
}

export interface TableComponentProps<T extends BaseItem> {
  caption: string;
  data: T[];
  columns: TableColumn<T>[];
  error?: string | null;
  isLoading?: boolean;
}

interface TableRowProps<T extends BaseItem> {
  row: T;
  index: number;
  columns: TableColumn<T>[];
}

// Helper function
const getNestedValue = <T,>(obj: T, path: string): unknown => {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
};

// Updated TableRow component with proper typing
const TableRowComponent = <T extends BaseItem>({
  row,
  index,
  columns,
}: TableRowProps<T>) => {
  const renderCellContent = (col: TableColumn<T>) => {
    if (col.render) {
      return col.render(row);
    }

    if (col.isAction && col.action) {
      return (
        <Button
          colorScheme={col.actionColorScheme?.(row) || "blue"}
          onClick={() => col.action?.(row._id)}
          size="sm"
        >
          {col.actionLabel?.(row)}
        </Button>
      );
    }

    if (col.accessor) {
      let value: unknown;
      if (typeof col.accessor === "string" && col.accessor.includes(".")) {
        value = getNestedValue(row, col.accessor);
      } else if (typeof col.accessor === "string" || typeof col.accessor === "number") {
        value = row[col.accessor as keyof T];
      }

      return value !== undefined ? String(value) : "N/A";
    }

    return null;
  };

  return (
    <Tr>
      <Td>{index + 1}</Td>
      {columns.map((col, colIndex) => (
        <Td key={colIndex}>{renderCellContent(col)}</Td>
      ))}
    </Tr>
  );
};

const TableRow = memo(TableRowComponent) as typeof TableRowComponent;
// TableRow.displayName = 'TableRow';

// Updated TableComponent with proper typing
const TableComponentBase = <T extends BaseItem>({
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
};

const TableComponent = memo(TableComponentBase) as typeof TableComponentBase;

export default TableComponent;