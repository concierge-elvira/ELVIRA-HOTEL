import { Modal, Button } from "../../../../../../../components/ui";

interface SendCalendarConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function SendCalendarConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: SendCalendarConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Send Calendar to Staff"
      size="md"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Sending..." : "Send Calendar"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          This will send calendar emails to all active staff members for the
          next 30 days.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            📧 Email Details:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Schedules for the next 30 days</li>
            <li>• Includes shift times, status, and notes</li>
            <li>• Sent to all active staff members</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Currently in test mode. Emails will be sent
            to{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded">
              no-reply@elviradc.com
            </code>
          </p>
        </div>

        <p className="text-sm text-gray-600">
          Are you sure you want to proceed?
        </p>
      </div>
    </Modal>
  );
}
