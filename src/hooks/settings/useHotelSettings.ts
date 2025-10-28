import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../realtime/useRealtimeSubscription";
import type { Database } from "../../types/database";

type HotelSetting = Database["public"]["Tables"]["hotel_settings"]["Row"];
type HotelSettingInsert =
  Database["public"]["Tables"]["hotel_settings"]["Insert"];
type HotelSettingUpdate =
  Database["public"]["Tables"]["hotel_settings"]["Update"];

const HOTEL_SETTINGS_QUERY_KEY = "hotel-settings";

/**
 * Fetch hotel settings for a specific hotel
 */
export function useHotelSettings(hotelId: string | undefined) {
  const query = useOptimizedQuery<HotelSetting[]>({
    queryKey: [HOTEL_SETTINGS_QUERY_KEY, hotelId],
    queryFn: async () => {
      if (!hotelId) return [];

      const { data, error } = await supabase
        .from("hotel_settings")
        .select("*")
        .eq("hotel_id", hotelId)
        .order("setting_key", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  });

  // Real-time subscription
  useRealtimeSubscription({
    table: "hotel_settings",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: [HOTEL_SETTINGS_QUERY_KEY, hotelId],
    enabled: !!hotelId,
  });

  return query;
}

/**
 * Fetch settings for the current hotel
 */
export function useCurrentHotelSettings() {
  const [hotelId, setHotelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getHotelId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (profile) {
          const { data: hotel } = await supabase
            .from("hotels")
            .select("id")
            .eq("owner_id", profile.id)
            .single();

          if (hotel) {
            setHotelId(hotel.id);
          }
        }
      }
    };

    getHotelId();
  }, []);

  return useHotelSettings(hotelId);
}

/**
 * Get a specific setting by key
 */
export function useHotelSettingByKey(
  hotelId: string | undefined,
  settingKey: string | undefined
) {
  return useOptimizedQuery<HotelSetting | null>({
    queryKey: [HOTEL_SETTINGS_QUERY_KEY, hotelId, "key", settingKey],
    queryFn: async () => {
      if (!hotelId || !settingKey) return null;

      const { data, error } = await supabase
        .from("hotel_settings")
        .select("*")
        .eq("hotel_id", hotelId)
        .eq("setting_key", settingKey)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!hotelId && !!settingKey,
    config: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}

/**
 * Create or update a hotel setting
 */
export function useUpsertHotelSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (setting: HotelSettingInsert) => {
      const { data, error } = await supabase
        .from("hotel_settings")
        .upsert(setting, {
          onConflict: "hotel_id,setting_key",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: HotelSetting) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_SETTINGS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Update a hotel setting
 */
export function useUpdateHotelSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: HotelSettingUpdate;
    }) => {
      const { data, error } = await supabase
        .from("hotel_settings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: HotelSetting) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_SETTINGS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Toggle setting value (for boolean settings)
 */
export function useToggleHotelSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      settingValue,
    }: {
      id: string;
      settingValue: boolean;
    }) => {
      const { data, error } = await supabase
        .from("hotel_settings")
        .update({ setting_value: settingValue })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: HotelSetting) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_SETTINGS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Toggle setting value by key (creates if doesn't exist)
 */
export function useToggleHotelSettingByKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelId,
      settingKey,
      settingValue,
      createdBy,
    }: {
      hotelId: string;
      settingKey: string;
      settingValue: boolean;
      createdBy?: string;
    }) => {
      const { data, error } = await supabase
        .from("hotel_settings")
        .upsert(
          {
            hotel_id: hotelId,
            setting_key: settingKey,
            setting_value: settingValue,
            created_by: createdBy,
          },
          {
            onConflict: "hotel_id,setting_key",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data: HotelSetting) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_SETTINGS_QUERY_KEY, data.hotel_id],
      });
    },
  });
}

/**
 * Delete a hotel setting
 */
export function useDeleteHotelSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hotelId }: { id: string; hotelId: string }) => {
      const { error } = await supabase
        .from("hotel_settings")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, hotelId };
    },
    onSuccess: (data: { id: string; hotelId: string }) => {
      queryClient.invalidateQueries({
        queryKey: [HOTEL_SETTINGS_QUERY_KEY, data.hotelId],
      });
    },
  });
}
