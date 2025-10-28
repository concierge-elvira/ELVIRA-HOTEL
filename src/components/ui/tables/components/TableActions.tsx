import type { TableAction } from "../types";
import { IconButton } from "../../buttons";

interface TableActionsProps<T = Record<string, unknown>> {
  actions: TableAction<T>[];
  item: T;
}

export function TableActions<T extends Record<string, unknown>>({
  actions,
  item,
}: TableActionsProps<T>) {
  if (actions.length === 0) return null;

  return (
    <div className="flex justify-end space-x-2">
      {actions.map((action, actionIndex) => (
        <IconButton
          key={actionIndex}
          icon={action.icon}
          onClick={() => action.onClick(item)}
          variant={action.variant || "ghost"}
          size="sm"
          disabled={action.disabled ? action.disabled(item) : false}
          title={action.label}
        />
      ))}
    </div>
  );
}
