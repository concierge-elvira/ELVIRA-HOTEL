import { useContext } from "react";
import { HotelContext } from "../contexts/HotelContext";

interface HotelContextType {
  hotel: Record<string, unknown> | null;
  hotelId: string | null;
  staffInfo: {
    staffId: string;
    employeeId: string;
    position: string;
    department: string;
    status: string;
  } | null;
  isLoading: boolean;
  error: Error | null;
}

export function useHotelContext(): HotelContextType {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error("useHotelContext must be used within a HotelProvider");
  }
  return context;
}

// Convenience hooks
export function useHotel() {
  const { hotel } = useHotelContext();
  return hotel;
}

export function useHotelId() {
  const { hotelId } = useHotelContext();
  return hotelId;
}

export function useStaffInfo() {
  const { staffInfo } = useHotelContext();
  return staffInfo;
}
