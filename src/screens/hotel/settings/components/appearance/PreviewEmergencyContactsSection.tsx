/**
 * Preview Emergency Contacts Section Component
 *
 * Shows a placeholder for the emergency contacts section
 */

import React from "react";
import { Phone } from "lucide-react";
import {
  useAppearance,
  getBorderRadiusClass,
  getCardStyleClass,
  getIconSizeClass,
} from "./contexts/AppearanceContext";

export const PreviewEmergencyContactsSection: React.FC = () => {
  const { config } = useAppearance();
  const borderRadiusClass = getBorderRadiusClass(config.shapes.borderRadius);
  const cardStyleClass = getCardStyleClass(config.shapes.cardStyle);
  const iconSizeClass = getIconSizeClass(config.icons.size);

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
    <section
      className="py-6 px-4"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="mb-4">
        {/* Title */}
        <h2
          className="font-bold mb-1"
          style={{
            fontSize: config.typography.fontSize.heading,
            fontWeight: config.typography.fontWeight.bold,
            color: config.colors.text.primary,
          }}
        >
          Emergency{" "}
          <span style={{ color: config.colors.primary }}>Contacts</span>
        </h2>
        {/* Subtitle */}
        <p
          style={{
            fontSize: config.typography.fontSize.small,
            color: config.colors.text.secondary,
          }}
        >
          Important contact information for your safety
        </p>
      </div>

      {/* Contacts List Container with Border */}
      <div
        className={`${borderRadiusClass} overflow-hidden ${cardStyleClass}`}
        style={{
          borderColor: `${config.colors.text.secondary}30`,
          backgroundColor: "#ffffff",
        }}
      >
        <div style={{ borderColor: `${config.colors.text.secondary}20` }}>
          {mockContacts.map((contact, index) => (
            <div
              key={contact.id}
              className="flex items-center justify-between py-4 px-4 transition-colors duration-200"
              style={{
                backgroundColor: "#ffffff",
                borderTop:
                  index > 0
                    ? `1px solid ${config.colors.text.secondary}20`
                    : "none",
              }}
            >
              {/* Contact Name */}
              <h3
                className="font-semibold"
                style={{
                  fontSize: config.typography.fontSize.base,
                  fontWeight: config.typography.fontWeight.semibold,
                  color: config.colors.text.primary,
                }}
              >
                {contact.contact_name}
              </h3>

              {/* Phone Number with Call Button */}
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{
                    fontSize: config.typography.fontSize.small,
                    color: config.colors.text.secondary,
                  }}
                >
                  {contact.phone_number}
                </span>
                <button
                  className="transition-colors duration-200"
                  style={{ color: config.colors.primary }}
                  aria-label={`Call ${contact.contact_name}`}
                >
                  <Phone className={iconSizeClass} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
