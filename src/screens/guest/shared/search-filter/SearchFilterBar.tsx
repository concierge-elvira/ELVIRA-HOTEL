/**
 * Search and Filter Bar Component
 *
 * Reusable search box for guest pages with optional cart button
 */

import React from "react";
import { ArrowLeft, X } from "lucide-react";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  cartButton?: React.ReactNode;
  onBackClick: () => void;
  rightIcon?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  placeholder = "Search services...",
  cartButton,
  onBackClick,
  rightIcon,
}) => {
  const handleClear = () => {
    onSearchChange("");
  };

  return (
    <div className="flex gap-2 px-4 py-2.5 bg-white">
      {/* Search Box */}
      <div className="flex-1 relative flex items-center gap-2.5 bg-gray-100 rounded-full px-4 py-2.5">
        {/* Back Button */}
        <button
          onClick={onBackClick}
          className="shrink-0 p-0 hover:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ArrowLeft className="text-gray-700" size={20} />
        </button>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:outline-none text-base placeholder:text-gray-500 font-normal"
        />

        {/* Right Icon (if provided) - Inside search container */}
        {rightIcon}

        {/* Clear Button - shows when there's text */}
        {searchValue && (
          <button
            onClick={handleClear}
            className="shrink-0 p-0 hover:opacity-70 transition-opacity"
            aria-label="Clear search"
          >
            <X className="text-gray-500" size={20} />
          </button>
        )}
      </div>

      {/* Cart Button (if provided) - Outside search container */}
      {cartButton}
    </div>
  );
};
