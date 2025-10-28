import { useMemo, useState } from "react";
import {
  Table,
  type TableColumn,
  StatusBadge,
  RecommendedToggle,
} from "../../../../../components/ui";
import {
  useProducts,
  useUpdateProduct,
} from "../../../../../hooks/hotel-shop/products/useProducts";
import { useHotelId } from "../../../../../hooks/useHotelContext";
import type { Database } from "../../../../../types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface Product extends Record<string, unknown> {
  id: string;
  status: string;
  isActive: boolean;
  imageUrl: string | null;
  product: string;
  category: string;
  price: string;
  stock: string;
  hotelRecommended: boolean | null;
}

interface ProductsTableProps {
  searchValue: string;
  onView: (product: ProductRow) => void;
}

export function ProductsTable({ searchValue, onView }: ProductsTableProps) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const hotelId = useHotelId();

  // Fetch products using the hook
  const {
    data: products,
    isLoading,
    error,
  } = useProducts(hotelId || undefined);

  // Get the mutation
  const updateProduct = useUpdateProduct();

  // Handle row click
  const handleRowClick = (row: Product) => {
    const fullProduct = products?.find((item) => item.id === row.id);
    if (fullProduct) {
      onView(fullProduct);
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

  // Define table columns for products
  const columns: TableColumn<Product>[] = [
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (_value, row) => (
        <StatusBadge
          status={row.isActive ? "active" : "inactive"}
          onToggle={async (newStatus) => {
            await updateProduct.mutateAsync({
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
              alt="Product"
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
      key: "product",
      label: "Product",
      sortable: true,
      render: (_value: unknown, row: Product) => (
        <div className="flex items-center gap-2">
          <span>{row.product}</span>
          <RecommendedToggle
            isRecommended={row.hotelRecommended || false}
            onToggle={() => {
              updateProduct.mutate({
                id: row.id,
                updates: { recommended: !row.hotelRecommended },
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
      key: "price",
      label: "Price",
      sortable: true,
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
    },
  ];

  // Transform database data to table format with search filtering
  const productData: Product[] = useMemo(() => {
    if (!products) {
      return [];
    }

    const filtered = products.filter((product: ProductRow) => {
      if (!searchValue) return true;

      const search = searchValue.toLowerCase();
      return (
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        (product.description &&
          product.description.toLowerCase().includes(search))
      );
    });

    const transformed = filtered.map((product: ProductRow) => ({
      id: product.id,
      status: product.is_active ? "Active" : "Inactive",
      isActive: product.is_active,
      imageUrl: product.image_url,
      product: product.name,
      category: product.category,
      price: `$${product.price.toFixed(2)}`,
      stock: product.is_unlimited_stock
        ? "Unlimited"
        : product.stock_quantity?.toString() || "0",
      hotelRecommended: product.recommended,
    }));

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
  }, [products, searchValue, sortColumn, sortDirection]);

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">
          Error loading products: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {searchValue && (
        <p className="text-sm text-gray-600 mb-4">
          Searching for: "{searchValue}" - Found {productData.length} result(s)
        </p>
      )}

      {/* Products Table */}
      <Table
        columns={columns}
        data={productData}
        loading={isLoading}
        emptyMessage={
          searchValue
            ? `No products found matching "${searchValue}".`
            : "No products found. Add new products to get started."
        }
        onRowClick={handleRowClick}
        itemsPerPage={10}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}
