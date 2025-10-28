import { ShopOrdersTable } from "./components";
import { OrdersPageHeader } from "../../../../components/shared";

interface ShopOrdersProps {
  searchValue: string;
}

export function ShopOrders({ searchValue }: ShopOrdersProps) {
  return (
    <div className="p-6">
      <OrdersPageHeader
        title="Shop Orders"
        description="Track and manage guest orders from the hotel shop."
      />

      <ShopOrdersTable searchValue={searchValue} />
    </div>
  );
}
