import { RestaurantOrdersTable } from "./components";
import { OrdersPageHeader } from "../../../../components/shared";

interface RestaurantOrdersProps {
  searchValue: string;
}

export function RestaurantOrders({ searchValue }: RestaurantOrdersProps) {
  return (
    <div className="p-6">
      <OrdersPageHeader
        title="Restaurant Orders"
        description="Track and manage guest restaurant orders and reservations."
      />

      <RestaurantOrdersTable searchValue={searchValue} />
    </div>
  );
}
