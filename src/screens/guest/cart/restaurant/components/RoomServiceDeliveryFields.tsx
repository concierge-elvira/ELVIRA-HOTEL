/**
 * Room Service Delivery Form Fields
 *
 * Fields for room service delivery orders
 */

import React from "react";
import { Calendar, Clock } from "lucide-react";
import { Input } from "../../../../../components/ui";

interface RoomServiceDeliveryFieldsProps {
  deliveryDate: string;
  deliveryTime: string;
  onDeliveryDateChange: (value: string) => void;
  onDeliveryTimeChange: (value: string) => void;
  errors?: {
    deliveryDate?: string;
    deliveryTime?: string;
  };
}

export const RoomServiceDeliveryFields: React.FC<
  RoomServiceDeliveryFieldsProps
> = ({
  deliveryDate,
  deliveryTime,
  onDeliveryDateChange,
  onDeliveryTimeChange,
  errors = {},
}) => {
  return (
    <>
      {/* Delivery Date */}
      <Input
        type="date"
        label="Delivery Date"
        value={deliveryDate}
        onChange={(e) => onDeliveryDateChange(e.target.value)}
        error={errors.deliveryDate}
        leftIcon={<Calendar className="w-4 h-4" />}
        required
        min={new Date().toISOString().split("T")[0]}
        placeholder="dd/mm/aaaa"
      />

      {/* Delivery Time */}
      <Input
        type="time"
        label="Delivery Time"
        value={deliveryTime}
        onChange={(e) => onDeliveryTimeChange(e.target.value)}
        error={errors.deliveryTime}
        leftIcon={<Clock className="w-4 h-4" />}
        required
        placeholder="--:--"
      />
    </>
  );
};
