import { AmenityOrdersTable } from "./components";
import { OrdersPageHeader } from "../../../../components/shared";

interface AmenityOrdersProps {
  searchValue: string;
}

export function AmenityOrders({ searchValue }: AmenityOrdersProps) {
  return (
    <div className="p-6">
      <OrdersPageHeader
        title="Amenity Orders"
        description="Track and manage guest orders for amenities and services."
      />

      <AmenityOrdersTable searchValue={searchValue} />
    </div>
  );
}
