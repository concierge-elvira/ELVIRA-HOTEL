import { SearchBox, Button } from "../../ui";
import { colors, spacing } from "../../../utils/theme";

interface PageToolbarProps {
  description?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  onSearchClear: () => void;
  buttonLabel: string;
  onButtonClick: () => void;
  buttonIcon?: React.ReactNode;
}

export function PageToolbar({
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onSearchClear,
  buttonLabel,
  onButtonClick,
  buttonIcon,
}: PageToolbarProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: "64px",
        zIndex: 10,
        backgroundColor: colors.background.card,
        borderBottom: `1px solid ${colors.border.DEFAULT}`,
        padding: `${spacing[4]} ${spacing[6]}`,
      }}
    >
      <div className="flex items-center justify-between">
        {description && (
          <p style={{ color: colors.text.secondary, margin: 0 }}>
            {description}
          </p>
        )}

        <div className="flex items-center gap-3 ml-auto">
          {/* Action Button */}
          <Button variant="primary" size="md" onClick={onButtonClick}>
            {buttonIcon || (
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
            {buttonLabel}
          </Button>

          {/* Search Box */}
          <div className="w-80">
            <SearchBox
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              onClear={onSearchClear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
