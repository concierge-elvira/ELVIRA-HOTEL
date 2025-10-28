/**
 * Search and Filter Bar Component
 *
 * Reusable search box with filter button for guest pages
 */

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  onFilterClick,
  placeholder = "Search services...",
  showFilter = true,
}) => {
  return (
    <div className="flex gap-2 px-4 py-3 bg-white">
      {/* Search Box */}
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Filter Button */}
      {showFilter && (
        <button
          onClick={onFilterClick}
          className="flex items-center justify-center w-11 h-11 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Filter"
        >
          <SlidersHorizontal size={20} className="text-gray-700" />
        </button>
      )}
    </div>
  );
};
