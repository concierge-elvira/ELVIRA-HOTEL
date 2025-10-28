import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type Inserts } from "../../../services/supabase";
import { queryKeys } from "../../../lib/react-query";
import { useCurrentUserHotelId } from "../../useCurrentUserHotel";
import { useAuth } from "../../useAuth";
import { useOptimizedQuery } from "../../api/useOptimizedQuery";
import { useRealtimeSubscription } from "../../realtime/useRealtimeSubscription";

/**
 * Hook to fetch tasks for a specific hotel
 * Includes real-time updates and performance optimization
 */
export function useTaskAssignment(hotelId?: string) {
  const result = useOptimizedQuery({
    queryKey: queryKeys.tasksByHotel(hotelId || ""),
    queryFn: async () => {
      if (!hotelId) {
return [];
      }

      const { data, error } = await supabase
        .from("tasks")
        .select(
          `
          *,
          assigned_staff:hotel_staff!tasks_staff_id_fkey (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("hotel_id", hotelId)
        .order("created_at", { ascending: false });

      if (error) {
throw error;
      }

      return data;
    },
    enabled: !!hotelId,
    config: {
      staleTime: 1000 * 60 * 2, // Keep tasks fresh for 2 minutes
      gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
      refetchOnWindowFocus: false,
    },
    logPrefix: "Task Assignment",
  });

  // Real-time subscription for task changes
  useRealtimeSubscription({
    table: "tasks",
    filter: hotelId ? `hotel_id=eq.${hotelId}` : undefined,
    queryKey: queryKeys.tasksByHotel(hotelId || ""),
    enabled: !!hotelId,
  });

  return result;
}

/**
 * Auto-hotel ID hook for current user's tasks
 */
export function useCurrentHotelTasks() {
  const { hotelId, isLoading: hotelIdLoading } = useCurrentUserHotelId();
return useTaskAssignment(hotelId || undefined);
}

/**
 * Create task mutation
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (taskData: {
      title: string;
      description?: string;
      type?: string;
      priority: "Low" | "Medium" | "High";
      staff_id?: string;
      due_date?: string;
      due_time?: string;
    }) => {
if (!hotelId) {
        throw new Error("No hotel ID available");
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          hotel_id: hotelId,
          created_by: user?.id,
          status: "PENDING",
        })
        .select(
          `
          *,
          assigned_staff:hotel_staff!tasks_staff_id_fkey (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
throw error;
      }
// 📧 Trigger email notification edge function
      if (data.staff_id) {
try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.access_token) {
} else {
const response = await supabase.functions.invoke(
              "send-task-notifications-email",
              {
                body: { taskId: data.id },
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              }
            );
if (response.error) {
// Don't throw - email failure shouldn't fail task creation
            } else {
}
          }
        } catch (emailError) {
// Don't throw - email failure shouldn't fail task creation
        }
      } else {
}

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasksByHotel(hotelId || ""),
      });
    },
  });
}

/**
 * Update task mutation
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<{
        title: string;
        description: string;
        type: string;
        priority: "Low" | "Medium" | "High";
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
        staff_id: string;
        due_date: string;
        due_time: string;
      }>;
    }) => {
const { data, error } = await supabase
        .from("tasks")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)
        .select(
          `
          *,
          assigned_staff:hotel_staff!tasks_staff_id_fkey (
            id,
            employee_id,
            position,
            department,
            hotel_staff_personal_data (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .single();

      if (error) {
throw error;
      }
return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasksByHotel(hotelId || ""),
      });
    },
  });
}

/**
 * Delete task mutation
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { hotelId } = useCurrentUserHotelId();

  return useMutation({
    mutationFn: async (taskId: string) => {
const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) {
throw error;
      }
return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasksByHotel(hotelId || ""),
      });
    },
  });
}
