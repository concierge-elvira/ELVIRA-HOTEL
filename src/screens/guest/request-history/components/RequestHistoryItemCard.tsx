/**
 * Request History Item Components
 *
 * Individual cards for different types of requests/orders
 */

import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import type { RequestHistoryItem } from "../types";

interface RequestHistoryCardProps {
  item: RequestHistoryItem;
  onClick?: () => void;
}

/**
 * Base card component for all request types
 */
const RequestCard: React.FC<{
  title: string;
  subtitle: string;
  status: string;
  total: number;
  deliveryInfo?: string;
  items: Array<{ name: string; quantity?: number; imageUrl?: string | null }>;
  notes?: string | null;
  onClick?: () => void;
}> = ({
  title,
  subtitle,
  status,
  total,
  deliveryInfo,
  items,
  notes,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "approved":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      {/* Header Row - Always Visible */}
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base">{title}</h4>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(
              status
            )}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
          )}
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="mt-3">
          {/* Delivery Info */}
          {deliveryInfo && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <Clock className="w-4 h-4" />
              <span>{deliveryInfo}</span>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-1 mb-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-gray-700">
                  {item.quantity && item.quantity > 1 && (
                    <span className="font-medium">{item.quantity}x </span>
                  )}
                  {item.name}
                </span>
                {item.quantity && (
                  <span className="text-gray-500 text-xs">
                    $
                    {(
                      (total /
                        items.reduce((sum, i) => sum + (i.quantity || 1), 0)) *
                      (item.quantity || 1)
                    ).toFixed(2)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="text-sm font-medium text-gray-700">Total:</span>
            <span className="text-lg font-bold text-purple-600">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* Notes */}
          {notes && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Notes:</span> {notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Main component that renders the card
 */
export const RequestHistoryItemCard: React.FC<RequestHistoryCardProps> = ({
  item,
  onClick,
}) => {
  return (
    <RequestCard
      title={item.title}
      subtitle={item.subtitle}
      status={item.status}
      total={item.total}
      deliveryInfo={item.deliveryInfo}
      items={item.items}
      notes={item.notes}
      onClick={onClick}
    />
  );
};
