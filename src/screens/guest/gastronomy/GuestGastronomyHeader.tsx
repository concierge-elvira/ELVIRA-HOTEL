import React from "react";
import { SearchFilterBar } from "../shared/search-filter";

interface GuestGastronomyHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const GuestGastronomyHeader: React.FC<GuestGastronomyHeaderProps> = ({
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
      placeholder="Search gastronomy places..."
    />
  );
};
