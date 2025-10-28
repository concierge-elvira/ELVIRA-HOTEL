import type { TableColumn } from "../types";
import { SortIcon } from "./SortIcon";

interface TableHeaderProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string) => void;
  hasActions: boolean;
}

export function TableHeader<T extends Record<string, unknown>>({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  hasActions,
}: TableHeaderProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={`px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
            }`}
            style={column.width ? { width: column.width } : {}}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center justify-center">
              {column.label}
              {column.sortable && (
                <SortIcon
                  isActive={sortColumn === column.key}
                  direction={
                    sortColumn === column.key ? sortDirection || "asc" : "asc"
                  }
                />
              )}
            </div>
          </th>
        ))}
        {hasActions && (
          <th
            scope="col"
            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        )}
      </tr>
    </thead>
  );
}
