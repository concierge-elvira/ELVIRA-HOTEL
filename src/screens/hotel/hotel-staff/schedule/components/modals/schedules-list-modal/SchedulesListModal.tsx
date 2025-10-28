import { Modal } from "../../../../../../../components/ui";
import type { StaffScheduleWithDetails } from "../../../../../../../types/staff-schedules";
import {
  getStatusColor,
  formatShiftTime,
} from "../../../../../../../utils/staff-schedules";

interface SchedulesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  schedules: StaffScheduleWithDetails[];
  onScheduleSelect: (schedule: StaffScheduleWithDetails) => void;
}

export function SchedulesListModal({
  isOpen,
  onClose,
  date,
  schedules,
  onScheduleSelect,
}: SchedulesListModalProps) {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formattedDate} size="md">
      <div className="space-y-2">
        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No schedules for this day
          </p>
        ) : (
          schedules.map((schedule) => {
            const staffName = schedule.staff?.hotel_staff_personal_data
              ? `${schedule.staff.hotel_staff_personal_data.first_name} ${schedule.staff.hotel_staff_personal_data.last_name}`
              : "Unknown";

            return (
              <button
                key={schedule.id}
                onClick={() => {
                  onClose();
                  onScheduleSelect(schedule);
                }}
                className={`w-full text-left p-4 rounded-lg border-2 hover:shadow-md transition-all ${getStatusColor(
                  schedule.status
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-base">{staffName}</div>
                    <div className="text-sm mt-1">
                      {formatShiftTime(
                        schedule.shift_start,
                        schedule.shift_end
                      )}
                    </div>
                    {schedule.notes && (
                      <div className="text-xs mt-2 opacity-75">
                        {schedule.notes}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                      {schedule.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Modal>
  );
}
