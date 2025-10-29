import React, { useState } from "react";
import { useGuestAuth } from "../../../contexts/guest";
import { StayDetailsCard } from "../shared/cards/StayDetailsCard";
import { CategoryMenu } from "../shared/menus/CategoryMenu";
import {
  HotelCategoryCards,
  ExperiencesCategoryCards,
  ToVisitCategoryCards,
} from "../shared/category-cards";
import { RecommendedSection } from "../shared/recommended";
import { AboutUsSection } from "../shared/about-us";
import { PhotoGallerySection } from "../shared/photo-gallery";
import { EmergencyContactsSection } from "../shared/emergency-contacts";
import type { CategoryType } from "../shared/menus/CategoryMenu";
import { useGuestRecommendations } from "../../../hooks/guest-management/recommendations";
import { useGuestExperienceRecommendations } from "../../../hooks/guest-management/recommendations";
import { useGuestAboutUs } from "../../../hooks/guest-management/about-us";
import { useGuestPhotoGallery } from "../../../hooks/guest-management/photo-gallery";
import { useGuestEmergencyContacts } from "../../../hooks/guest-management/emergency-contacts";

interface GuestHomeProps {
  onNavigate?: (path: string) => void;
}

export const GuestHome: React.FC<GuestHomeProps> = ({ onNavigate }) => {
  const { guestSession } = useGuestAuth();

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

  const { guestData } = guestSession;

  // Handle category selection
  const handleCategoryChange = (category: CategoryType) => {
    setSelectedCategory(category);
  };

  return (
    <>
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
        {selectedCategory === "tovisit" && (
          <ToVisitCategoryCards onNavigate={onNavigate} />
        )}
      </div>

      {/* Recommended Section - Dynamic based on selected category */}
      {(selectedCategory === "hotel" || selectedCategory === "tovisit") &&
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
              // Navigate based on the category of the item
              const category = item.category?.toLowerCase();

              if (category === "gastronomy") {
                onNavigate?.("/guest/gastronomy");
              } else if (category === "tours" || category === "tour") {
                onNavigate?.("/guest/tours");
              } else if (category === "wellness") {
                onNavigate?.("/guest/wellness");
              } else {
                // Default fallback to places page
                onNavigate?.("/guest/places");
              }
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
        <div >
          <EmergencyContactsSection contacts={emergencyContacts} />
        </div>
      )}
    </>
  );
};
