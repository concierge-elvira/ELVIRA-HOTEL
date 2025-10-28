import type { TabItem } from "./TabsWithSearch";
import { colors, typography, spacing } from "../../../utils/theme";

interface TabsWithoutSearchProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  actions?: React.ReactNode; // Optional action buttons for the tab bar
}

export function TabsWithoutSearch({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  actions,
}: TabsWithoutSearchProps) {
  return (
    <div
      className={className}
      style={{
        position: "sticky",
        top: "64px",
        zIndex: 10,
        backgroundColor: colors.background.card,
        borderBottom: `1px solid ${colors.border.DEFAULT}`,
      }}
    >
      <div style={{ padding: `${spacing[4]} ${spacing[6]}` }}>
        {/* Tabs Section with Actions */}
        <div className="flex items-center justify-between">
          <div className="flex" style={{ gap: spacing[8] }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex items-center transition-colors duration-200"
                style={{
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[3]}`,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily.sans,
                  color:
                    activeTab === tab.id
                      ? colors.text.primary
                      : colors.text.secondary,
                  background: "none",
                  border: "none",
                  borderBottomWidth: "2px",
                  borderBottomStyle: "solid",
                  borderBottomColor:
                    activeTab === tab.id ? colors.primary[500] : "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = colors.text.primary;
                    e.currentTarget.style.borderBottomColor =
                      colors.border.dark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = colors.text.secondary;
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }
                }}
              >
                {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
                <span className="uppercase tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Optional Actions */}
          {actions && <div className="flex items-center">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
