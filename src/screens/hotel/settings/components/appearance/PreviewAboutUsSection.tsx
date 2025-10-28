/**
 * Preview About Us Section Component
 *
 * Shows a placeholder for the "About Us" section
 */

import React from "react";
import {
  useAppearance,
  getBorderRadiusClass,
} from "./contexts/AppearanceContext";

export const PreviewAboutUsSection: React.FC = () => {
  const { config } = useAppearance();
  const borderRadiusClass = getBorderRadiusClass(config.shapes.borderRadius);

  return (
    <section
      className="text-white py-12"
      style={{ backgroundColor: config.aboutUs.backgroundColor }}
    >
      <div className="max-w-md mx-auto px-6">
        {/* Title */}
        <h2
          className="font-bold mb-6 text-center"
          style={{
            fontSize: "1.5rem", // text-2xl
            fontWeight: config.typography.fontWeight.bold,
          }}
        >
          About <span style={{ color: config.colors.primary }}>Us</span>
        </h2>

        {/* About Text - White Box */}
        <div className={`bg-white ${borderRadiusClass} p-6 mb-6`}>
          <p
            className="text-gray-700 leading-relaxed text-center"
            style={{
              fontSize: config.typography.fontSize.small,
            }}
          >
            Located one kilometer from Munich Central Station, two kilometers
            from the Theresienwiese U-Bahn station, and 36 kilometers from
            Munich International Airport (MUC), Centro Hotel Mondial München,
            Trademark Collection by Wyndham welcomes you with free Wi-Fi, a
            breakfast buffet, and paid on-site parking.
          </p>
        </div>

        {/* Booking Button */}
        <div className="text-center">
          <button
            className={`font-semibold py-3 px-8 ${borderRadiusClass} transition-colors duration-200 text-white shadow-lg`}
            style={{
              backgroundColor: config.colors.primary,
              fontSize: config.typography.fontSize.base,
            }}
          >
            Booking
          </button>
        </div>
      </div>
    </section>
  );
};
