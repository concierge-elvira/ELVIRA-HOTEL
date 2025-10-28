/**
 * Preview About Us Section Component
 *
 * Shows a placeholder for the "About Us" section
 */

import React from "react";

export const PreviewAboutUsSection: React.FC = () => {
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
            Located one kilometer from Munich Central Station, two kilometers
            from the Theresienwiese U-Bahn station, and 36 kilometers from
            Munich International Airport (MUC), Centro Hotel Mondial München,
            Trademark Collection by Wyndham welcomes you with free Wi-Fi, a
            breakfast buffet, and paid on-site parking.
          </p>
        </div>

        {/* Booking Button */}
        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg">
            Booking
          </button>
        </div>
      </div>
    </section>
  );
};
