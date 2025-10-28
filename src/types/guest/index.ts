export interface GuestPersonalData {
  guest_email: string | null;
  country: string | null;
  language: string | null;
}

export interface GuestData {
  id: string;
  hotel_id: string;
  room_number: string;
  guest_name: string;
  access_code_expires_at: string;
  dnd_status: boolean;
  is_active: boolean;
  guest_personal_data: GuestPersonalData | null;
}

export interface HotelData {
  name: string;
  city: string | null;
  country: string | null;
  reception_phone: string | null;
  latitude: number | null;
  longitude: number | null;
  official_languages: string | null;
}

export interface GuestAuthResponse {
  success: boolean;
  token?: string;
  guestData?: GuestData;
  hotelData?: HotelData;
  error?: string;
}

export interface GuestSession {
  token: string;
  guestData: GuestData;
  hotelData: HotelData;
}
