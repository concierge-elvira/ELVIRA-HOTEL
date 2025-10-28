import { colors, typography, spacing } from "../../../utils/theme";

interface OrdersPageHeaderProps {
  title: string;
  description: string;
}

/**
 * Reusable header component for orders/tracking pages
 * Provides consistent layout with title and description
 */
export function OrdersPageHeader({
  title,
  description,
}: OrdersPageHeaderProps) {
  return (
    <div style={{ marginBottom: spacing[6] }}>
      <h2
        style={{
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.semibold,
          color: colors.text.primary,
          marginBottom: spacing[2],
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
  );
}
