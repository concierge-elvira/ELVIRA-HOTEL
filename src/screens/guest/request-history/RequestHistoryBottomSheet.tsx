/**
 * Request History Bottom Sheet
 *
 * Displays all guest orders and requests grouped by date
 * Includes amenity requests, restaurant orders, and shop orders
 */

import React, { useMemo, useCallback } from "react";
import { GuestBottomSheet } from "../shared/modals/GuestBottomSheet";
import { useGuestRequestHistory } from "../../../hooks/guest-management/request-history/useGuestRequestHistory";
import { useGuestNotification } from "../../../contexts/guest/GuestNotificationContext";
import { RequestHistoryItemCard } from "./components";
import type {
  RequestHistoryItem,
  GroupedRequest,
  AmenityRequestHistory,
  DineInOrderHistory,
  ShopOrderHistory,
} from "./types";
import { Package } from "lucide-react";

interface RequestHistoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  guestId: string;
  hotelId: string;
}

export const RequestHistoryBottomSheet: React.FC<
  RequestHistoryBottomSheetProps
> = ({ isOpen, onClose, guestId, hotelId }) => {
  const { triggerBellShake, triggerClockShake } = useGuestNotification();

  // Handle status changes to trigger shake animations
  const handleStatusChange = useCallback(() => {
    triggerBellShake();
    triggerClockShake();
  }, [triggerBellShake, triggerClockShake]);

  const { data, isLoading } = useGuestRequestHistory(
    guestId,
    hotelId,
    handleStatusChange
  );

  // Transform and group requests by date
  const groupedRequests = useMemo<GroupedRequest[]>(() => {
    if (!data) return [];

    const allItems: RequestHistoryItem[] = [];

    // Transform amenity requests
    data.amenityRequests.forEach((request: AmenityRequestHistory) => {
      const amenity = request.amenities;
      if (!amenity) return;

      allItems.push({
        id: request.id,
        type: "amenity",
        title: amenity.name,
        subtitle: `Amenity Request`,
        items: [
          {
            name: amenity.name,
            quantity: 1,
            imageUrl: amenity.image_url,
          },
        ],
        total: amenity.price,
        status: request.status,
        createdAt: request.created_at || "",
        deliveryInfo: request.request_date
          ? new Date(request.request_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }) + (request.request_time ? ` at ${request.request_time}` : "")
          : undefined,
        notes: request.special_instructions,
        data: request,
      });
    });

    // Transform dine-in orders
    data.dineInOrders.forEach((order: DineInOrderHistory) => {
      const orderType =
        order.order_type === "room_service"
          ? "Room Service"
          : "Restaurant Order";

      // Create subtitle based on order type
      let subtitle = "";
      if (order.order_type === "room_service") {
        subtitle = "Delivery to room";
      } else {
        // Table reservation - include restaurant name if available
        subtitle = order.restaurants?.name
          ? `${order.restaurants.name}`
          : "Table reservation";
      }

      allItems.push({
        id: order.id,
        type: "restaurant",
        title: orderType,
        subtitle: subtitle,
        items:
          order.menu_items_data?.map((item) => ({
            name: item.menu_item?.name || "Unknown Item",
            quantity: item.quantity,
            imageUrl: item.menu_item?.image_url,
          })) || [],
        total: order.total_price || 0,
        status: order.status,
        createdAt: order.created_at || "",
        deliveryInfo:
          order.delivery_date && order.delivery_time
            ? `${new Date(order.delivery_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} at ${order.delivery_time}`
            : undefined,
        notes: order.special_instructions,
        data: order,
      });
    });

    // Transform shop orders
    data.shopOrders.forEach((order: ShopOrderHistory) => {
      allItems.push({
        id: order.id,
        type: "shop",
        title: "Shop Order",
        subtitle: `${order.products_data?.length || 0} item${
          (order.products_data?.length || 0) !== 1 ? "s" : ""
        }`,
        items:
          order.products_data?.map((item) => ({
            name: item.product?.name || "Unknown Product",
            quantity: item.quantity,
            imageUrl: item.product?.image_url,
          })) || [],
        total: order.total_price || 0,
        status: order.status,
        createdAt: order.created_at || "",
        deliveryInfo:
          order.delivery_date && order.delivery_time
            ? `${new Date(order.delivery_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} at ${order.delivery_time}`
            : undefined,
        notes: order.special_instructions,
        data: order,
      });
    });

    // Sort all items by date (newest first)
    allItems.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Group by date
    const grouped: { [key: string]: RequestHistoryItem[] } = {};
    allItems.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    // Convert to array format
    return Object.entries(grouped).map(([date, items]) => ({
      date,
      items,
    }));
  }, [data]);

  // Calculate totals
  const totalOrders = useMemo(() => {
    if (!data) return 0;
    return (
      data.amenityRequests.length +
      data.dineInOrders.length +
      data.shopOrders.length
    );
  }, [data]);

  const totalSpent = useMemo(() => {
    if (!data) return 0;
    const amenityTotal = data.amenityRequests.reduce(
      (sum, req) => sum + (req.amenities?.price || 0),
      0
    );
    const dineInTotal = data.dineInOrders.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0
    );
    const shopTotal = data.shopOrders.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0
    );
    return amenityTotal + dineInTotal + shopTotal;
  }, [data]);

  return (
    <GuestBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Request History`}
      maxHeight="90vh"
    >
      <div className="px-6 pb-6">
        {/* Summary Header */}
        <div className="mb-4 pb-3 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            {totalOrders} order{totalOrders !== 1 ? "s" : ""} • $
            {totalSpent.toFixed(2)} total
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">
              Loading your request history...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && groupedRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-500">
              Your order history will appear here once you make your first
              request.
            </p>
          </div>
        )}

        {/* Grouped Requests */}
        {!isLoading && groupedRequests.length > 0 && (
          <div className="space-y-6">
            {groupedRequests.map((group) => (
              <div key={group.date}>
                {/* Date Header */}
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {group.date}
                  </h3>
                </div>

                {/* Items for this date */}
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <RequestHistoryItemCard
                      key={item.id}
                      item={item}
                      onClick={() => {
                        // TODO: Open detail modal for this item
                        console.log("View details:", item);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GuestBottomSheet>
  );
};
