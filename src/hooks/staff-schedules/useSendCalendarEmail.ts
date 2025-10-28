import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../services/supabase";

interface SendCalendarEmailInput {
  hotelId: string;
}

interface SendCalendarEmailResponse {
  success: boolean;
  message: string;
  totalStaff: number;
  successfulEmails: number;
  failedEmails: number;
  emailResults: Array<{
    staffName: string;
    staffEmail: string;
    success: boolean;
    emailId?: string;
    error?: string;
  }>;
  recipient: string;
}

/**
 * Hook to send calendar emails to all active hotel staff
 */
export function useSendCalendarEmail() {
  return useMutation<SendCalendarEmailResponse, Error, SendCalendarEmailInput>({
    mutationFn: async ({ hotelId }) => {
      // Get the current session to access the JWT token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No authentication token available");
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke(
        "send-staff-calendar-email",
        {
          body: { hotelId },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to send calendar emails");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to send calendar emails");
      }

      return data;
    },
  });
}
