import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  AuthContainer,
  AuthHeader,
  AuthCard,
  AuthInput,
  AuthPasswordInput,
  AuthMessage,
  AuthButton,
} from "./auth/shared";

interface AuthProps {
  onSwitchToGuestLogin: () => void;
}

export function Auth({ onSwitchToGuestLogin }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { signIn, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setMessage(error.message);
      }
    } catch {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Password reset email sent! Check your inbox.");
        setShowForgotPassword(false);
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
    if (message.includes("sent") || message.includes("success")) {
      return "success";
    }
    return "info";
  };

  return (
    <AuthContainer>
      <AuthHeader
        icon={
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        }
        title={
          showForgotPassword ? "Reset Password" : "Sign in to your account"
        }
        subtitle={
          showForgotPassword
            ? "Enter your email to receive a password reset link"
            : "Welcome back! Please enter your details."
        }
      />

      <AuthCard
        onSubmit={showForgotPassword ? handleForgotPassword : handleLogin}
      >
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email address *"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        {!showForgotPassword && (
          <AuthPasswordInput
            id="password"
            name="password"
            label="Password *"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        )}

        {message && <AuthMessage message={message} type={getMessageType()} />}

        <AuthButton
          loading={loading}
          loadingText={showForgotPassword ? "Sending..." : "Signing in..."}
        >
          {showForgotPassword ? "Send reset email" : "Sign in"}
        </AuthButton>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            onClick={() => {
              setShowForgotPassword(!showForgotPassword);
              setMessage("");
            }}
          >
            {showForgotPassword ? "← Back to sign in" : "Forgot password?"}
          </button>
        </div>
      </AuthCard>

      {/* Guest Login Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Are you a guest?{" "}
          <button
            type="button"
            onClick={onSwitchToGuestLogin}
            className="text-emerald-600 hover:text-emerald-700 font-medium underline transition-colors"
          >
            Access Guest Dashboard
          </button>
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          Protected by industry-standard security
        </p>
      </div>
    </AuthContainer>
  );
}
