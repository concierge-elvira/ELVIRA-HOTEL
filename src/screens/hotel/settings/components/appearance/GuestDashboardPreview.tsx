/**
 * Guest Dashboard Preview Component
 *
 * Shows a live preview of how the guest dashboard appears
 * Used in the Appearance settings tab
 */

import React, { useState } from "react";
import {
  PreviewHeader,
  PreviewTicker,
  PreviewBottomNav,
  PreviewRecommendedSection,
  PreviewAboutUsSection,
  PreviewPhotoGallerySection,
  PreviewEmergencyContactsSection,
  PreviewCategoryMenu,
  PreviewCategoryCard,
  PreviewStayDetailsCard,
} from "./index";
import { useAppearance } from "./contexts/AppearanceContext";

type CategoryType = "hotel" | "experiences" | "tovisit";

interface GuestDashboardPreviewProps {
  hotelName?: string;
}

export const GuestDashboardPreview: React.FC<GuestDashboardPreviewProps> = ({
  hotelName = "Hotel Name",
}) => {
  const [previewCategory, setPreviewCategory] = useState<CategoryType>("hotel");
  const { config } = useAppearance();

  // Static preview cards to avoid authentication issues
  const hotelCards = [
    {
      id: "amenities",
      title: "Amenities",
      description: "Hotel facilities and services",
    },
    {
      id: "dine-in",
      title: "Dine In",
      description: "Room service and restaurant",
    },
    {
      id: "hotel-shop",
      title: "Hotel Shop",
      description: "Purchase hotel merchandise",
    },
    {
      id: "qna",
      title: "Q&A",
      description: "Frequently asked questions",
    },
  ];

  const experienceCards = [
    {
      id: "gastronomy",
      title: "Gastronomy",
      description: "Discover local cuisine",
    },
    {
      id: "wellness",
      title: "Wellness & Spa",
      description: "Relax and rejuvenate",
    },
    {
      id: "tours",
      title: "Tours & Activities",
      description: "Explore the area",
    },
  ];

  const toVisitCards = [
    {
      id: "places",
      title: "Places to Visit",
      description: "Discover must-see locations",
    },
  ];

  const getCardsForCategory = () => {
    switch (previewCategory) {
      case "hotel":
        return hotelCards;
      case "experiences":
        return experienceCards;
      case "tovisit":
        return toVisitCards;
      default:
        return hotelCards;
    }
  };

  return (
    <div
      className="max-w-md mx-auto bg-white"
      style={{
        fontFamily: config.typography.fontFamily,
        fontSize: config.typography.fontSize.base,
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Fixed Header Section (Header + Ticker) */}
      <div className="shrink-0 bg-white shadow-sm">
        {/* Header */}
        <PreviewHeader
          guestName="Guest"
          hotelName={hotelName}
          roomNumber="101"
        />

        {/* Announcements Ticker */}
        <PreviewTicker />
      </div>

      {/* Main Content */}
      <main className="pb-16">
        {/* Stay Details Card Section */}
        <div
          className="px-4 pt-4 pb-2"
          style={{
            backgroundColor: "#FFFFFF",
          }}
        >
          <PreviewStayDetailsCard
            checkInDate="2025-11-01"
            checkOutDate="2025-11-05"
            roomNumber="101"
            accessCode="******"
          />
        </div>

        {/* Category Menu */}
        <div className="bg-white">
          <PreviewCategoryMenu onCategoryChange={setPreviewCategory} />
        </div>

        {/* Category Cards */}
        <div className="px-4 py-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-2.5">
            {getCardsForCategory().map((card) => (
              <PreviewCategoryCard
                key={card.id}
                title={card.title}
                description={card.description}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Recommended Section - Only for hotel category */}
        {previewCategory === "hotel" && <PreviewRecommendedSection />}

        {/* About Us Section */}
        <PreviewAboutUsSection />

        {/* Photo Gallery Section */}
        <PreviewPhotoGallerySection />

        {/* Emergency Contacts Section */}
        <PreviewEmergencyContactsSection />
      </main>

      {/* Bottom Navigation - Fixed at bottom */}
      <div className="sticky bottom-0">
        <PreviewBottomNav />
      </div>
    </div>
  );
};
