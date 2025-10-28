import { Modal, Button } from "../../../../../../../components/ui";

interface SendCalendarResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    success: boolean;
    message: string;
    totalStaff: number;
    successfulEmails: number;
    failedEmails: number;
    recipient: string;
  } | null;
}

export function SendCalendarResultModal({
  isOpen,
  onClose,
  result,
}: SendCalendarResultModalProps) {
  if (!result) return null;

  const hasFailures = result.failedEmails > 0;
  const isProcessing = result.totalStaff === 0 && result.success;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isProcessing ? "Sending Calendars..." : "Calendar Sent"}
      size="md"
      closeOnOverlayClick={!isProcessing}
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Close"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {isProcessing ? (
          <div className="flex items-start space-x-3">
            <div className="shrink-0">
              <svg
                className="w-6 h-6 text-blue-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">
                Processing Calendar Emails
              </h4>
              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                You can close this dialog - emails will continue sending in the
                background.
              </p>
            </div>
          </div>
        ) : result.success ? (
          <div className="flex items-start space-x-3">
            <div className="shrink-0">
              <svg
                className="w-6 h-6 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">
                Emails Sent Successfully
              </h4>
              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <div className="shrink-0">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">
                Email Sending Failed
              </h4>
              <p className="text-sm text-gray-600 mt-1">{result.message}</p>
            </div>
          </div>
        )}

        {!isProcessing && (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                📊 Summary:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Staff:</span>
                  <span className="font-medium text-gray-900">
                    {result.totalStaff}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Successful:</span>
                  <span className="font-medium text-emerald-600">
                    {result.successfulEmails}
                  </span>
                </div>
                {hasFailures && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failed:</span>
                    <span className="font-medium text-red-600">
                      {result.failedEmails}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Test Mode:</strong> Emails sent to{" "}
                <code className="bg-amber-100 px-1 py-0.5 rounded">
                  {result.recipient}
                </code>
              </p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
