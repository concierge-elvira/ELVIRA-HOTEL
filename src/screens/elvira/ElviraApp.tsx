import { useState } from "react";
import { Layout } from "../../components/Layout";
import { elviraMenuItems } from "../../utils/elvira/menuItems";
import { ElviraDashboard } from "./ElviraDashboard";
import { Overview } from "./overview";
import type { User } from "../../hooks/useAuth";

interface ElviraAppProps {
  user: User;
  onSignOut: () => void;
}

export function ElviraApp({ user, onSignOut }: ElviraAppProps) {
  const [activeMenuItem, setActiveMenuItem] = useState("overview");

  const renderContent = () => {
    switch (activeMenuItem) {
      case "overview":
        return <Overview />;
      case "dashboard":
        return <ElviraDashboard />;
      default:
        return <Overview />;
    }
  };

  return (
    <Layout
      user={user}
      onSignOut={onSignOut}
      menuItems={elviraMenuItems}
      activeMenuItem={activeMenuItem}
      onMenuItemChange={setActiveMenuItem}
      collapsible={true}
    >
      {renderContent()}
    </Layout>
  );
}
