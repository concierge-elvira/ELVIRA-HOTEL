/**
 * Emergency Contacts Section Component
 *
 * Displays important contact information for guest safety
 */

import React from "react";
import { Phone } from "lucide-react";

interface EmergencyContact {
  id: string;
  contact_name: string;
  phone_number: string;
}

interface EmergencyContactsSectionProps {
  contacts: EmergencyContact[];
  subtitle?: string;
}

export const EmergencyContactsSection: React.FC<
  EmergencyContactsSectionProps
> = ({
  contacts,
  subtitle = "Important contact information for your safety",
}) => {
  if (!contacts || contacts.length === 0) {
    return null;
  }

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <section className="py-6 px-4 bg-white">
      <div className="mb-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Emergency <span className="text-blue-600">Contacts</span>
        </h2>
        {/* Subtitle */}
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>

      {/* Contacts List Container with Border */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between py-4 px-4 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Contact Name */}
              <h3 className="text-base font-semibold text-gray-900">
                {contact.contact_name}
              </h3>

              {/* Phone Number with Call Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCall(contact.phone_number)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  {contact.phone_number}
                </button>
                <button
                  onClick={() => handleCall(contact.phone_number)}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  aria-label={`Call ${contact.contact_name}`}
                >
                  <Phone size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
