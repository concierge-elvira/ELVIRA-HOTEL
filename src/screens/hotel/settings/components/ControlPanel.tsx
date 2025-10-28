import { useMemo, useState } from "react";
import {
  LayoutBrandingSection,
  GuestServicesSection,
  InformationCommunicationSection,
  AboutUsModal,
  HotelPhotoGalleryModal,
} from "./control-panel";
import {
  useHotelSettings,
  useToggleHotelSettingByKey,
  useUpdateAboutUs,
  getAboutUsFromSettings,
  useUpdatePhotoGallery,
  getPhotoGalleryFromSettings,
} from "../../../../hooks/settings";
import { useHotelId } from "../../../../hooks";
import { useAuth } from "../../../../hooks/useAuth";

export function ControlPanel() {
  const hotelId = useHotelId();
  const { user } = useAuth();
  const { data: settings, isLoading } = useHotelSettings(hotelId || undefined);
  const toggleSetting = useToggleHotelSettingByKey();
  const updateAboutUs = useUpdateAboutUs();
  const updatePhotoGallery = useUpdatePhotoGallery();

  // About Us Modal State
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const aboutUsData = useMemo(
    () => getAboutUsFromSettings(settings),
    [settings]
  );

  // Photo Gallery Modal State
  const [isPhotoGalleryModalOpen, setIsPhotoGalleryModalOpen] = useState(false);
  const photoGalleryImages = useMemo(
    () => getPhotoGalleryFromSettings(settings),
    [settings]
  );

  // Layout & Branding settings
  const layoutBranding = useMemo(() => {
    const getSettingValue = (key: string): boolean => {
      const setting = settings?.find((s) => s.setting_key === key);
      return setting?.setting_value ?? false;
    };

    return {
      aboutSection: getSettingValue("about_section"),
      doNotDisturb: getSettingValue("do_not_disturb"),
      hotelPhotoGallery: getSettingValue("hotel_photo_gallery"),
    };
  }, [settings]);

  // Guest Services settings
  const guestServices = useMemo(() => {
    const getSettingValue = (key: string): boolean => {
      const setting = settings?.find((s) => s.setting_key === key);
      return setting?.setting_value ?? false;
    };

    return {
      hotelAmenities: getSettingValue("hotel_amenities"),
      hotelShop: getSettingValue("hotel_shop"),
      toursExcursions: getSettingValue("tours_excursions"),
      roomServiceRestaurant: getSettingValue("room_service_restaurant"),
      localRestaurants: getSettingValue("local_restaurants"),
      liveChatSupport: getSettingValue("live_chat_support"),
    };
  }, [settings]);

  // Information & Communication settings
  const informationCommunication = useMemo(() => {
    const getSettingValue = (key: string): boolean => {
      const setting = settings?.find((s) => s.setting_key === key);
      return setting?.setting_value ?? false;
    };

    return {
      hotelAnnouncements: getSettingValue("hotel_announcements"),
      qaRecommendations: getSettingValue("qa_recommendations"),
      emergencyContacts: getSettingValue("emergency_contacts"),
      publicTransport: getSettingValue("public_transport"),
    };
  }, [settings]);

  // Convert camelCase to snake_case for database keys
  const toSnakeCase = (str: string): string => {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
  };

  const handleLayoutBrandingToggle = async (
    key: keyof typeof layoutBranding,
    value: boolean
  ) => {
    if (!hotelId) return;

    const settingKey = toSnakeCase(key);
    await toggleSetting.mutateAsync({
      hotelId,
      settingKey,
      settingValue: value,
      createdBy: user?.id,
    });
  };

  const handleGuestServicesToggle = async (
    key: keyof typeof guestServices,
    value: boolean
  ) => {
    if (!hotelId) return;

    const settingKey = toSnakeCase(key);
    await toggleSetting.mutateAsync({
      hotelId,
      settingKey,
      settingValue: value,
      createdBy: user?.id,
    });
  };

  const handleInformationCommunicationToggle = async (
    key: keyof typeof informationCommunication,
    value: boolean
  ) => {
    if (!hotelId) return;

    const settingKey = toSnakeCase(key);
    await toggleSetting.mutateAsync({
      hotelId,
      settingKey,
      settingValue: value,
      createdBy: user?.id,
    });
  };

  const handleSaveAboutUs = async (data: {
    aboutUsText: string;
    buttonText: string;
    buttonUrl: string;
  }) => {
    if (!hotelId) return;

    await updateAboutUs.mutateAsync({
      hotelId,
      aboutUsText: data.aboutUsText,
      buttonText: data.buttonText,
      buttonUrl: data.buttonUrl,
    });
  };

  const handleSavePhotoGallery = async (imageUrls: string[]) => {
    if (!hotelId) return;

    await updatePhotoGallery.mutateAsync({
      hotelId,
      imageUrls,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <LayoutBrandingSection
        settings={layoutBranding}
        onToggle={handleLayoutBrandingToggle}
        onManagePhotos={() => setIsPhotoGalleryModalOpen(true)}
        onEditAbout={() => setIsAboutUsModalOpen(true)}
      />

      <GuestServicesSection
        settings={guestServices}
        onToggle={handleGuestServicesToggle}
      />

      <InformationCommunicationSection
        settings={informationCommunication}
        onToggle={handleInformationCommunicationToggle}
      />

      {/* About Us Modal */}
      <AboutUsModal
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
        onSave={handleSaveAboutUs}
        initialData={aboutUsData}
      />

      {/* Hotel Photo Gallery Modal */}
      <HotelPhotoGalleryModal
        isOpen={isPhotoGalleryModalOpen}
        onClose={() => setIsPhotoGalleryModalOpen(false)}
        onSave={handleSavePhotoGallery}
        initialImages={photoGalleryImages}
      />
    </div>
  );
}
