import type { ReactNode } from "react";
import { SearchBox } from "../forms/SearchBox";
import { colors, typography, spacing } from "../../../utils/theme";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsWithSearchProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onSearchClear?: () => void;
  className?: string;
}

export function TabsWithSearch({
  tabs,
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  onSearchClear,
  className = "",
}: TabsWithSearchProps) {
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
      <div
        className="flex items-center justify-between"
        style={{
          padding: `${spacing[4]} ${spacing[6]}`,
        }}
      >
        {/* Tabs Section */}
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
                  e.currentTarget.style.borderBottomColor = colors.border.dark;
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

        {/* Search Section */}
        <div className="w-80">
          <SearchBox
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            onClear={onSearchClear}
            fullWidth={true}
          />
        </div>
      </div>
    </div>
  );
}
