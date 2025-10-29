/**
 * Restaurant Reservation Form Fields
 *
 * Fields for restaurant table reservations
 */

import React from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { Input, Textarea } from "../../../../../components/ui";

interface RestaurantReservationFieldsProps {
  reservationDate: string;
  reservationTime: string;
  numberOfGuests: string;
  tablePreferences: string;
  onReservationDateChange: (value: string) => void;
  onReservationTimeChange: (value: string) => void;
  onNumberOfGuestsChange: (value: string) => void;
  onTablePreferencesChange: (value: string) => void;
  errors?: {
    reservationDate?: string;
    reservationTime?: string;
    numberOfGuests?: string;
  };
}

export const RestaurantReservationFields: React.FC<
  RestaurantReservationFieldsProps
> = ({
  reservationDate,
  reservationTime,
  numberOfGuests,
  tablePreferences,
  onReservationDateChange,
  onReservationTimeChange,
  onNumberOfGuestsChange,
  onTablePreferencesChange,
  errors = {},
}) => {
  return (
    <>
      {/* Reservation Date */}
      <Input
        type="date"
        label="Reservation Date"
        value={reservationDate}
        onChange={(e) => onReservationDateChange(e.target.value)}
        error={errors.reservationDate}
        leftIcon={<Calendar className="w-4 h-4" />}
        required
        min={new Date().toISOString().split("T")[0]}
        placeholder="dd/mm/aaaa"
      />

      {/* Reservation Time */}
      <Input
        type="time"
        label="Reservation Time"
        value={reservationTime}
        onChange={(e) => onReservationTimeChange(e.target.value)}
        error={errors.reservationTime}
        leftIcon={<Clock className="w-4 h-4" />}
        required
        placeholder="--:--"
      />

      {/* Number of Guests */}
      <Input
        type="number"
        label="Number of Guests"
        value={numberOfGuests}
        onChange={(e) => onNumberOfGuestsChange(e.target.value)}
        error={errors.numberOfGuests}
        leftIcon={<Users className="w-4 h-4" />}
        required
        min="1"
        placeholder="2"
      />

      {/* Table Preferences (Optional) */}
      <Textarea
        label="Table Preferences (Optional)"
        value={tablePreferences}
        onChange={(e) => onTablePreferencesChange(e.target.value)}
        placeholder="e.g., Window seat, quiet area..."
        rows={3}
      />
    </>
  );
};
