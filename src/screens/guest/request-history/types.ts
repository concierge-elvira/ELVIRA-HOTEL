/**
 * Request History Types
 */

import type {
  AmenityRequestHistory,
  DineInOrderHistory,
  ShopOrderHistory,
} from "../../../hooks/guest-management/request-history/useGuestRequestHistory";

export type { AmenityRequestHistory, DineInOrderHistory, ShopOrderHistory };

export type RequestType = "amenity" | "restaurant" | "shop";

export interface GroupedRequest {
  date: string;
  items: RequestHistoryItem[];
}

export interface RequestHistoryItem {
  id: string;
  type: RequestType;
  title: string;
  subtitle: string;
  items: Array<{
    name: string;
    quantity?: number;
    imageUrl?: string | null;
  }>;
  total: number;
  status: string;
  createdAt: string;
  deliveryInfo?: string;
  notes?: string | null;
  data: AmenityRequestHistory | DineInOrderHistory | ShopOrderHistory;
}
