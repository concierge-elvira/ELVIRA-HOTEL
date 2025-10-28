import { QueryClient } from "@tanstack/react-query";

// Query key factory for consistent cache management
export const queryKeys = {
  // Guest-related queries
  guests: ["guests"] as const,
  guest: (id: string) => ["guests", id] as const,
  guestsByHotel: (hotelId: string) => ["guests", "hotel", hotelId] as const,

  // Staff-related queries
  staff: ["staff"] as const,
  staffMember: (id: string) => ["staff", id] as const,
  staffByHotel: (hotelId: string) => ["staff", "hotel", hotelId] as const,
  currentUserStaffProfile: (userId: string) =>
    ["staff", "current-user", userId] as const,

  // Schedule-related queries
  schedules: ["schedules"] as const,
  schedule: (id: string) => ["schedules", id] as const,
  schedulesByStaff: (staffId: string) =>
    ["schedules", "staff", staffId] as const,
  schedulesByDate: (date: string) => ["schedules", "date", date] as const,

  // Chat/Messages queries
  conversations: ["conversations"] as const,
  conversation: (id: string) => ["conversations", id] as const,
  conversationsByGuest: (guestId: string) =>
    ["conversations", "guest", guestId] as const,
  messages: (conversationId: string) => ["messages", conversationId] as const,

  // Staff Communication queries
  staffConversations: (staffId: string) =>
    ["staff-conversations", "staff", staffId] as const,
  staffMessages: (conversationId: string) =>
    ["staff-messages", conversationId] as const,

  // Guest Communication queries
  guestConversations: (hotelId: string) =>
    ["guest-conversations", "hotel", hotelId] as const,
  guestMessages: (conversationId: string) =>
    ["guest-messages", conversationId] as const,

  // Announcements
  announcements: ["announcements"] as const,
  announcement: (id: string) => ["announcements", id] as const,
  announcementsByHotel: (hotelId: string) =>
    ["announcements", "hotel", hotelId] as const,

  // Orders (restaurant/shop)
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
  ordersByGuest: (guestId: string) => ["orders", "guest", guestId] as const,
  ordersByHotel: (hotelId: string) => ["orders", "hotel", hotelId] as const,

  // Tasks queries
  tasks: ["tasks"] as const,
  task: (id: string) => ["tasks", id] as const,
  tasksByHotel: (hotelId: string) => ["tasks", "hotel", hotelId] as const,
  tasksByStaff: (staffId: string) => ["tasks", "staff", staffId] as const,
  tasksByStatus: (hotelId: string, status: string) =>
    ["tasks", "hotel", hotelId, "status", status] as const,

  // Absence requests queries
  absenceRequests: ["absenceRequests"] as const,
  absenceRequest: (id: string) => ["absenceRequests", id] as const,
  absenceRequestsByHotel: (hotelId: string) =>
    ["absenceRequests", "hotel", hotelId] as const,
  absenceRequestsByStaff: (staffId: string) =>
    ["absenceRequests", "staff", staffId] as const,
  absenceRequestsByStatus: (hotelId: string, status: string) =>
    ["absenceRequests", "hotel", hotelId, "status", status] as const,
};

// Optimized Query Client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 1000 * 60 * 5,
      // Keep data in cache for 10 minutes after component unmounts
      gcTime: 1000 * 60 * 10,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: Error) => {
        // Don't retry on 4xx errors (client errors)
        if (
          "status" in error &&
          typeof error.status === "number" &&
          error.status >= 400 &&
          error.status < 500
        )
          return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for important data
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Background refetch every 5 minutes for stale data
      refetchInterval: 1000 * 60 * 5,
    },
    mutations: {
      // Retry mutations once on network errors
      retry: (failureCount, error: Error) => {
        if (
          "status" in error &&
          typeof error.status === "number" &&
          error.status >= 400 &&
          error.status < 500
        )
          return false;
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});
