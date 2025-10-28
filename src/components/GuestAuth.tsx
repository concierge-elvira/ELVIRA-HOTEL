import { useState } from "react";
import { useGuestAuth } from "../contexts/guest";
import {
  AuthContainer,
  AuthHeader,
  AuthCard,
  AuthInput,
  AuthPasswordInput,
  AuthMessage,
  AuthButton,
  AuthLink,
} from "./auth/shared";

interface GuestAuthProps {
  onBackToStaffLogin: () => void;
}

export function GuestAuth({ onBackToStaffLogin }: GuestAuthProps) {
  const { signIn } = useGuestAuth();
  const [roomNumber, setRoomNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGuestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await signIn(roomNumber, accessCode);

      if (error) {
        setMessage(error);
      }
    } catch {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getMessageType = (): "error" | "success" | "info" => {
    if (
      message.includes("error") ||
      message.includes("Error") ||
      message.includes("Invalid")
    ) {
      return "error";
    }
    return "info";
  };

  return (
    <AuthContainer>
      <AuthHeader
        icon={
          <svg
            className="h-8 w-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        }
        title="Guest Access"
        subtitle="Enter your room details to access your dashboard"
      />

      <AuthCard onSubmit={handleGuestAccess}>
        <AuthInput
          id="roomNumber"
          name="roomNumber"
          type="text"
          label="Room Number *"
          placeholder="e.g., 205"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
        />

        <AuthPasswordInput
          id="accessCode"
          name="accessCode"
          label="Access Code *"
          placeholder="• • • • • •"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
          maxLength={6}
          letterSpacing={true}
          helperText="6-digit code from check-in"
        />

        {message && <AuthMessage message={message} type={getMessageType()} />}

        <AuthButton loading={loading} loadingText="Accessing...">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Access
        </AuthButton>
      </AuthCard>

      <AuthLink onClick={onBackToStaffLogin}>
        <svg
          className="w-4 h-4 mr-1.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Staff Login
      </AuthLink>
    </AuthContainer>
  );
}
