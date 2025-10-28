/**
 * About Us Section Component
 *
 * Displays hotel information with a booking button
 */

import React from "react";

interface AboutUsSectionProps {
  aboutText: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  aboutText,
  buttonText = "Booking",
  onButtonClick,
}) => {
  return (
    <section className="bg-gray-900 text-white py-12">
      <div className="max-w-md mx-auto px-6">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          About <span className="text-blue-500">Us</span>
        </h2>

        {/* About Text - White Box */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <p className="text-gray-700 text-sm leading-relaxed text-center">
            {aboutText}
          </p>
        </div>

        {/* Booking Button */}
        <div className="text-center">
          <button
            onClick={onButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </section>
  );
};
