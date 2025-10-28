// Utility functions for common operations

/**
 * Format email display name
 */
export const formatEmailDisplayName = (email: string): string => {
  return email.split("@")[0];
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generate initials from email
 */
export const getInitials = (email: string): string => {
  return email.charAt(0).toUpperCase();
};
