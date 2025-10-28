import { useCurrentUserHotel } from "../../useCurrentUserHotel";

/**
 * Hook to determine staff permissions based on position and department
 *
 * Rules:
 * - Only "Hotel Admin" + "Manager" can:
 *   - Add new staff members
 *   - Edit any staff member
 *   - Delete any staff member
 *
 * - Other positions can only:
 *   - Edit their own personal data (hotel_staff_personal_data fields)
 *   - View other staff members
 */
export function useStaffPermissions() {
  const { data: currentUser, isLoading } = useCurrentUserHotel();

  // Check if user is Hotel Admin with Manager department
  const isAdmin =
    currentUser?.position === "Hotel Admin" &&
    currentUser?.department === "Manager";

  return {
    // Permission flags
    canAddStaff: isAdmin,
    canEditAnyStaff: isAdmin,
    canDeleteAnyStaff: isAdmin,

    // Task permissions
    canAddTask: isAdmin,
    canEditAnyTask: isAdmin,
    canDeleteAnyTask: isAdmin,

    // Schedule permissions
    canCreateSchedule: isAdmin,
    canSendCalendar: isAdmin,
    canEditAnySchedule: isAdmin,
    canDeleteAnySchedule: isAdmin,

    // User info
    currentUserId: currentUser?.staffId || null,
    currentUserPosition: currentUser?.position || null,
    currentUserDepartment: currentUser?.department || null,

    // Loading state
    isLoading,

    // Helper function to check if user can edit a specific staff member
    canEditStaff: (staffId: string) => {
      if (isAdmin) return true;
      // Non-admin can only edit themselves
      return currentUser?.staffId === staffId;
    },

    // Helper function to check if user can delete a specific staff member
    canDeleteStaff: (staffId: string) => {
      // Only admins can delete, and they can't delete themselves
      return isAdmin && currentUser?.staffId !== staffId;
    },

    // Helper to determine if user can only edit personal data
    canOnlyEditPersonalData: (staffId: string) => {
      if (isAdmin) return false;
      return currentUser?.staffId === staffId;
    },

    // Task-specific helpers
    canEditTask: () => {
      // Admins can edit any task
      // Non-admins can edit tasks (but only status field)
      return true; // Everyone can access edit, but fields are restricted
    },

    canDeleteTask: () => {
      // Only admins can delete tasks
      return isAdmin;
    },

    canOnlyEditTaskStatus: () => {
      // Non-admins can only edit the status field
      return !isAdmin;
    },

    // Schedule-specific helpers
    canEditSchedule: () => {
      // Everyone can access edit, but fields are restricted for non-admins
      return true;
    },

    canDeleteSchedule: () => {
      // Only admins can delete schedules
      return isAdmin;
    },

    canOnlyEditScheduleStatus: () => {
      // Non-admins can only edit the status field
      return !isAdmin;
    },
  };
}
