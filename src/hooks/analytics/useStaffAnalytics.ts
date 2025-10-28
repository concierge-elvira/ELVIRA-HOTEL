import { useMemo } from "react";
import { useOptimizedQuery } from "../api/useOptimizedQuery";
import { useStaffManagement } from "../hotel-staff/staff-management";
import { useAbsences } from "../hotel-staff/absences";
import { useSchedulesByDateRange } from "../staff-schedules";
import type { StaffAnalytics } from "../../types/analytics";

/**
 * Fetch comprehensive staff analytics data
 */
export function useStaffAnalytics(hotelId: string | undefined) {
  // Get date range for schedules (current month)
  const { startDate, endDate } = useMemo(() => {
    const currentDate = new Date();
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      startDate: formatDate(start),
      endDate: formatDate(end),
    };
  }, []);

  const { data: staffData, isLoading: staffLoading } =
    useStaffManagement(hotelId);
  const { data: schedulesData, isLoading: schedulesLoading } =
    useSchedulesByDateRange(hotelId, startDate, endDate);
  const { data: absencesData, isLoading: absencesLoading } =
    useAbsences(hotelId);

  const isLoading = staffLoading || schedulesLoading || absencesLoading;

  return useOptimizedQuery<StaffAnalytics>({
    queryKey: ["staff-analytics", hotelId, startDate, endDate],
    queryFn: async () => {
      if (!staffData || !schedulesData || !absencesData) {
        throw new Error("Required data not available");
      }

      // 1. Staff by Department
      const departmentCounts: Record<string, number> = {};
      staffData.forEach((staff) => {
        const dept = staff.department || "Other";
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
      });

      const staffByDepartment = Object.entries(departmentCounts).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      // 2. Staff by Position
      const positionCounts: Record<string, number> = {};
      staffData.forEach((staff) => {
        const pos = staff.position || "Other";
        positionCounts[pos] = (positionCounts[pos] || 0) + 1;
      });

      const staffByPosition = Object.entries(positionCounts).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      // 3. Staff by Status
      const statusCounts: Record<string, number> = {};
      staffData.forEach((staff) => {
        const status = staff.status || "active";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const staffByStatus = Object.entries(statusCounts).map(
        ([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
          value,
        })
      );

      // 4. Schedules by Status
      const scheduleStatusCounts: Record<string, number> = {};
      schedulesData.forEach((schedule) => {
        const status = schedule.status || "SCHEDULED";
        scheduleStatusCounts[status] = (scheduleStatusCounts[status] || 0) + 1;
      });

      const schedulesByStatus = Object.entries(scheduleStatusCounts).map(
        ([name, value]) => ({
          name: name.charAt(0) + name.slice(1).toLowerCase().replace("_", " "),
          count: value,
        })
      );

      // 5. Absences by Type
      const absenceTypeCounts: Record<string, number> = {};
      absencesData.forEach((absence) => {
        const type = absence.request_type || "Other";
        absenceTypeCounts[type] = (absenceTypeCounts[type] || 0) + 1;
      });

      const absencesByType = Object.entries(absenceTypeCounts).map(
        ([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
          value,
        })
      );

      // 6. Absences by Status
      const absenceStatusCounts: Record<string, number> = {};
      absencesData.forEach((absence) => {
        const status = absence.status || "PENDING";
        absenceStatusCounts[status] = (absenceStatusCounts[status] || 0) + 1;
      });

      const absencesByStatus = Object.entries(absenceStatusCounts).map(
        ([name, value]) => ({
          name: name.charAt(0) + name.slice(1).toLowerCase(),
          count: value,
        })
      );

      // 7. Department Performance (schedules completed)
      const deptSchedules: Record<
        string,
        { completed: number; total: number }
      > = {};
      schedulesData.forEach((schedule) => {
        // Find staff department from staffData
        const staffMember = staffData.find((s) => s.id === schedule.staff_id);
        const dept = staffMember?.department || "Other";

        if (!deptSchedules[dept]) {
          deptSchedules[dept] = { completed: 0, total: 0 };
        }
        deptSchedules[dept].total++;
        if (schedule.status === "COMPLETED") {
          deptSchedules[dept].completed++;
        }
      });

      const departmentPerformance = Object.entries(deptSchedules).map(
        ([name, data]) => ({
          name,
          completed: data.completed,
          total: data.total,
          rate:
            data.total > 0
              ? Math.round((data.completed / data.total) * 100)
              : 0,
        })
      );

      return {
        totalStaff: staffData.length,
        activeStaff: staffData.filter((s) => s.status === "active").length,
        totalSchedules: schedulesData.length,
        totalAbsences: absencesData.length,
        pendingAbsences: absencesData.filter((a) => a.status === "PENDING")
          .length,
        totalDepartments: staffByDepartment.length,
        staffByDepartment,
        staffByPosition,
        staffByStatus,
        schedulesByStatus,
        absencesByType,
        absencesByStatus,
        departmentPerformance,
      };
    },
    enabled:
      !!hotelId &&
      !!staffData &&
      !!schedulesData &&
      !!absencesData &&
      !isLoading,
    config: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15, // 15 minutes
    },
    logPrefix: "StaffAnalytics",
  });
}
