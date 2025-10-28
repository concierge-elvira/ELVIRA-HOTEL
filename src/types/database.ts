export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      absence_requests: {
        Row: {
          created_at: string | null;
          end_date: string;
          hotel_id: string;
          id: string;
          notes: string | null;
          request_type: string;
          staff_id: string;
          start_date: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          end_date: string;
          hotel_id: string;
          id?: string;
          notes?: string | null;
          request_type: string;
          staff_id: string;
          start_date: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          end_date?: string;
          hotel_id?: string;
          id?: string;
          notes?: string | null;
          request_type?: string;
          staff_id?: string;
          start_date?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "absence_requests_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "absence_requests_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          }
        ];
      };
      amenities: {
        Row: {
          category: string;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          hotel_id: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          price: number;
          recommended: boolean;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          price: number;
          recommended?: boolean;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          price?: number;
          recommended?: boolean;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "amenities_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "amenities_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      amenity_requests: {
        Row: {
          amenity_id: string;
          created_at: string | null;
          guest_id: string;
          hotel_id: string;
          id: string;
          processed_by: string | null;
          request_date: string;
          request_time: string | null;
          special_instructions: string | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          amenity_id: string;
          created_at?: string | null;
          guest_id: string;
          hotel_id: string;
          id?: string;
          processed_by?: string | null;
          request_date: string;
          request_time?: string | null;
          special_instructions?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          amenity_id?: string;
          created_at?: string | null;
          guest_id?: string;
          hotel_id?: string;
          id?: string;
          processed_by?: string | null;
          request_date?: string;
          request_time?: string | null;
          special_instructions?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "amenity_requests_amenity_id_fkey";
            columns: ["amenity_id"];
            isOneToOne: false;
            referencedRelation: "amenities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "amenity_requests_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "amenity_requests_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "amenity_requests_processed_by_fkey";
            columns: ["processed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      announcements: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          description: string;
          hotel_id: string;
          id: string;
          is_active: boolean;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          description: string;
          hotel_id: string;
          id?: string;
          is_active?: boolean;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string;
          hotel_id?: string;
          id?: string;
          is_active?: boolean;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      approved_third_party_places: {
        Row: {
          created_at: string | null;
          google_data: Json;
          hotel_id: string;
          id: string;
          name: string;
          place_id: string;
          recommended: boolean;
          status: string;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          google_data: Json;
          hotel_id: string;
          id?: string;
          name: string;
          place_id: string;
          recommended?: boolean;
          status?: string;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          google_data?: Json;
          hotel_id?: string;
          id?: string;
          name?: string;
          place_id?: string;
          recommended?: boolean;
          status?: string;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "approved_third_party_places_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      cached_places: {
        Row: {
          address: string | null;
          business_status: string | null;
          created_at: string | null;
          distance_km: number | null;
          hotel_id: string;
          id: string;
          is_active: boolean | null;
          last_updated: string | null;
          latitude: number | null;
          longitude: number | null;
          name: string;
          opening_hours: Json | null;
          phone: string | null;
          photos: Json | null;
          place_id: string;
          place_type: string;
          price_level: number | null;
          rating: number | null;
          user_ratings_total: number | null;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          business_status?: string | null;
          created_at?: string | null;
          distance_km?: number | null;
          hotel_id: string;
          id?: string;
          is_active?: boolean | null;
          last_updated?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          name: string;
          opening_hours?: Json | null;
          phone?: string | null;
          photos?: Json | null;
          place_id: string;
          place_type: string;
          price_level?: number | null;
          rating?: number | null;
          user_ratings_total?: number | null;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          business_status?: string | null;
          created_at?: string | null;
          distance_km?: number | null;
          hotel_id?: string;
          id?: string;
          is_active?: boolean | null;
          last_updated?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          name?: string;
          opening_hours?: Json | null;
          phone?: string | null;
          photos?: Json | null;
          place_id?: string;
          place_type?: string;
          price_level?: number | null;
          rating?: number | null;
          user_ratings_total?: number | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cached_places_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      dine_in_order_items: {
        Row: {
          created_at: string | null;
          id: string;
          menu_item_id: string;
          order_id: string;
          price_at_order: number;
          quantity: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          menu_item_id: string;
          order_id: string;
          price_at_order: number;
          quantity: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          menu_item_id?: string;
          order_id?: string;
          price_at_order?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "dine_in_order_items_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dine_in_order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "dine_in_orders";
            referencedColumns: ["id"];
          }
        ];
      };
      dine_in_orders: {
        Row: {
          created_at: string | null;
          delivery_date: string | null;
          delivery_time: string | null;
          guest_id: string;
          hotel_id: string;
          id: string;
          number_of_guests: number | null;
          order_type: string;
          processed_by: string | null;
          reservation_date: string | null;
          reservation_time: string | null;
          restaurant_id: string | null;
          special_instructions: string | null;
          status: string;
          table_preferences: string | null;
          total_price: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          delivery_date?: string | null;
          delivery_time?: string | null;
          guest_id: string;
          hotel_id: string;
          id?: string;
          number_of_guests?: number | null;
          order_type: string;
          processed_by?: string | null;
          reservation_date?: string | null;
          reservation_time?: string | null;
          restaurant_id?: string | null;
          special_instructions?: string | null;
          status?: string;
          table_preferences?: string | null;
          total_price: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          delivery_date?: string | null;
          delivery_time?: string | null;
          guest_id?: string;
          hotel_id?: string;
          id?: string;
          number_of_guests?: number | null;
          order_type?: string;
          processed_by?: string | null;
          reservation_date?: string | null;
          reservation_time?: string | null;
          restaurant_id?: string | null;
          special_instructions?: string | null;
          status?: string;
          table_preferences?: string | null;
          total_price?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "dine_in_orders_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dine_in_orders_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dine_in_orders_processed_by_fkey";
            columns: ["processed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dine_in_orders_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      emergency_contacts: {
        Row: {
          contact_name: string;
          created_at: string | null;
          created_by: string | null;
          hotel_id: string;
          id: string;
          is_active: boolean;
          phone_number: string;
          updated_at: string | null;
        };
        Insert: {
          contact_name: string;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id: string;
          id?: string;
          is_active?: boolean;
          phone_number: string;
          updated_at?: string | null;
        };
        Update: {
          contact_name?: string;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id?: string;
          id?: string;
          is_active?: boolean;
          phone_number?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "emergency_contacts_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      external_restaurant_bookings: {
        Row: {
          booking_time: string;
          created_at: string | null;
          created_by: string | null;
          guest_id: string;
          id: string;
          number_of_guests: number;
          ordered_items: Json | null;
          preorder_amount: number | null;
          restaurant_id: string;
          special_requests: string | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          booking_time: string;
          created_at?: string | null;
          created_by?: string | null;
          guest_id: string;
          id?: string;
          number_of_guests: number;
          ordered_items?: Json | null;
          preorder_amount?: number | null;
          restaurant_id: string;
          special_requests?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          booking_time?: string;
          created_at?: string | null;
          created_by?: string | null;
          guest_id?: string;
          id?: string;
          number_of_guests?: number;
          ordered_items?: Json | null;
          preorder_amount?: number | null;
          restaurant_id?: string;
          special_requests?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "external_restaurant_bookings_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "external_restaurant_bookings_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "external_restaurant_bookings_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "external_restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      external_restaurant_menu_items: {
        Row: {
          category: string;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          dietary_tags: string[] | null;
          external_restaurant_id: string;
          id: string;
          image_url: string | null;
          is_available: boolean;
          name: string;
          prep_time: number | null;
          price: number;
          priority: string;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          dietary_tags?: string[] | null;
          external_restaurant_id: string;
          id?: string;
          image_url?: string | null;
          is_available?: boolean;
          name: string;
          prep_time?: number | null;
          price: number;
          priority?: string;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          dietary_tags?: string[] | null;
          external_restaurant_id?: string;
          id?: string;
          image_url?: string | null;
          is_available?: boolean;
          name?: string;
          prep_time?: number | null;
          price?: number;
          priority?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_created_by";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_external_restaurant";
            columns: ["external_restaurant_id"];
            isOneToOne: false;
            referencedRelation: "external_restaurants";
            referencedColumns: ["id"];
          }
        ];
      };
      external_restaurants: {
        Row: {
          address: string | null;
          city: string | null;
          contact_email: string;
          country: string | null;
          created_at: string | null;
          created_by: string | null;
          cuisine_type: string | null;
          Currency: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          location: unknown | null;
          logo_url: string | null;
          main_contact: string | null;
          name: string;
          opening_hours: Json | null;
          owner_id: string;
          phone_number: string | null;
          stripe_account_id: string | null;
          updated_at: string | null;
          website: string | null;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          contact_email: string;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          cuisine_type?: string | null;
          Currency?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          location?: unknown | null;
          logo_url?: string | null;
          main_contact?: string | null;
          name: string;
          opening_hours?: Json | null;
          owner_id: string;
          phone_number?: string | null;
          stripe_account_id?: string | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          contact_email?: string;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          cuisine_type?: string | null;
          Currency?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          location?: unknown | null;
          logo_url?: string | null;
          main_contact?: string | null;
          name?: string;
          opening_hours?: Json | null;
          owner_id?: string;
          phone_number?: string | null;
          stripe_account_id?: string | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "external_restaurants_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      guest_conversation: {
        Row: {
          assigned_staff_id: string | null;
          created_at: string;
          guest_id: string;
          hotel_id: string;
          id: string;
          last_message_at: string;
          status: string;
          subject: string | null;
          updated_at: string;
        };
        Insert: {
          assigned_staff_id?: string | null;
          created_at?: string;
          guest_id: string;
          hotel_id: string;
          id?: string;
          last_message_at?: string;
          status?: string;
          subject?: string | null;
          updated_at?: string;
        };
        Update: {
          assigned_staff_id?: string | null;
          created_at?: string;
          guest_id?: string;
          hotel_id?: string;
          id?: string;
          last_message_at?: string;
          status?: string;
          subject?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "guest_conversation_assigned_staff_id_fkey";
            columns: ["assigned_staff_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guest_conversation_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guest_conversation_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      guest_messages: {
        Row: {
          ai_analysis_completed: boolean | null;
          conversation_id: string;
          created_at: string;
          created_by: string | null;
          guest_id: string | null;
          hotel_id: string | null;
          id: string;
          is_read: boolean;
          is_translated: boolean;
          message_text: string;
          original_language: string | null;
          original_text: string | null;
          priority: number | null;
          sender_type: string;
          sentiment: string | null;
          staff_translation: string | null;
          subtopics: string | null;
          target_language: string | null;
          topics: string[] | null;
          translated_text: string | null;
          updated_at: string;
          urgency: string | null;
        };
        Insert: {
          ai_analysis_completed?: boolean | null;
          conversation_id: string;
          created_at?: string;
          created_by?: string | null;
          guest_id?: string | null;
          hotel_id?: string | null;
          id?: string;
          is_read?: boolean;
          is_translated?: boolean;
          message_text: string;
          original_language?: string | null;
          original_text?: string | null;
          priority?: number | null;
          sender_type: string;
          sentiment?: string | null;
          staff_translation?: string | null;
          subtopics?: string | null;
          target_language?: string | null;
          topics?: string[] | null;
          translated_text?: string | null;
          updated_at?: string;
          urgency?: string | null;
        };
        Update: {
          ai_analysis_completed?: boolean | null;
          conversation_id?: string;
          created_at?: string;
          created_by?: string | null;
          guest_id?: string | null;
          hotel_id?: string | null;
          id?: string;
          is_read?: boolean;
          is_translated?: boolean;
          message_text?: string;
          original_language?: string | null;
          original_text?: string | null;
          priority?: number | null;
          sender_type?: string;
          sentiment?: string | null;
          staff_translation?: string | null;
          subtopics?: string | null;
          target_language?: string | null;
          topics?: string[] | null;
          translated_text?: string | null;
          updated_at?: string;
          urgency?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guest_messages_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guest_messages_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guest_messages_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      guest_personal_data: {
        Row: {
          additional_guests_data: Json | null;
          country: string | null;
          date_of_birth: string | null;
          first_name: string;
          guest_email: string;
          guest_id: string;
          language: string | null;
          last_name: string;
          phone_number: string | null;
          updated_at: string | null;
        };
        Insert: {
          additional_guests_data?: Json | null;
          country?: string | null;
          date_of_birth?: string | null;
          first_name: string;
          guest_email: string;
          guest_id: string;
          language?: string | null;
          last_name: string;
          phone_number?: string | null;
          updated_at?: string | null;
        };
        Update: {
          additional_guests_data?: Json | null;
          country?: string | null;
          date_of_birth?: string | null;
          first_name?: string;
          guest_email?: string;
          guest_id?: string;
          language?: string | null;
          last_name?: string;
          phone_number?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guest_personal_data_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: true;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          }
        ];
      };
      guests: {
        Row: {
          access_code_expires_at: string;
          created_at: string | null;
          created_by: string | null;
          dnd_status: boolean;
          guest_group_id: string | null;
          guest_group_name: string | null;
          guest_name: string;
          hashed_verification_code: string;
          hotel_id: string;
          id: string;
          is_active: boolean;
          is_primary_guest: boolean | null;
          room_number: string;
          updated_at: string | null;
        };
        Insert: {
          access_code_expires_at: string;
          created_at?: string | null;
          created_by?: string | null;
          dnd_status?: boolean;
          guest_group_id?: string | null;
          guest_group_name?: string | null;
          guest_name: string;
          hashed_verification_code: string;
          hotel_id: string;
          id?: string;
          is_active?: boolean;
          is_primary_guest?: boolean | null;
          room_number: string;
          updated_at?: string | null;
        };
        Update: {
          access_code_expires_at?: string;
          created_at?: string | null;
          created_by?: string | null;
          dnd_status?: boolean;
          guest_group_id?: string | null;
          guest_group_name?: string | null;
          guest_name?: string;
          hashed_verification_code?: string;
          hotel_id?: string;
          id?: string;
          is_active?: boolean;
          is_primary_guest?: boolean | null;
          room_number?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "guests_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "guests_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      hotel_recommended_places: {
        Row: {
          address: string;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          hotel_id: string;
          id: string;
          is_active: boolean;
          latitud: number | null;
          longitud: number | null;
          place_name: string;
          updated_at: string | null;
        };
        Insert: {
          address: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id: string;
          id?: string;
          is_active?: boolean;
          latitud?: number | null;
          longitud?: number | null;
          place_name: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id?: string;
          id?: string;
          is_active?: boolean;
          latitud?: number | null;
          longitud?: number | null;
          place_name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotel_recommended_places_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hotel_recommended_places_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      hotel_settings: {
        Row: {
          about_us: string | null;
          about_us_button: string | null;
          created_at: string | null;
          created_by: string | null;
          hotel_id: string;
          id: string;
          images_url: string | null;
          setting_key: string;
          setting_value: boolean;
          updated_at: string | null;
        };
        Insert: {
          about_us?: string | null;
          about_us_button?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id: string;
          id?: string;
          images_url?: string | null;
          setting_key: string;
          setting_value?: boolean;
          updated_at?: string | null;
        };
        Update: {
          about_us?: string | null;
          about_us_button?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id?: string;
          id?: string;
          images_url?: string | null;
          setting_key?: string;
          setting_value?: boolean;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotel_settings_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hotel_settings_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      hotel_appearance_settings: {
        Row: {
          about_us_background_color: string;
          border_radius: string;
          card_style: string;
          color_primary: string;
          color_text_inverse: string;
          color_text_primary: string;
          color_text_secondary: string;
          created_at: string | null;
          font_family: string;
          font_size_base: string;
          font_size_heading: string;
          font_size_small: string;
          font_weight_bold: string;
          font_weight_medium: string;
          font_weight_normal: string;
          font_weight_semibold: string;
          hotel_id: string;
          icon_size: string;
          id: string;
          stay_card_gradient_from: string;
          stay_card_gradient_to: string;
          updated_at: string | null;
        };
        Insert: {
          about_us_background_color?: string;
          border_radius?: string;
          card_style?: string;
          color_primary?: string;
          color_text_inverse?: string;
          color_text_primary?: string;
          color_text_secondary?: string;
          created_at?: string | null;
          font_family?: string;
          font_size_base?: string;
          font_size_heading?: string;
          font_size_small?: string;
          font_weight_bold?: string;
          font_weight_medium?: string;
          font_weight_normal?: string;
          font_weight_semibold?: string;
          hotel_id: string;
          icon_size?: string;
          id?: string;
          stay_card_gradient_from?: string;
          stay_card_gradient_to?: string;
          updated_at?: string | null;
        };
        Update: {
          about_us_background_color?: string;
          border_radius?: string;
          card_style?: string;
          color_primary?: string;
          color_text_inverse?: string;
          color_text_primary?: string;
          color_text_secondary?: string;
          created_at?: string | null;
          font_family?: string;
          font_size_base?: string;
          font_size_heading?: string;
          font_size_small?: string;
          font_weight_bold?: string;
          font_weight_medium?: string;
          font_weight_normal?: string;
          font_weight_semibold?: string;
          hotel_id?: string;
          icon_size?: string;
          id?: string;
          stay_card_gradient_from?: string;
          stay_card_gradient_to?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotel_appearance_settings_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      hotel_staff: {
        Row: {
          consent_date: string | null;
          created_at: string | null;
          created_by: string | null;
          data_processing_consent: boolean;
          department: string;
          employee_id: string;
          hire_date: string;
          hotel_id: string;
          id: string;
          position: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          consent_date?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          data_processing_consent?: boolean;
          department: string;
          employee_id: string;
          hire_date?: string;
          hotel_id: string;
          id?: string;
          position: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          consent_date?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          data_processing_consent?: boolean;
          department?: string;
          employee_id?: string;
          hire_date?: string;
          hotel_id?: string;
          id?: string;
          position?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotel_staff_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hotel_staff_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      hotel_staff_personal_data: {
        Row: {
          address: string | null;
          avatar_url: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          data_retention_until: string | null;
          date_of_birth: string | null;
          email: string;
          emergency_contact_name: string | null;
          emergency_contact_number: string | null;
          first_name: string;
          id: string;
          last_name: string;
          phone_number: string | null;
          staff_id: string;
          updated_at: string | null;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          data_retention_until?: string | null;
          date_of_birth?: string | null;
          email: string;
          emergency_contact_name?: string | null;
          emergency_contact_number?: string | null;
          first_name: string;
          id?: string;
          last_name: string;
          phone_number?: string | null;
          staff_id: string;
          updated_at?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          data_retention_until?: string | null;
          date_of_birth?: string | null;
          email?: string;
          emergency_contact_name?: string | null;
          emergency_contact_number?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone_number?: string | null;
          staff_id?: string;
          updated_at?: string | null;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotel_staff_personal_data_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: true;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          }
        ];
      };
      hotel_third_party_approvals: {
        Row: {
          approved_by: string | null;
          created_at: string | null;
          hotel_id: string;
          id: string;
          status: string;
          third_party_id: string;
          third_party_type: string;
          updated_at: string | null;
        };
        Insert: {
          approved_by?: string | null;
          created_at?: string | null;
          hotel_id: string;
          id?: string;
          status?: string;
          third_party_id: string;
          third_party_type: string;
          updated_at?: string | null;
        };
        Update: {
          approved_by?: string | null;
          created_at?: string | null;
          hotel_id?: string;
          id?: string;
          status?: string;
          third_party_id?: string;
          third_party_type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotel_third_party_approvals_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hotel_third_party_approvals_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      hotel_third_party_recommendations: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          hotel_id: string;
          id: string;
          is_recommended: boolean;
          third_party_id: string;
          third_party_type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          hotel_id: string;
          id?: string;
          is_recommended?: boolean;
          third_party_id: string;
          third_party_type: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          hotel_id?: string;
          id?: string;
          is_recommended?: boolean;
          third_party_id?: string;
          third_party_type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotel_third_party_recommendations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "hotel_third_party_recommendations_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      hotels: {
        Row: {
          address: string | null;
          city: string | null;
          contact_email: string;
          country: string | null;
          created_at: string | null;
          created_by: string | null;
          currency: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          latitude: number | null;
          location: unknown | null;
          longitude: number | null;
          main_contact: string | null;
          membership: string | null;
          name: string;
          number_rooms: number | null;
          official_languages: string[] | null;
          owner_id: string;
          phone_number: string | null;
          reception_phone: string | null;
          services: string[] | null;
          stripe_account_id: string | null;
          updated_at: string | null;
          website: string | null;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          contact_email: string;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          latitude?: number | null;
          location?: unknown | null;
          longitude?: number | null;
          main_contact?: string | null;
          membership?: string | null;
          name: string;
          number_rooms?: number | null;
          official_languages?: string[] | null;
          owner_id: string;
          phone_number?: string | null;
          reception_phone?: string | null;
          services?: string[] | null;
          stripe_account_id?: string | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          contact_email?: string;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          latitude?: number | null;
          location?: unknown | null;
          longitude?: number | null;
          main_contact?: string | null;
          membership?: string | null;
          name?: string;
          number_rooms?: number | null;
          official_languages?: string[] | null;
          owner_id?: string;
          phone_number?: string | null;
          reception_phone?: string | null;
          services?: string[] | null;
          stripe_account_id?: string | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "hotels_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      menu_items: {
        Row: {
          category: string;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          hotel_id: string;
          hotel_recommended: boolean | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          price: number;
          restaurant_ids: string[] | null;
          service_type: string[] | null;
          special_type: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id: string;
          hotel_recommended?: boolean | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          price: number;
          restaurant_ids?: string[] | null;
          service_type?: string[] | null;
          special_type?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id?: string;
          hotel_recommended?: boolean | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          price?: number;
          restaurant_ids?: string[] | null;
          service_type?: string[] | null;
          special_type?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "menu_items_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "menu_items_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      place_categories: {
        Row: {
          auto_refresh_hours: number | null;
          category_name: string;
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          google_place_types: string[];
          icon: string | null;
          id: number;
          is_active: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          auto_refresh_hours?: number | null;
          category_name: string;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          google_place_types: string[];
          icon?: string | null;
          id?: number;
          is_active?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          auto_refresh_hours?: number | null;
          category_name?: string;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          google_place_types?: string[];
          icon?: string | null;
          id?: number;
          is_active?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category: string;
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          hotel_id: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          is_unlimited_stock: boolean;
          mini_bar: boolean;
          name: string;
          price: number;
          recommended: boolean;
          stock_quantity: number | null;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          is_unlimited_stock?: boolean;
          mini_bar?: boolean;
          name: string;
          price: number;
          recommended?: boolean;
          stock_quantity?: number | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          hotel_id?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          is_unlimited_stock?: boolean;
          mini_bar?: boolean;
          name?: string;
          price?: number;
          recommended?: boolean;
          stock_quantity?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          email: string;
          id: string;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          email: string;
          id: string;
          role?: string;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          email?: string;
          id?: string;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      qa_recommendations: {
        Row: {
          answer: string | null;
          category: string;
          created_at: string | null;
          created_by: string | null;
          hotel_id: string;
          id: string;
          is_active: boolean;
          location: unknown | null;
          question: string | null;
          type: string;
          updated_at: string | null;
        };
        Insert: {
          answer?: string | null;
          category: string;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id: string;
          id?: string;
          is_active?: boolean;
          location?: unknown | null;
          question?: string | null;
          type: string;
          updated_at?: string | null;
        };
        Update: {
          answer?: string | null;
          category?: string;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id?: string;
          id?: string;
          is_active?: boolean;
          location?: unknown | null;
          question?: string | null;
          type?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "qa_recommendations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qa_recommendations_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      restaurants: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          cuisine: string;
          description: string | null;
          food_types: string[] | null;
          hotel_id: string;
          id: string;
          is_active: boolean;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          cuisine: string;
          description?: string | null;
          food_types?: string[] | null;
          hotel_id: string;
          id?: string;
          is_active?: boolean;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          cuisine?: string;
          description?: string | null;
          food_types?: string[] | null;
          hotel_id?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "restaurants_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "restaurants_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          }
        ];
      };
      room_cleaning_status: {
        Row: {
          cleaning_duration: unknown | null;
          cleaning_started_at: string | null;
          cleaning_status: string;
          created_at: string | null;
          created_by: string | null;
          hotel_id: string;
          id: string;
          last_cleaned_at: string | null;
          next_scheduled_cleaning_at: string | null;
          room_number: string;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          cleaning_duration?: unknown | null;
          cleaning_started_at?: string | null;
          cleaning_status: string;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id: string;
          id?: string;
          last_cleaned_at?: string | null;
          next_scheduled_cleaning_at?: string | null;
          room_number: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          cleaning_duration?: unknown | null;
          cleaning_started_at?: string | null;
          cleaning_status?: string;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id?: string;
          id?: string;
          last_cleaned_at?: string | null;
          next_scheduled_cleaning_at?: string | null;
          room_number?: string;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "room_cleaning_status_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_cleaning_status_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_cleaning_status_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      secrets: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          key: string;
          updated_at: string | null;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key: string;
          updated_at?: string | null;
          value: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          key?: string;
          updated_at?: string | null;
          value?: string;
        };
        Relationships: [];
      };
      shop_order_items: {
        Row: {
          created_at: string | null;
          id: string;
          order_id: string;
          price_at_order: number;
          product_id: string;
          quantity: number;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          order_id: string;
          price_at_order: number;
          product_id: string;
          quantity: number;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          order_id?: string;
          price_at_order?: number;
          product_id?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "shop_order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "shop_orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      shop_orders: {
        Row: {
          created_at: string | null;
          delivery_date: string;
          delivery_time: string | null;
          guest_id: string;
          hotel_id: string;
          id: string;
          processed_by: string | null;
          special_instructions: string | null;
          status: string;
          total_price: number;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          delivery_date: string;
          delivery_time?: string | null;
          guest_id: string;
          hotel_id: string;
          id?: string;
          processed_by?: string | null;
          special_instructions?: string | null;
          status?: string;
          total_price: number;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          delivery_date?: string;
          delivery_time?: string | null;
          guest_id?: string;
          hotel_id?: string;
          id?: string;
          processed_by?: string | null;
          special_instructions?: string | null;
          status?: string;
          total_price?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shop_orders_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_orders_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_orders_processed_by_fkey";
            columns: ["processed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      spatial_ref_sys: {
        Row: {
          auth_name: string | null;
          auth_srid: number | null;
          proj4text: string | null;
          srid: number;
          srtext: string | null;
        };
        Insert: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid: number;
          srtext?: string | null;
        };
        Update: {
          auth_name?: string | null;
          auth_srid?: number | null;
          proj4text?: string | null;
          srid?: number;
          srtext?: string | null;
        };
        Relationships: [];
      };
      staff_conversation_participants: {
        Row: {
          conversation_id: string;
          joined_at: string | null;
          staff_id: string;
        };
        Insert: {
          conversation_id: string;
          joined_at?: string | null;
          staff_id: string;
        };
        Update: {
          conversation_id?: string;
          joined_at?: string | null;
          staff_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_conversation_participants_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "staff_conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_conversation_participants_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          }
        ];
      };
      staff_conversation_reads: {
        Row: {
          conversation_id: string;
          last_read_at: string;
          staff_id: string;
        };
        Insert: {
          conversation_id: string;
          last_read_at?: string;
          staff_id: string;
        };
        Update: {
          conversation_id?: string;
          last_read_at?: string;
          staff_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_conversation_reads_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "staff_conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_conversation_reads_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          }
        ];
      };
      staff_conversations: {
        Row: {
          created_at: string | null;
          created_by: string;
          hotel_id: string;
          id: string;
          is_group: boolean | null;
          last_message_at: string | null;
          last_message_id: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          hotel_id: string;
          id?: string;
          is_group?: boolean | null;
          last_message_at?: string | null;
          last_message_id?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          hotel_id?: string;
          id?: string;
          is_group?: boolean | null;
          last_message_at?: string | null;
          last_message_id?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "staff_conversations_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_conversations_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_conversations_last_message_fk";
            columns: ["last_message_id"];
            isOneToOne: false;
            referencedRelation: "staff_messages";
            referencedColumns: ["id"];
          }
        ];
      };
      staff_messages: {
        Row: {
          content: string | null;
          conversation_id: string;
          created_at: string | null;
          deleted_at: string | null;
          file_url: string | null;
          id: string;
          sender_id: string;
          voice_url: string | null;
        };
        Insert: {
          content?: string | null;
          conversation_id: string;
          created_at?: string | null;
          deleted_at?: string | null;
          file_url?: string | null;
          id?: string;
          sender_id: string;
          voice_url?: string | null;
        };
        Update: {
          content?: string | null;
          conversation_id?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          file_url?: string | null;
          id?: string;
          sender_id?: string;
          voice_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "staff_messages_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: false;
            referencedRelation: "staff_conversations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          }
        ];
      };
      staff_schedules: {
        Row: {
          confirmed_at: string | null;
          confirmed_by: string | null;
          created_at: string | null;
          created_by: string | null;
          hotel_id: string;
          id: string;
          is_confirmed: boolean;
          notes: string | null;
          schedule_finish_date: string;
          schedule_start_date: string;
          shift_end: string;
          shift_start: string;
          staff_id: string;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id: string;
          id?: string;
          is_confirmed?: boolean;
          notes?: string | null;
          schedule_finish_date: string;
          schedule_start_date: string;
          shift_end: string;
          shift_start: string;
          staff_id: string;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          hotel_id?: string;
          id?: string;
          is_confirmed?: boolean;
          notes?: string | null;
          schedule_finish_date?: string;
          schedule_start_date?: string;
          shift_end?: string;
          shift_start?: string;
          staff_id?: string;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "staff_schedules_confirmed_by_fkey";
            columns: ["confirmed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_schedules_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_schedules_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_schedules_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          hotel_id: string;
          id: string;
          priority: string;
          staff_id: string | null;
          status: string;
          title: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          hotel_id: string;
          id?: string;
          priority: string;
          staff_id?: string | null;
          status?: string;
          title: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          hotel_id?: string;
          id?: string;
          priority?: string;
          staff_id?: string | null;
          status?: string;
          title?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "hotel_staff";
            referencedColumns: ["id"];
          }
        ];
      };
      terms_conditions: {
        Row: {
          agency_id: string;
          approved_at: string | null;
          approved_by: string | null;
          booking_deposit: number | null;
          content: string;
          created_at: string | null;
          created_by: string | null;
          data_retention_until: string | null;
          effective_date: string;
          id: string;
          is_active: boolean;
          title: string;
          updated_at: string | null;
          version: string;
        };
        Insert: {
          agency_id: string;
          approved_at?: string | null;
          approved_by?: string | null;
          booking_deposit?: number | null;
          content: string;
          created_at?: string | null;
          created_by?: string | null;
          data_retention_until?: string | null;
          effective_date: string;
          id?: string;
          is_active?: boolean;
          title: string;
          updated_at?: string | null;
          version: string;
        };
        Update: {
          agency_id?: string;
          approved_at?: string | null;
          approved_by?: string | null;
          booking_deposit?: number | null;
          content?: string;
          created_at?: string | null;
          created_by?: string | null;
          data_retention_until?: string | null;
          effective_date?: string;
          id?: string;
          is_active?: boolean;
          title?: string;
          updated_at?: string | null;
          version?: string;
        };
        Relationships: [];
      };
      tour_agencies: {
        Row: {
          address: string | null;
          city: string | null;
          contact_email: string;
          country: string | null;
          created_at: string | null;
          created_by: string | null;
          currency: string | null;
          description: string | null;
          id: string;
          is_active: boolean;
          location: unknown | null;
          logo_url: string | null;
          main_contact: string | null;
          name: string;
          owner_id: string;
          phone_number: string | null;
          stripe_account_id: string | null;
          tour_specialties: string[] | null;
          updated_at: string | null;
          website: string | null;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          contact_email: string;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          location?: unknown | null;
          logo_url?: string | null;
          main_contact?: string | null;
          name: string;
          owner_id: string;
          phone_number?: string | null;
          stripe_account_id?: string | null;
          tour_specialties?: string[] | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          contact_email?: string;
          country?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          location?: unknown | null;
          logo_url?: string | null;
          main_contact?: string | null;
          name?: string;
          owner_id?: string;
          phone_number?: string | null;
          stripe_account_id?: string | null;
          tour_specialties?: string[] | null;
          updated_at?: string | null;
          website?: string | null;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tour_agencies_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      tour_bookings: {
        Row: {
          accessibility_needs: string | null;
          agency_id: string;
          booking_date: string;
          booking_reference: string | null;
          booking_time: string | null;
          cancellation_reason: string | null;
          cancelled_at: string | null;
          completed_at: string | null;
          confirmed_at: string | null;
          created_at: string | null;
          created_by: string | null;
          data_retention_until: string | null;
          dietary_requirements: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          guest_id: string;
          hotel_id: string;
          id: string;
          number_of_participants: number;
          payment_status: string;
          preferred_language: string | null;
          processed_by: string | null;
          special_requests: string | null;
          status: string;
          total_amount: number;
          tour_details: Json | null;
          tour_id: string;
          updated_at: string | null;
        };
        Insert: {
          accessibility_needs?: string | null;
          agency_id: string;
          booking_date: string;
          booking_reference?: string | null;
          booking_time?: string | null;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          completed_at?: string | null;
          confirmed_at?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          data_retention_until?: string | null;
          dietary_requirements?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          guest_id: string;
          hotel_id: string;
          id?: string;
          number_of_participants?: number;
          payment_status?: string;
          preferred_language?: string | null;
          processed_by?: string | null;
          special_requests?: string | null;
          status?: string;
          total_amount?: number;
          tour_details?: Json | null;
          tour_id: string;
          updated_at?: string | null;
        };
        Update: {
          accessibility_needs?: string | null;
          agency_id?: string;
          booking_date?: string;
          booking_reference?: string | null;
          booking_time?: string | null;
          cancellation_reason?: string | null;
          cancelled_at?: string | null;
          completed_at?: string | null;
          confirmed_at?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          data_retention_until?: string | null;
          dietary_requirements?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          guest_id?: string;
          hotel_id?: string;
          id?: string;
          number_of_participants?: number;
          payment_status?: string;
          preferred_language?: string | null;
          processed_by?: string | null;
          special_requests?: string | null;
          status?: string;
          total_amount?: number;
          tour_details?: Json | null;
          tour_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tour_bookings_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "tour_agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tour_bookings_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tour_bookings_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tour_bookings_hotel_id_fkey";
            columns: ["hotel_id"];
            isOneToOne: false;
            referencedRelation: "hotels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tour_bookings_processed_by_fkey";
            columns: ["processed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tour_bookings_tour_id_fkey";
            columns: ["tour_id"];
            isOneToOne: false;
            referencedRelation: "tours";
            referencedColumns: ["id"];
          }
        ];
      };
      tours: {
        Row: {
          additional_info: string | null;
          agency_id: string;
          cancellation_policy: string | null;
          category: string;
          created_at: string | null;
          created_by: string | null;
          data_retention_until: string | null;
          description: string | null;
          discount_percentage: number | null;
          duration_hours: number;
          has_free_cancellation: boolean | null;
          id: string;
          image_description: string | null;
          image_url: string | null;
          is_available: boolean | null;
          is_last_minute: boolean | null;
          languages: string[] | null;
          location: unknown | null;
          max_group_size: number;
          meeting_address: string | null;
          meeting_point: string | null;
          name: string;
          original_price: number | null;
          price: number;
          priority: number | null;
          starting_hours: Json | null;
          updated_at: string | null;
          whats_included: string | null;
        };
        Insert: {
          additional_info?: string | null;
          agency_id: string;
          cancellation_policy?: string | null;
          category: string;
          created_at?: string | null;
          created_by?: string | null;
          data_retention_until?: string | null;
          description?: string | null;
          discount_percentage?: number | null;
          duration_hours: number;
          has_free_cancellation?: boolean | null;
          id?: string;
          image_description?: string | null;
          image_url?: string | null;
          is_available?: boolean | null;
          is_last_minute?: boolean | null;
          languages?: string[] | null;
          location?: unknown | null;
          max_group_size: number;
          meeting_address?: string | null;
          meeting_point?: string | null;
          name: string;
          original_price?: number | null;
          price: number;
          priority?: number | null;
          starting_hours?: Json | null;
          updated_at?: string | null;
          whats_included?: string | null;
        };
        Update: {
          additional_info?: string | null;
          agency_id?: string;
          cancellation_policy?: string | null;
          category?: string;
          created_at?: string | null;
          created_by?: string | null;
          data_retention_until?: string | null;
          description?: string | null;
          discount_percentage?: number | null;
          duration_hours?: number;
          has_free_cancellation?: boolean | null;
          id?: string;
          image_description?: string | null;
          image_url?: string | null;
          is_available?: boolean | null;
          is_last_minute?: boolean | null;
          languages?: string[] | null;
          location?: unknown | null;
          max_group_size?: number;
          meeting_address?: string | null;
          meeting_point?: string | null;
          name?: string;
          original_price?: number | null;
          price?: number;
          priority?: number | null;
          starting_hours?: Json | null;
          updated_at?: string | null;
          whats_included?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tours_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "tour_agencies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tours_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_personal_data: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          date_of_birth: string;
          first_name: string;
          last_name: string;
          phone_number: string | null;
          updated_at: string | null;
          user_id: string;
          zip_code: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          date_of_birth: string;
          first_name: string;
          last_name: string;
          phone_number?: string | null;
          updated_at?: string | null;
          user_id: string;
          zip_code?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          date_of_birth?: string;
          first_name?: string;
          last_name?: string;
          phone_number?: string | null;
          updated_at?: string | null;
          user_id?: string;
          zip_code?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_personal_data_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null;
          f_geography_column: unknown | null;
          f_table_catalog: unknown | null;
          f_table_name: unknown | null;
          f_table_schema: unknown | null;
          srid: number | null;
          type: string | null;
        };
        Relationships: [];
      };
      geometry_columns: {
        Row: {
          coord_dimension: number | null;
          f_geometry_column: unknown | null;
          f_table_catalog: string | null;
          f_table_name: unknown | null;
          f_table_schema: unknown | null;
          srid: number | null;
          type: string | null;
        };
        Insert: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown | null;
          f_table_catalog?: string | null;
          f_table_name?: unknown | null;
          f_table_schema?: unknown | null;
          srid?: number | null;
          type?: string | null;
        };
        Update: {
          coord_dimension?: number | null;
          f_geometry_column?: unknown | null;
          f_table_catalog?: string | null;
          f_table_name?: unknown | null;
          f_table_schema?: unknown | null;
          srid?: number | null;
          type?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string };
        Returns: undefined;
      };
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown };
        Returns: unknown;
      };
      _postgis_pgsql_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      _postgis_scripts_pgsql_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown };
        Returns: number;
      };
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_bestsrid: {
        Args: { "": unknown };
        Returns: number;
      };
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      _st_equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_pointoutside: {
        Args: { "": unknown };
        Returns: unknown;
      };
      _st_sortablehash: {
        Args: { geom: unknown };
        Returns: number;
      };
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      _st_voronoi: {
        Args: {
          clip?: unknown;
          g1: unknown;
          return_polygons?: boolean;
          tolerance?: number;
        };
        Returns: unknown;
      };
      _st_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      addauth: {
        Args: { "": string };
        Returns: boolean;
      };
      addgeometrycolumn: {
        Args:
          | {
              catalog_name: string;
              column_name: string;
              new_dim: number;
              new_srid_in: number;
              new_type: string;
              schema_name: string;
              table_name: string;
              use_typmod?: boolean;
            }
          | {
              column_name: string;
              new_dim: number;
              new_srid: number;
              new_type: string;
              schema_name: string;
              table_name: string;
              use_typmod?: boolean;
            }
          | {
              column_name: string;
              new_dim: number;
              new_srid: number;
              new_type: string;
              table_name: string;
              use_typmod?: boolean;
            };
        Returns: string;
      };
      anonymize_expired_tour_booking_data: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      anonymize_expired_tour_data: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      box: {
        Args: { "": unknown } | { "": unknown };
        Returns: unknown;
      };
      box2d: {
        Args: { "": unknown } | { "": unknown };
        Returns: unknown;
      };
      box2d_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box2d_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box2df_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box2df_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box3d: {
        Args: { "": unknown } | { "": unknown };
        Returns: unknown;
      };
      box3d_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box3d_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      box3dtobox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      bytea: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number };
        Returns: number;
      };
      cleanup_expired_personal_data: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      cleanup_expired_recommended_places_data: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      cleanup_expired_schedule_data: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      create_conversation_and_first_message: {
        Args: {
          p_guest_id: string;
          p_hotel_id: string;
          p_message_text: string;
          p_original_language: string;
        };
        Returns: {
          ai_analysis_completed: boolean | null;
          conversation_id: string;
          created_at: string;
          created_by: string | null;
          guest_id: string | null;
          hotel_id: string | null;
          id: string;
          is_read: boolean;
          is_translated: boolean;
          message_text: string;
          original_language: string | null;
          original_text: string | null;
          priority: number | null;
          sender_type: string;
          sentiment: string | null;
          staff_translation: string | null;
          subtopics: string | null;
          target_language: string | null;
          topics: string[] | null;
          translated_text: string | null;
          updated_at: string;
          urgency: string | null;
        };
      };
      current_staff_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      disablelongtransactions: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      dropgeometrycolumn: {
        Args:
          | {
              catalog_name: string;
              column_name: string;
              schema_name: string;
              table_name: string;
            }
          | { column_name: string; schema_name: string; table_name: string }
          | { column_name: string; table_name: string };
        Returns: string;
      };
      dropgeometrytable: {
        Args:
          | { catalog_name: string; schema_name: string; table_name: string }
          | { schema_name: string; table_name: string }
          | { table_name: string };
        Returns: string;
      };
      enablelongtransactions: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      find_or_create_direct_conversation: {
        Args: { other_staff_id: string };
        Returns: string;
      };
      generate_employee_id: {
        Args: { hotel_id_param: string };
        Returns: string;
      };
      geography: {
        Args: { "": string } | { "": unknown };
        Returns: unknown;
      };
      geography_analyze: {
        Args: { "": unknown };
        Returns: boolean;
      };
      geography_gist_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_gist_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_send: {
        Args: { "": unknown };
        Returns: string;
      };
      geography_spgist_compress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geography_typmod_in: {
        Args: { "": unknown[] };
        Returns: number;
      };
      geography_typmod_out: {
        Args: { "": number };
        Returns: unknown;
      };
      geometry: {
        Args:
          | { "": string }
          | { "": string }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown }
          | { "": unknown };
        Returns: unknown;
      };
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_analyze: {
        Args: { "": unknown };
        Returns: boolean;
      };
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_gist_compress_2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_compress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_decompress_2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_decompress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_gist_sortsupport_2d: {
        Args: { "": unknown };
        Returns: undefined;
      };
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_hash: {
        Args: { "": unknown };
        Returns: number;
      };
      geometry_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_recv: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometry_send: {
        Args: { "": unknown };
        Returns: string;
      };
      geometry_sortsupport: {
        Args: { "": unknown };
        Returns: undefined;
      };
      geometry_spgist_compress_2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_spgist_compress_3d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_spgist_compress_nd: {
        Args: { "": unknown };
        Returns: unknown;
      };
      geometry_typmod_in: {
        Args: { "": unknown[] };
        Returns: number;
      };
      geometry_typmod_out: {
        Args: { "": number };
        Returns: unknown;
      };
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      geometrytype: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      geomfromewkb: {
        Args: { "": string };
        Returns: unknown;
      };
      geomfromewkt: {
        Args: { "": string };
        Returns: unknown;
      };
      get_cache_stats: {
        Args: { p_hotel_id: string };
        Returns: {
          hours_old: number;
          last_updated: string;
          place_type: string;
          total_places: number;
        }[];
      };
      get_current_jwt_payload: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_hotel_coordinates: {
        Args: { hotel_id: string };
        Returns: {
          latitude: number;
          longitude: number;
          name: string;
        }[];
      };
      get_hotel_location_wkt: {
        Args:
          | { h: Database["public"]["Tables"]["hotels"]["Row"] }
          | { p_hotel_id: string };
        Returns: string;
      };
      get_hotels_for_agency: {
        Args: { agency_id_param: string };
        Returns: {
          address: string;
          approval_created_at: string;
          approval_status: string;
          approval_updated_at: string;
          city: string;
          contact_email: string;
          country: string;
          created_at: string;
          created_by: string;
          created_by_full_name: string;
          description: string;
          id: string;
          is_active: boolean;
          location_text: string;
          main_contact: string;
          name: string;
          official_languages: string[];
          owner_full_name: string;
          owner_id: string;
          phone_number: string;
          reception_phone: string;
          services: string[];
          stripe_account_id: string;
          updated_at: string;
          website: string;
          zip_code: string;
        }[];
      };
      get_hotels_with_location: {
        Args: Record<PropertyKey, never>;
        Returns: {
          address: string;
          city: string;
          contact_email: string;
          country: string;
          created_at: string;
          created_by: string;
          created_by_full_name: string;
          description: string;
          id: string;
          is_active: boolean;
          location_text: string;
          main_contact: string;
          name: string;
          official_languages: string[];
          owner_full_name: string;
          owner_id: string;
          phone_number: string;
          reception_phone: string;
          services: string[];
          stripe_account_id: string;
          updated_at: string;
          website: string;
          zip_code: string;
        }[];
      };
      get_nearby_restaurants: {
        Args: {
          p_distance_meters?: number;
          p_latitude: number;
          p_longitude: number;
        };
        Returns: {
          address: string;
          city: string;
          contact_email: string;
          country: string;
          created_at: string;
          created_by: string;
          created_by_full_name: string;
          cuisine_type: string;
          description: string;
          id: string;
          is_active: boolean;
          location_text: string;
          name: string;
          owner_full_name: string;
          owner_id: string;
          phone_number: string;
          stripe_account_id: string;
          updated_at: string;
          website: string;
          zip_code: string;
        }[];
      };
      get_nearby_tour_agencies: {
        Args: {
          p_distance_meters?: number;
          p_latitude: number;
          p_longitude: number;
        };
        Returns: {
          address: string;
          city: string;
          contact_email: string;
          country: string;
          created_at: string;
          created_by: string;
          created_by_full_name: string;
          description: string;
          id: string;
          is_active: boolean;
          location_text: string;
          name: string;
          owner_full_name: string;
          owner_id: string;
          phone_number: string;
          stripe_account_id: string;
          tour_specialties: string[];
          updated_at: string;
          website: string;
          zip_code: string;
        }[];
      };
      get_or_create_guest_conversation: {
        Args: { p_guest_id: string; p_hotel_id: string };
        Returns: {
          assigned_staff_id: string | null;
          created_at: string;
          guest_id: string;
          hotel_id: string;
          id: string;
          last_message_at: string;
          status: string;
          subject: string | null;
          updated_at: string;
        };
      };
      get_proj4_from_srid: {
        Args: { "": number };
        Returns: string;
      };
      get_restaurants_with_location: {
        Args: Record<PropertyKey, never>;
        Returns: {
          address: string;
          city: string;
          contact_email: string;
          country: string;
          created_at: string;
          created_by: string;
          created_by_full_name: string;
          cuisine_type: string;
          description: string;
          id: string;
          is_active: boolean;
          location_text: string;
          main_contact: string;
          name: string;
          owner_id: string;
          phone_number: string;
          stripe_account_id: string;
          updated_at: string;
          website: string;
          zip_code: string;
        }[];
      };
      get_staff_schedules_with_names: {
        Args: {
          p_end_date?: string;
          p_hotel_id: string;
          p_start_date?: string;
        };
        Returns: {
          actual_end_time: string;
          actual_start_time: string;
          confirmed_at: string;
          confirmed_by: string;
          created_at: string;
          created_by: string;
          hotel_id: string;
          id: string;
          is_confirmed: boolean;
          notes: string;
          schedule_date: string;
          shift_end: string;
          shift_start: string;
          shift_type: string;
          staff_department: string;
          staff_id: string;
          staff_initials: string;
          staff_name: string;
          staff_position: string;
          status: string;
          total_hours_worked: unknown;
          updated_at: string;
        }[];
      };
      get_stale_place_types: {
        Args: { p_hotel_id: string; p_hours?: number };
        Returns: {
          count: number;
          last_update: string;
          place_type: string;
        }[];
      };
      get_tasks_with_staff_names: {
        Args: { p_hotel_id: string };
        Returns: {
          assigned_to: string;
          assigned_to_name: string;
          created_at: string;
          created_by: string;
          created_by_full_name: string;
          description: string;
          due_date: string;
          due_time: string;
          hotel_id: string;
          id: string;
          priority: string;
          status: string;
          title: string;
          type: string;
          updated_at: string;
        }[];
      };
      get_tour_agencies_with_location: {
        Args: Record<PropertyKey, never>;
        Returns: {
          address: string;
          city: string;
          contact_email: string;
          country: string;
          created_at: string;
          created_by: string;
          created_by_full_name: string;
          description: string;
          id: string;
          is_active: boolean;
          location_text: string;
          main_contact: string;
          name: string;
          owner_id: string;
          phone_number: string;
          stripe_account_id: string;
          tour_specialties: string[];
          updated_at: string;
          website: string;
          zip_code: string;
        }[];
      };
      get_tour_locations: {
        Args: { agency_id_param: string };
        Returns: {
          location_text: string;
          tour_id: string;
        }[];
      };
      gettransactionid: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      gidx_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gidx_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { "": unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      hash_verification_code: {
        Args: { code: string };
        Returns: string;
      };
      is_active_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_elvira_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_elvira_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_guest_in_conversation: {
        Args: { p_conversation_id: string; p_guest_id: string };
        Returns: boolean;
      };
      is_hotel_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_hotel_owner: {
        Args: { p_hotel_id: string };
        Returns: boolean;
      };
      is_participant: {
        Args: { convo: string };
        Returns: boolean;
      };
      is_third_party_approved_for_hotel: {
        Args: {
          p_hotel_id: string;
          p_third_party_id: string;
          p_third_party_type: string;
        };
        Returns: boolean;
      };
      json: {
        Args: { "": unknown };
        Returns: Json;
      };
      jsonb: {
        Args: { "": unknown };
        Returns: Json;
      };
      list_my_conversations: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          is_group: boolean;
          last_message_at: string;
          last_message_id: string;
          title: string;
          unread_count: number;
        }[];
      };
      longtransactionsenabled: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      mark_conversation_read: {
        Args: { p_conversation: string };
        Returns: undefined;
      };
      path: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_asflatgeobuf_finalfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_asgeobuf_finalfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_asmvt_finalfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_asmvt_serialfn: {
        Args: { "": unknown };
        Returns: string;
      };
      pgis_geometry_clusterintersecting_finalfn: {
        Args: { "": unknown };
        Returns: unknown[];
      };
      pgis_geometry_clusterwithin_finalfn: {
        Args: { "": unknown };
        Returns: unknown[];
      };
      pgis_geometry_collect_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_makeline_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_polygonize_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_union_parallel_finalfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      pgis_geometry_union_parallel_serialfn: {
        Args: { "": unknown };
        Returns: string;
      };
      point: {
        Args: { "": unknown };
        Returns: unknown;
      };
      polygon: {
        Args: { "": unknown };
        Returns: unknown;
      };
      populate_geometry_columns: {
        Args:
          | { tbl_oid: unknown; use_typmod?: boolean }
          | { use_typmod?: boolean };
        Returns: string;
      };
      postgis_addbbox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: number;
      };
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: number;
      };
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string };
        Returns: string;
      };
      postgis_dropbbox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_extensions_upgrade: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_full_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_geos_noop: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_geos_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_getbbox: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_hasbbox: {
        Args: { "": unknown };
        Returns: boolean;
      };
      postgis_index_supportfn: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_lib_build_date: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_lib_revision: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_lib_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_libjson_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_liblwgeom_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_libprotobuf_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_libxml_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_noop: {
        Args: { "": unknown };
        Returns: unknown;
      };
      postgis_proj_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_scripts_build_date: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_scripts_installed: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_scripts_released: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_svn_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_type_name: {
        Args: {
          coord_dimension: number;
          geomname: string;
          use_new_name?: boolean;
        };
        Returns: string;
      };
      postgis_typmod_dims: {
        Args: { "": number };
        Returns: number;
      };
      postgis_typmod_srid: {
        Args: { "": number };
        Returns: number;
      };
      postgis_typmod_type: {
        Args: { "": number };
        Returns: string;
      };
      postgis_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      postgis_wagyu_version: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      reset_room_cleaning_status_daily: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      same_active_hotel_staff: {
        Args: { target_staff: string };
        Returns: boolean;
      };
      same_hotel_active: {
        Args: { p_staff: string };
        Returns: boolean;
      };
      send_first_guest_message: {
        Args: {
          p_guest_id: string;
          p_hotel_id: string;
          p_message_text: string;
          p_original_language: string;
        };
        Returns: {
          ai_analysis_completed: boolean | null;
          conversation_id: string;
          created_at: string;
          created_by: string | null;
          guest_id: string | null;
          hotel_id: string | null;
          id: string;
          is_read: boolean;
          is_translated: boolean;
          message_text: string;
          original_language: string | null;
          original_text: string | null;
          priority: number | null;
          sender_type: string;
          sentiment: string | null;
          staff_translation: string | null;
          subtopics: string | null;
          target_language: string | null;
          topics: string[] | null;
          translated_text: string | null;
          updated_at: string;
          urgency: string | null;
        };
      };
      set_limit: {
        Args: { "": number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { "": string };
        Returns: string[];
      };
      spheroid_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      spheroid_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_3dlength: {
        Args: { "": unknown };
        Returns: number;
      };
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_3dperimeter: {
        Args: { "": unknown };
        Returns: number;
      };
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_angle: {
        Args:
          | { line1: unknown; line2: unknown }
          | { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown };
        Returns: number;
      };
      st_area: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean };
        Returns: number;
      };
      st_area2d: {
        Args: { "": unknown };
        Returns: number;
      };
      st_asbinary: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number };
        Returns: string;
      };
      st_asewkb: {
        Args: { "": unknown };
        Returns: string;
      };
      st_asewkt: {
        Args: { "": string } | { "": unknown } | { "": unknown };
        Returns: string;
      };
      st_asgeojson: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; options?: number }
          | { geom: unknown; maxdecimaldigits?: number; options?: number }
          | {
              geom_column?: string;
              maxdecimaldigits?: number;
              pretty_bool?: boolean;
              r: Record<string, unknown>;
            };
        Returns: string;
      };
      st_asgml: {
        Args:
          | { "": string }
          | {
              geog: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
            }
          | {
              geog: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
              version: number;
            }
          | {
              geom: unknown;
              id?: string;
              maxdecimaldigits?: number;
              nprefix?: string;
              options?: number;
              version: number;
            }
          | { geom: unknown; maxdecimaldigits?: number; options?: number };
        Returns: string;
      };
      st_ashexewkb: {
        Args: { "": unknown };
        Returns: string;
      };
      st_askml: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
          | { geom: unknown; maxdecimaldigits?: number; nprefix?: string };
        Returns: string;
      };
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string };
        Returns: string;
      };
      st_asmarc21: {
        Args: { format?: string; geom: unknown };
        Returns: string;
      };
      st_asmvtgeom: {
        Args: {
          bounds: unknown;
          buffer?: number;
          clip_geom?: boolean;
          extent?: number;
          geom: unknown;
        };
        Returns: unknown;
      };
      st_assvg: {
        Args:
          | { "": string }
          | { geog: unknown; maxdecimaldigits?: number; rel?: number }
          | { geom: unknown; maxdecimaldigits?: number; rel?: number };
        Returns: string;
      };
      st_astext: {
        Args: { "": string } | { "": unknown } | { "": unknown };
        Returns: string;
      };
      st_astwkb: {
        Args:
          | {
              geom: unknown[];
              ids: number[];
              prec?: number;
              prec_m?: number;
              prec_z?: number;
              with_boxes?: boolean;
              with_sizes?: boolean;
            }
          | {
              geom: unknown;
              prec?: number;
              prec_m?: number;
              prec_z?: number;
              with_boxes?: boolean;
              with_sizes?: boolean;
            };
        Returns: string;
      };
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number };
        Returns: string;
      };
      st_azimuth: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_boundary: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown };
        Returns: unknown;
      };
      st_buffer: {
        Args:
          | { geom: unknown; options?: string; radius: number }
          | { geom: unknown; quadsegs: number; radius: number };
        Returns: unknown;
      };
      st_buildarea: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_centroid: {
        Args: { "": string } | { "": unknown };
        Returns: unknown;
      };
      st_cleangeometry: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown };
        Returns: unknown;
      };
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_clusterintersecting: {
        Args: { "": unknown[] };
        Returns: unknown[];
      };
      st_collect: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_collectionextract: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_collectionhomogenize: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean;
          param_geom: unknown;
          param_pctconvex: number;
        };
        Returns: unknown;
      };
      st_contains: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_convexhull: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_coorddim: {
        Args: { geometry: unknown };
        Returns: number;
      };
      st_coveredby: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_covers: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_crosses: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number };
        Returns: unknown;
      };
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_dimension: {
        Args: { "": unknown };
        Returns: number;
      };
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_distance: {
        Args:
          | { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
          | { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_distancesphere: {
        Args:
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; radius: number };
        Returns: number;
      };
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_dump: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dumppoints: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dumprings: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dumpsegments: {
        Args: { "": unknown };
        Returns: Database["public"]["CompositeTypes"]["geometry_dump"][];
      };
      st_dwithin: {
        Args: {
          geog1: unknown;
          geog2: unknown;
          tolerance: number;
          use_spheroid?: boolean;
        };
        Returns: boolean;
      };
      st_endpoint: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_envelope: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_equals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_expand: {
        Args:
          | { box: unknown; dx: number; dy: number }
          | { box: unknown; dx: number; dy: number; dz?: number }
          | { dm?: number; dx: number; dy: number; dz?: number; geom: unknown };
        Returns: unknown;
      };
      st_exteriorring: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_flipcoordinates: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_force2d: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_force3d: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number };
        Returns: unknown;
      };
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number };
        Returns: unknown;
      };
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number };
        Returns: unknown;
      };
      st_forcecollection: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcecurve: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcepolygonccw: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcepolygoncw: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcerhr: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_forcesfs: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_generatepoints: {
        Args:
          | { area: unknown; npoints: number }
          | { area: unknown; npoints: number; seed: number };
        Returns: unknown;
      };
      st_geogfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geogfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geographyfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geohash: {
        Args:
          | { geog: unknown; maxchars?: number }
          | { geom: unknown; maxchars?: number };
        Returns: string;
      };
      st_geomcollfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomcollfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean;
          g: unknown;
          max_iter?: number;
          tolerance?: number;
        };
        Returns: unknown;
      };
      st_geometryfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geometrytype: {
        Args: { "": unknown };
        Returns: string;
      };
      st_geomfromewkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromewkt: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromgeojson: {
        Args: { "": Json } | { "": Json } | { "": string };
        Returns: unknown;
      };
      st_geomfromgml: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromkml: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfrommarc21: {
        Args: { marc21xml: string };
        Returns: unknown;
      };
      st_geomfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromtwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_geomfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_gmltosql: {
        Args: { "": string };
        Returns: unknown;
      };
      st_hasarc: {
        Args: { geometry: unknown };
        Returns: boolean;
      };
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_hexagon: {
        Args: {
          cell_i: number;
          cell_j: number;
          origin?: unknown;
          size: number;
        };
        Returns: unknown;
      };
      st_hexagongrid: {
        Args: { bounds: unknown; size: number };
        Returns: Record<string, unknown>[];
      };
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown };
        Returns: number;
      };
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_intersects: {
        Args:
          | { geog1: unknown; geog2: unknown }
          | { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_isclosed: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_iscollection: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isempty: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_ispolygonccw: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_ispolygoncw: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isring: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_issimple: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isvalid: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown };
        Returns: Database["public"]["CompositeTypes"]["valid_detail"];
      };
      st_isvalidreason: {
        Args: { "": unknown };
        Returns: string;
      };
      st_isvalidtrajectory: {
        Args: { "": unknown };
        Returns: boolean;
      };
      st_length: {
        Args:
          | { "": string }
          | { "": unknown }
          | { geog: unknown; use_spheroid?: boolean };
        Returns: number;
      };
      st_length2d: {
        Args: { "": unknown };
        Returns: number;
      };
      st_letters: {
        Args: { font?: Json; letters: string };
        Returns: unknown;
      };
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown };
        Returns: number;
      };
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string };
        Returns: unknown;
      };
      st_linefrommultipoint: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_linefromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_linefromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_linemerge: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_linestringfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_linetocurve: {
        Args: { geometry: unknown };
        Returns: unknown;
      };
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number };
        Returns: unknown;
      };
      st_locatebetween: {
        Args: {
          frommeasure: number;
          geometry: unknown;
          leftrightoffset?: number;
          tomeasure: number;
        };
        Returns: unknown;
      };
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number };
        Returns: unknown;
      };
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_m: {
        Args: { "": unknown };
        Returns: number;
      };
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makeline: {
        Args: { "": unknown[] } | { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_makepolygon: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_makevalid: {
        Args: { "": unknown } | { geom: unknown; params: string };
        Returns: unknown;
      };
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: number;
      };
      st_maximuminscribedcircle: {
        Args: { "": unknown };
        Returns: Record<string, unknown>;
      };
      st_memsize: {
        Args: { "": unknown };
        Returns: number;
      };
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number };
        Returns: unknown;
      };
      st_minimumboundingradius: {
        Args: { "": unknown };
        Returns: Record<string, unknown>;
      };
      st_minimumclearance: {
        Args: { "": unknown };
        Returns: number;
      };
      st_minimumclearanceline: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_mlinefromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mlinefromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpointfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpointfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpolyfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_mpolyfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multi: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_multilinefromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multilinestringfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipointfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipointfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipolyfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_multipolygonfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_ndims: {
        Args: { "": unknown };
        Returns: number;
      };
      st_node: {
        Args: { g: unknown };
        Returns: unknown;
      };
      st_normalize: {
        Args: { geom: unknown };
        Returns: unknown;
      };
      st_npoints: {
        Args: { "": unknown };
        Returns: number;
      };
      st_nrings: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numgeometries: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numinteriorring: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numinteriorrings: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numpatches: {
        Args: { "": unknown };
        Returns: number;
      };
      st_numpoints: {
        Args: { "": unknown };
        Returns: number;
      };
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string };
        Returns: unknown;
      };
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_orientedenvelope: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_perimeter: {
        Args: { "": unknown } | { geog: unknown; use_spheroid?: boolean };
        Returns: number;
      };
      st_perimeter2d: {
        Args: { "": unknown };
        Returns: number;
      };
      st_pointfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_pointfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_pointm: {
        Args: {
          mcoordinate: number;
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
        };
        Returns: unknown;
      };
      st_pointonsurface: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_points: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_pointz: {
        Args: {
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
        };
        Returns: unknown;
      };
      st_pointzm: {
        Args: {
          mcoordinate: number;
          srid?: number;
          xcoordinate: number;
          ycoordinate: number;
          zcoordinate: number;
        };
        Returns: unknown;
      };
      st_polyfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polyfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polygonfromtext: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polygonfromwkb: {
        Args: { "": string };
        Returns: unknown;
      };
      st_polygonize: {
        Args: { "": unknown[] };
        Returns: unknown;
      };
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown };
        Returns: unknown;
      };
      st_quantizecoordinates: {
        Args: {
          g: unknown;
          prec_m?: number;
          prec_x: number;
          prec_y?: number;
          prec_z?: number;
        };
        Returns: unknown;
      };
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number };
        Returns: unknown;
      };
      st_relate: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: string;
      };
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_reverse: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number };
        Returns: unknown;
      };
      st_setsrid: {
        Args: { geog: unknown; srid: number } | { geom: unknown; srid: number };
        Returns: unknown;
      };
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_shiftlongitude: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number };
        Returns: unknown;
      };
      st_split: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_square: {
        Args: {
          cell_i: number;
          cell_j: number;
          origin?: unknown;
          size: number;
        };
        Returns: unknown;
      };
      st_squaregrid: {
        Args: { bounds: unknown; size: number };
        Returns: Record<string, unknown>[];
      };
      st_srid: {
        Args: { geog: unknown } | { geom: unknown };
        Returns: number;
      };
      st_startpoint: {
        Args: { "": unknown };
        Returns: unknown;
      };
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number };
        Returns: unknown[];
      };
      st_summary: {
        Args: { "": unknown } | { "": unknown };
        Returns: string;
      };
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown };
        Returns: unknown;
      };
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number };
        Returns: unknown;
      };
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: unknown;
      };
      st_tileenvelope: {
        Args: {
          bounds?: unknown;
          margin?: number;
          x: number;
          y: number;
          zoom: number;
        };
        Returns: unknown;
      };
      st_touches: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_transform: {
        Args:
          | { from_proj: string; geom: unknown; to_proj: string }
          | { from_proj: string; geom: unknown; to_srid: number }
          | { geom: unknown; to_proj: string };
        Returns: unknown;
      };
      st_triangulatepolygon: {
        Args: { g1: unknown };
        Returns: unknown;
      };
      st_union: {
        Args:
          | { "": unknown[] }
          | { geom1: unknown; geom2: unknown }
          | { geom1: unknown; geom2: unknown; gridsize: number };
        Returns: unknown;
      };
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number };
        Returns: unknown;
      };
      st_within: {
        Args: { geom1: unknown; geom2: unknown };
        Returns: boolean;
      };
      st_wkbtosql: {
        Args: { wkb: string };
        Returns: unknown;
      };
      st_wkttosql: {
        Args: { "": string };
        Returns: unknown;
      };
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number };
        Returns: unknown;
      };
      st_x: {
        Args: { "": unknown };
        Returns: number;
      };
      st_xmax: {
        Args: { "": unknown };
        Returns: number;
      };
      st_xmin: {
        Args: { "": unknown };
        Returns: number;
      };
      st_y: {
        Args: { "": unknown };
        Returns: number;
      };
      st_ymax: {
        Args: { "": unknown };
        Returns: number;
      };
      st_ymin: {
        Args: { "": unknown };
        Returns: number;
      };
      st_z: {
        Args: { "": unknown };
        Returns: number;
      };
      st_zmax: {
        Args: { "": unknown };
        Returns: number;
      };
      st_zmflag: {
        Args: { "": unknown };
        Returns: number;
      };
      st_zmin: {
        Args: { "": unknown };
        Returns: number;
      };
      staff_can_access_hotel: {
        Args: { target_hotel: string };
        Returns: boolean;
      };
      text: {
        Args: { "": unknown };
        Returns: string;
      };
      unlockrows: {
        Args: { "": string };
        Returns: number;
      };
      updategeometrysrid: {
        Args: {
          catalogn_name: string;
          column_name: string;
          new_srid_in: number;
          schema_name: string;
          table_name: string;
        };
        Returns: string;
      };
      user_is_participant: {
        Args: { p_conversation: string };
        Returns: boolean;
      };
      verify_guest_code: {
        Args: { p_code: string; p_room: string };
        Returns: {
          access_code_expires_at: string;
          created_at: string | null;
          created_by: string | null;
          dnd_status: boolean;
          guest_group_id: string | null;
          guest_group_name: string | null;
          guest_name: string;
          hashed_verification_code: string;
          hotel_id: string;
          id: string;
          is_active: boolean;
          is_primary_guest: boolean | null;
          room_number: string;
          updated_at: string | null;
        };
      };
      verify_verification_code: {
        Args: { input_code: string; stored_hash: string };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null;
        geom: unknown | null;
      };
      valid_detail: {
        valid: boolean | null;
        reason: string | null;
        location: unknown | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
