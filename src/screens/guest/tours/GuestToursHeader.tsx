import React from "react";
import { SearchFilterBar } from "../shared/search-filter";

interface GuestToursHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const GuestToursHeader: React.FC<GuestToursHeaderProps> = ({
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
      placeholder="Search tours and activities..."
    />
  );
};
