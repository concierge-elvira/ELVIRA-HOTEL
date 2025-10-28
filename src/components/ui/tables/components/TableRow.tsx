import type { TableColumn, TableAction } from "../types";
import { TableCell } from "./TableCell";
import { TableActions } from "./TableActions";

interface TableRowProps<T = Record<string, unknown>> {
  item: T;
  columns: TableColumn<T>[];
  actions: TableAction<T>[];
  onRowClick?: (row: T) => void;
}

export function TableRow<T extends Record<string, unknown>>({
  item,
  columns,
  actions,
  onRowClick,
}: TableRowProps<T>) {
  return (
    <tr
      className={`hover:bg-gray-50 ${onRowClick ? "cursor-pointer" : ""}`}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((column) => (
        <TableCell key={column.key} column={column} item={item} />
      ))}
      {actions.length > 0 && (
        <td className="px-6 py-3 text-right text-sm font-medium">
          <TableActions actions={actions} item={item} />
        </td>
      )}
    </tr>
  );
}
