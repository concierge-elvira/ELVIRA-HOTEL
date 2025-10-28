import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { GuestAuthProvider, useGuestAuth } from "./contexts/guest";
import { Auth } from "./components/Auth";
import { GuestAuth } from "./components/GuestAuth";
import { GuestDashboard } from "./screens/guest/GuestDashboard";
import { Layout } from "./components/Layout";
import { HotelDashboard } from "./screens/hotel/HotelDashboard";
import { ElviraDashboard } from "./screens/elvira/ElviraDashboard";
import { Overview as ElviraOverview } from "./screens/elvira/overview";
import { elviraMenuItems } from "./utils/elvira/menuItems";

function GuestApp() {
  const { guestSession, loading } = useGuestAuth();
  const [showGuestAuth, setShowGuestAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (guestSession) {
    return <GuestDashboard />;
  }

  if (showGuestAuth) {
    return <GuestAuth onBackToStaffLogin={() => setShowGuestAuth(false)} />;
  }

  return <Auth onSwitchToGuestLogin={() => setShowGuestAuth(true)} />;
}

function App() {
  const { user, loading, signOut } = useAuth();
  const [activeMenuItem, setActiveMenuItem] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <GuestAuthProvider>
        <GuestApp />
      </GuestAuthProvider>
    );
  }
  // Show hotel dashboard for hotel users
  if (user.role === "hotel") {
    return <HotelDashboard user={user} onSignOut={signOut} />;
  }

  // Show layout for elvira users
  if (user.role === "elvira") {
    const renderElviraContent = () => {
      switch (activeMenuItem) {
        case "overview":
          return <ElviraOverview />;
        case "dashboard":
          return <ElviraDashboard />;
        default:
          return <ElviraOverview />;
      }
    };

    return (
      <Layout
        user={user}
        onSignOut={signOut}
        menuItems={elviraMenuItems}
        activeMenuItem={activeMenuItem}
        onMenuItemChange={setActiveMenuItem}
        collapsible={true}
      >
        {renderElviraContent()}
      </Layout>
    );
  }

  // Fallback for any other case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Invalid user role</p>
        <button
          onClick={signOut}
          className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default App;
