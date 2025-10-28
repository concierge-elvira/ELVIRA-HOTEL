/**
 * Stay Details Card Component
 *
 * Displays guest's stay information with check-in, check-out, room, and access code
 * Features a beautiful gradient background matching the reference design
 */

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface StayDetailsCardProps {
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  accessCode: string;
}

export const StayDetailsCard = ({
  checkInDate,
  checkOutDate,
  roomNumber,
  accessCode,
}: StayDetailsCardProps) => {
  const [showAccessCode, setShowAccessCode] = useState(false);

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
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 p-4 shadow-lg">
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10" />

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <h2 className="mb-2.5 text-center text-base font-semibold text-white">
            Your Stay Details
          </h2>

          {/* Grid of details */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Check-in */}
            <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2.5">
              <p className="mb-0.5 text-xs font-medium text-white/80">
                Check-in
              </p>
              <p className="text-sm font-bold text-white">
                {formatDate(checkInDate)}
              </p>
            </div>

            {/* Check-out */}
            <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2.5">
              <p className="mb-0.5 text-xs font-medium text-white/80">
                Check-out
              </p>
              <p className="text-sm font-bold text-white">
                {formatDate(checkOutDate)}
              </p>
            </div>

            {/* Room */}
            <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2.5">
              <p className="mb-0.5 text-xs font-medium text-white/80">Room</p>
              <p className="text-sm font-bold text-white">{roomNumber}</p>
            </div>

            {/* Access Code */}
            <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2.5">
              <p className="mb-0.5 text-xs font-medium text-white/80">
                Access Code
              </p>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">
                  {showAccessCode ? accessCode : maskedCode}
                </p>
                <button
                  onClick={() => setShowAccessCode(!showAccessCode)}
                  className="ml-1.5 rounded-lg p-1 hover:bg-white/20 transition-colors touch-manipulation"
                  aria-label={
                    showAccessCode ? "Hide access code" : "Show access code"
                  }
                >
                  {showAccessCode ? (
                    <EyeOff className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 text-white" />
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
