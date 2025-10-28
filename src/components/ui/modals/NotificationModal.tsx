import { Modal } from "./Modal";
import { Button } from "../buttons";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  buttonText?: string;
}

const typeStyles = {
  success: {
    icon: (
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    bgColor: "bg-green-100",
    textColor: "text-green-800",
  },
  error: {
    icon: (
      <svg
        className="w-6 h-6 text-red-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    bgColor: "bg-red-100",
    textColor: "text-red-800",
  },
  warning: {
    icon: (
      <svg
        className="w-6 h-6 text-yellow-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
  },
  info: {
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
};

export function NotificationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  buttonText = "OK",
}: NotificationModalProps) {
  const styles = typeStyles[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center space-y-4">
        <div
          className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${styles.bgColor}`}
        >
          {styles.icon}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <Button variant="primary" onClick={onClose} fullWidth>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
}
