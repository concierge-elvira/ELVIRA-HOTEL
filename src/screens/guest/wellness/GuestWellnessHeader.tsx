import React from "react";
import { SearchFilterBar } from "../shared/search-filter";

interface GuestWellnessHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const GuestWellnessHeader: React.FC<GuestWellnessHeaderProps> = ({
  searchValue,
  onSearchChange,
}) => {
  return (
    <SearchFilterBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onFilterClick={() => {
        console.log("Filter clicked");
      }}
      placeholder="Search wellness places..."
    />
  );
};
