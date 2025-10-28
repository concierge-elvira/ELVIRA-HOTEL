import { Button } from "../../ui";
import { colors, typography, spacing } from "../../../utils/theme";

interface ManagementPageHeaderProps {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick: () => void;
  buttonIcon?: React.ReactNode;
}

/**
 * Reusable header component for management pages (Products, Menu Items, Amenities, etc.)
 * Provides consistent layout with title, description, and action button
 */
export function ManagementPageHeader({
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonIcon,
}: ManagementPageHeaderProps) {
  const defaultIcon = (
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
  );

  return (
    <div
      className="flex items-center justify-between"
      style={{ marginBottom: spacing[6] }}
    >
      <div>
        <h2
          style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text.primary,
            marginBottom: spacing[1],
            fontFamily: typography.fontFamily.sans,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            fontFamily: typography.fontFamily.sans,
          }}
        >
          {description}
        </p>
      </div>
      <Button variant="primary" size="md" onClick={onButtonClick}>
        {buttonIcon || defaultIcon}
        {buttonLabel}
      </Button>
    </div>
  );
}
