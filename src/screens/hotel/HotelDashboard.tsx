import { useState } from "react";
import { Layout } from "../../components/Layout";
import { HotelProvider } from "../../contexts/HotelContext";
import { useFilteredMenuItems } from "../../hooks";
import { useCurrentUserHotel } from "../../hooks/useCurrentUserHotel";
import {
  Overview,
  HotelStaff,
  ChatManagement,
  GuestManagement,
  AiSupport,
  Amenities,
  HotelRestaurant,
  HotelShop,
  ThirdPartyManagement,
  Announcements,
  QnA,
  EmergencyContacts,
  Settings,
} from "./";

interface HotelDashboardProps {
  user: {
    email: string;
    role: string;
  };
  onSignOut: () => void;
}

const componentMap = {
  overview: <Overview />,
  "hotel-staff": <HotelStaff />,
  "chat-management": <ChatManagement />,
  "guest-management": <GuestManagement />,
  "ai-support": <AiSupport />,
  amenities: <Amenities />,
  "hotel-restaurant": <HotelRestaurant />,
  "hotel-shop": <HotelShop />,
  "third-party-management": <ThirdPartyManagement />,
  announcements: <Announcements />,
  qna: <QnA />,
  "emergency-contacts": <EmergencyContacts />,
  settings: <Settings />,
};

// Inner dashboard component that uses hotel context
function DashboardContent({ user, onSignOut }: HotelDashboardProps) {
const [activeMenuItem, setActiveMenuItem] = useState("overview");
  const { menuItems } = useFilteredMenuItems();
  const { data: hotelInfo } = useCurrentUserHotel();
// Real-time subscriptions are now handled by individual module hooks
  // Each module (staff, chat, guests, etc.) has its own real-time subscription

  // If current active menu item is hidden, redirect to overview
  const isCurrentMenuVisible = menuItems.some(
    (item) => item.id === activeMenuItem
  );
  const effectiveMenuItem = isCurrentMenuVisible ? activeMenuItem : "overview";

  const activeComponent = componentMap[
    effectiveMenuItem as keyof typeof componentMap
  ] || <Overview />;

  return (
    <Layout
      user={user}
      onSignOut={onSignOut}
      menuItems={menuItems}
      activeMenuItem={effectiveMenuItem}
      onMenuItemChange={setActiveMenuItem}
      collapsible={true}
      hotelName={hotelInfo?.hotel?.name}
    >
      {activeComponent}
    </Layout>
  );
}

// Main dashboard component wrapped with hotel provider
export function HotelDashboard({ user, onSignOut }: HotelDashboardProps) {
  return (
    <HotelProvider>
      <DashboardContent user={user} onSignOut={onSignOut} />
    </HotelProvider>
  );
}
