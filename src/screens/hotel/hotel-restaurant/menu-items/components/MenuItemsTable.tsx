import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  RecommendedToggle,
} from "../../../../../components/ui";
import {
  useMenuItems,
  useUpdateMenuItem,
} from "../../../../../hooks/hotel-restaurant/menu-items/useMenuItems";
import { useRestaurants } from "../../../../../hooks/hotel-restaurant/restaurants/useRestaurants";
import { useHotelId } from "../../../../../hooks";
import type { Database } from "../../../../../types/database";

type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];

interface MenuItem extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  imageUrl: string | null;
  item: string;
  category: string;
  restaurant: string;
  price: string;
  hotelRecommended: boolean | null;
}

interface MenuItemsTableProps {
  searchValue: string;
  onView: (menuItem: MenuItemRow) => void;
}

export function MenuItemsTable({ searchValue, onView }: MenuItemsTableProps) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const hotelId = useHotelId();

  // Fetch menu items using the hook
  const {
    data: menuItems,
    isLoading,
    error,
  } = useMenuItems(hotelId || undefined);

  // Fetch restaurants for name mapping
  const { data: restaurants } = useRestaurants(hotelId || undefined);

  // Get the mutation
  const updateMenuItem = useUpdateMenuItem();

  // Create a map of restaurant IDs to names
  const restaurantMap = useMemo(() => {
    if (!restaurants) return new Map<string, string>();
    return new Map(restaurants.map((r) => [r.id, r.name]));
  }, [restaurants]);

  // Handle row click
  const handleRowClick = (row: MenuItem) => {
    const fullMenuItem = menuItems?.find((item) => item.id === row.id);
    if (fullMenuItem) {
      onView(fullMenuItem);
    }
  };

  // Handler for sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Define table columns for menu items
  const columns: TableColumn<MenuItem>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateMenuItem.mutateAsync({
              id: row.id,
              updates: { is_active: newStatus },
            });
          }}
        />
      ),
    },
    {
      key: "imageUrl",
      label: "Image",
      sortable: false,
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <img
              src={value as string}
              alt="Menu item"
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "item",
      label: "Item",
      sortable: true,
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <span>{row.item}</span>
          <RecommendedToggle
            isRecommended={row.hotelRecommended || false}
            onToggle={() => {
              updateMenuItem.mutate({
                id: row.id,
                updates: { hotel_recommended: !row.hotelRecommended },
              });
            }}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "restaurant",
      label: "Restaurant",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const menuItemData: MenuItem[] = useMemo(() => {
    if (!menuItems) {
      return [];
    }

    const filtered = menuItems.filter((item: MenuItemRow) => {
      if (!searchValue) return true;

      const search = searchValue.toLowerCase();
      return (
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        false
      );
    });

    const transformed = filtered.map((item: MenuItemRow) => {
      // Map restaurant IDs to names
      let restaurantDisplay = "All restaurants";
      if (item.restaurant_ids && item.restaurant_ids.length > 0) {
        const restaurantNames = item.restaurant_ids
          .map((id) => restaurantMap.get(id))
          .filter((name): name is string => name !== undefined);

        if (restaurantNames.length > 0) {
          restaurantDisplay = restaurantNames.join(", ");
        }
      }

      return {
        id: item.id,
        status: item.is_active ? "Active" : "Inactive",
        isActive: item.is_active,
        imageUrl: item.image_url,
        item: item.name,
        category: item.category,
        restaurant: restaurantDisplay,
        price: `$${item.price.toFixed(2)}`,
        hotelRecommended: item.hotel_recommended,
      };
    });

    // Apply sorting
    if (sortColumn) {
      return [...transformed].sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sortColumn];
        const bValue = (b as Record<string, unknown>)[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        // Special handling for price column
        if (sortColumn === "price") {
          const aNum = parseFloat(String(aValue).replace(/[$,]/g, ""));
          const bNum = parseFloat(String(bValue).replace(/[$,]/g, ""));
          comparison = aNum - bNum;
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else {
          const aStr = String(aValue).toLowerCase();
          const bStr = String(bValue).toLowerCase();
          comparison = aStr.localeCompare(bStr);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return transformed;
  }, [menuItems, searchValue, restaurantMap, sortColumn, sortDirection]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading menu items: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}"
        </p>
      )}

      {/* Menu Items Table */}
      <Table
        columns={columns}
        data={menuItemData}
        loading={isLoading}
        emptyMessage="No menu items found. Add new menu items to get started."
        onRowClick={handleRowClick}
        itemsPerPage={10}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}
