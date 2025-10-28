/**
 * Preview Emergency Contacts Section Component
 *
 * Shows a placeholder for the emergency contacts section
 */

import React from "react";
import { Phone } from "lucide-react";

export const PreviewEmergencyContactsSection: React.FC = () => {
  const mockContacts = [
    {
      id: "1",
      contact_name: "Reception",
      phone_number: "+1 234 567 8900",
    },
    {
      id: "2",
      contact_name: "Concierge",
      phone_number: "+1 234 567 8901",
    },
    {
      id: "3",
      contact_name: "Emergency Services",
      phone_number: "911",
    },
  ];

  return (
    <section className="py-6 px-4 bg-white">
      <div className="mb-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Emergency <span className="text-blue-600">Contacts</span>
        </h2>
        {/* Subtitle */}
        <p className="text-sm text-gray-600">
          Important contact information for your safety
        </p>
      </div>

      {/* Contacts List Container with Border */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {mockContacts.map((contact) => (
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
                <span className="text-sm font-medium text-gray-700">
                  {contact.phone_number}
                </span>
                <button
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
