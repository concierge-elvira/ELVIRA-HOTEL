/**
 * Preview Stay Details Card Component
 *
 * Preview version of stay details card that uses appearance context
 */

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  useAppearance,
  getBorderRadiusClass,
} from "./contexts/AppearanceContext";

interface PreviewStayDetailsCardProps {
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  accessCode: string;
}

export const PreviewStayDetailsCard = ({
  checkInDate,
  checkOutDate,
  roomNumber,
  accessCode,
}: PreviewStayDetailsCardProps) => {
  const [showAccessCode, setShowAccessCode] = useState(false);
  const { config } = useAppearance();
  const borderRadiusClass = getBorderRadiusClass(config.shapes.borderRadius);

  // Format date to match the design (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Mask access code
  const maskedCode = "•".repeat(accessCode.length);

  return (
    <div className="mx-4 mt-2 mb-2">
      {/* Card with gradient background */}
      <div
        className={`relative overflow-hidden ${borderRadiusClass} p-4 shadow-lg`}
        style={{
          background: `linear-gradient(to bottom right, ${config.stayCard.gradientFrom}, ${config.stayCard.gradientTo})`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10" />

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <h2
            className="mb-2.5 text-center font-semibold text-white"
            style={{
              fontSize: config.typography.fontSize.base,
            }}
          >
            Your Stay Details
          </h2>

          {/* Grid of details */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Check-in */}
            <div
              className={`${borderRadiusClass} backdrop-blur-sm p-2.5`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <p
                className="mb-0.5 font-medium text-white/80"
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                Check-in
              </p>
              <p
                className="font-bold text-white"
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                {formatDate(checkInDate)}
              </p>
            </div>

            {/* Check-out */}
            <div
              className={`${borderRadiusClass} backdrop-blur-sm p-2.5`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <p
                className="mb-0.5 font-medium text-white/80"
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                Check-out
              </p>
              <p
                className="font-bold text-white"
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                {formatDate(checkOutDate)}
              </p>
            </div>

            {/* Room */}
            <div
              className={`${borderRadiusClass} backdrop-blur-sm p-2.5`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <p
                className="mb-0.5 font-medium text-white/80"
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                Room
              </p>
              <p
                className="font-bold text-white"
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                {roomNumber}
              </p>
            </div>

            {/* Access Code */}
            <div
              className={`${borderRadiusClass} backdrop-blur-sm p-2.5`}
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <p
                className="mb-0.5 font-medium text-white/80"
                style={{
                  fontSize: config.typography.fontSize.small,
                }}
              >
                Access Code
              </p>
              <div className="flex items-center justify-between">
                <p
                  className="font-bold text-white"
                  style={{
                    fontSize: config.typography.fontSize.small,
                  }}
                >
                  {showAccessCode ? accessCode : maskedCode}
                </p>
                <button
                  onClick={() => setShowAccessCode(!showAccessCode)}
                  className={`ml-1.5 ${borderRadiusClass} p-1 transition-colors touch-manipulation`}
                  style={{
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  aria-label={
                    showAccessCode ? "Hide access code" : "Show access code"
                  }
                >
                  {showAccessCode ? (
                    <Eye className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
