import React, { useState } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { GuestPageLayout } from "../shared/layout";
import { StayDetailsCard } from "../shared/cards";
import { CategoryMenu, type CategoryType } from "../shared/menus";
import {
  HotelCategoryCards,
  ExperiencesCategoryCards,
} from "../shared/category-cards";
import { RecommendedSection } from "../shared/recommended";
import { AboutUsSection } from "../shared/about-us";
import { PhotoGallerySection } from "../shared/photo-gallery";
import { EmergencyContactsSection } from "../shared/emergency-contacts";
import { useAnnouncements } from "../../../hooks/announcements/useAnnouncements";
import {
  useGuestRecommendations,
  useGuestExperienceRecommendations,
} from "../../../hooks/guest-management/recommendations";
import { useGuestAboutUs } from "../../../hooks/guest-management/about-us";
import { useGuestPhotoGallery } from "../../../hooks/guest-management/photo-gallery";
import { useGuestEmergencyContacts } from "../../../hooks/guest-management/emergency-contacts";

interface GuestHomeProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const GuestHome: React.FC<GuestHomeProps> = ({
  onNavigate,
  currentPath = "/guest/home",
}) => {
  const { guestSession } = useGuestAuth();
  const { data: announcements } = useAnnouncements(
    guestSession?.guestData?.hotel_id
  );

  const { data: recommendations, isLoading: recommendationsLoading } =
    useGuestRecommendations(guestSession?.guestData?.hotel_id, 10);

  const {
    data: experienceRecommendations,
    isLoading: experienceRecommendationsLoading,
  } = useGuestExperienceRecommendations(guestSession?.guestData?.hotel_id, 10);

  const { data: aboutUsData } = useGuestAboutUs(
    guestSession?.guestData?.hotel_id
  );

  const { data: photoGalleryData } = useGuestPhotoGallery(
    guestSession?.guestData?.hotel_id
  );

  const { data: emergencyContacts } = useGuestEmergencyContacts(
    guestSession?.guestData?.hotel_id ?? null
  );

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("hotel");

  if (!guestSession) {
    return null;
  }

  const { guestData, hotelData } = guestSession;

  // Format announcements for ticker
  const activeAnnouncements =
    announcements
      ?.filter((a) => a.is_active)
      .map((a) => ({
        id: a.id,
        message: `${a.title} • ${a.description}`,
      })) || [];

  // Handle category selection
  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  return (
    <GuestPageLayout
      guestName={guestData.guest_name}
      hotelName={hotelData.name}
      roomNumber={guestData.room_number}
      guestId={guestData.id}
      dndStatus={guestData.dnd_status}
      announcements={activeAnnouncements}
      currentPath={currentPath}
      onNavigate={onNavigate}
    >
      {/* Stay Details Card */}
      <StayDetailsCard
        checkInDate="2025-08-29"
        checkOutDate="2025-10-30"
        roomNumber={guestData.room_number}
        accessCode="998218"
      />

      {/* Category Menu */}
      <CategoryMenu onCategoryChange={handleCategoryChange} />

      {/* Category Cards - Dynamic based on selected category */}
      <div className="mb-6">
        {selectedCategory === "hotel" && (
          <HotelCategoryCards onNavigate={onNavigate} />
        )}
        {selectedCategory === "experiences" && (
          <ExperiencesCategoryCards onNavigate={onNavigate} />
        )}
      </div>

      {/* Recommended Section - Dynamic based on selected category */}
      {selectedCategory === "hotel" &&
        !recommendationsLoading &&
        recommendations?.all && (
          <RecommendedSection
            title="Recommended"
            subtitle="Curated selections from our hotel services"
            items={recommendations.all}
            onItemClick={(item) => {
              console.log("Clicked recommendation:", item);
              // Navigate based on category
              if (item.category === "Product Shop") {
                onNavigate?.("/guest/shop");
              } else if (item.category === "Restaurant") {
                onNavigate?.("/guest/restaurant");
              } else if (item.category === "Amenity") {
                onNavigate?.("/guest/amenities");
              }
            }}
          />
        )}

      {selectedCategory === "experiences" &&
        !experienceRecommendationsLoading &&
        experienceRecommendations &&
        experienceRecommendations.length > 0 && (
          <RecommendedSection
            title="Recommended"
            subtitle="Curated places recommended by our hotel"
            items={experienceRecommendations}
            showPrice={false}
            onItemClick={(item) => {
              console.log("Clicked experience recommendation:", item);
              // Navigate to places page or show details
              onNavigate?.("/guest/places");
            }}
          />
        )}

      {/* About Us Section */}
      {aboutUsData && (
        <AboutUsSection
          aboutText={aboutUsData.aboutUs}
          buttonText={aboutUsData.buttonText}
          onButtonClick={() => {
            // Handle booking action - could open a modal or navigate
            if (aboutUsData.buttonUrl) {
              window.open(aboutUsData.buttonUrl, "_blank");
            }
          }}
        />
      )}

      {/* Photo Gallery Section */}
      {photoGalleryData && (
        <PhotoGallerySection
          images={photoGalleryData.images}
          subtitle={photoGalleryData.subtitle}
        />
      )}

      {/* Emergency Contacts Section */}
      {emergencyContacts && emergencyContacts.length > 0 && (
        <div className="pb-20">
          <EmergencyContactsSection contacts={emergencyContacts} />
        </div>
      )}
    </GuestPageLayout>
  );
};
