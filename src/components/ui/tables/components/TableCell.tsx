import type { TableColumn } from "../types";

interface TableCellProps<T = Record<string, unknown>> {
  column: TableColumn<T>;
  item: T;
}

export function TableCell<T extends Record<string, unknown>>({
  column,
  item,
}: TableCellProps<T>) {
  return (
    <td className="px-6 py-3 text-center text-sm text-gray-900 max-w-xs">
      <div className="overflow-wrap-anywhere">
        {column.render
          ? column.render(item[column.key], item)
          : String(item[column.key] || "")}
      </div>
    </td>
  );
}
