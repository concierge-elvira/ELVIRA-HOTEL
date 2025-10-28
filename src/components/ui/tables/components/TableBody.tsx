import type { TableColumn, TableAction } from "../types";
import { TableRow } from "./TableRow";

interface TableBodyProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  actions: TableAction<T>[];
  onRowClick?: (row: T) => void;
}

export function TableBody<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  onRowClick,
}: TableBodyProps<T>) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item, index) => (
        <TableRow
          key={index}
          item={item}
          columns={columns}
          actions={actions}
          onRowClick={onRowClick}
        />
      ))}
    </tbody>
  );
}
