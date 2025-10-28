import { useState } from "react";
import { Button } from "../../../../../../components/ui";
import {
  ScheduleModal,
  SendCalendarConfirmModal,
  SendCalendarResultModal,
} from "../modals";
import { useHotelContext } from "../../../../../../hooks/useHotelContext";
import { useSendCalendarEmail } from "../../../../../../hooks/staff-schedules";
import { useStaffPermissions } from "../../../../../../hooks/hotel-staff";

export function ActionButtons() {
  const { hotelId } = useHotelContext();
  const permissions = useStaffPermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    message: string;
    totalStaff: number;
    successfulEmails: number;
    failedEmails: number;
    recipient: string;
  } | null>(null);
  const sendCalendarEmail = useSendCalendarEmail();

  const handleSendCalendar = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSend = async () => {
    if (!hotelId) {
      alert("Hotel ID is required");
      return;
    }

    // Close confirmation modal immediately and show "sending" state
    setIsConfirmModalOpen(false);

    // Show processing notification
    setEmailResult({
      success: true,
      message:
        "Sending calendar emails in background... This may take a minute.",
      totalStaff: 0,
      successfulEmails: 0,
      failedEmails: 0,
      recipient: "Processing...",
    });
    setIsResultModalOpen(true);

    try {
      const result = await sendCalendarEmail.mutateAsync({ hotelId });
      // Update with actual results
      setEmailResult(result);
    } catch (error) {
      console.error("Error sending calendar emails:", error);
      setEmailResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to send emails",
        totalStaff: 0,
        successfulEmails: 0,
        failedEmails: 0,
        recipient: "",
      });
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        {/* Send Calendar Button - Only for admins */}
        {permissions.canSendCalendar && (
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-2"
            onClick={handleSendCalendar}
            disabled={sendCalendarEmail.isPending}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span>Send Calendar</span>
          </Button>
        )}

        {/* Create Schedule Button - Only for admins */}
        {permissions.canCreateSchedule && (
          <Button
            variant="primary"
            size="sm"
            className="flex items-center space-x-2"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Schedule</span>
          </Button>
        )}
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode="create"
      />

      <SendCalendarConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSend}
        isPending={sendCalendarEmail.isPending}
      />

      <SendCalendarResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        result={emailResult}
      />
    </>
  );
}
