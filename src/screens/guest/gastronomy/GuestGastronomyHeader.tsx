import React from "react";
import { SearchFilterBar } from "../shared/search-filter";
import { MapButton } from "../../../components/guest/shared/map";

interface GuestGastronomyHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onBackClick: () => void;
  onMapClick?: () => void;
}

export const GuestGastronomyHeader: React.FC<GuestGastronomyHeaderProps> = ({
  searchValue,
  onSearchChange,
  onBackClick,
  onMapClick,
}) => {
  return (
    <SearchFilterBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onBackClick={onBackClick}
      placeholder="Search gastronomy places..."
      rightIcon={onMapClick ? <MapButton onClick={onMapClick} /> : undefined}
    />
  );
};
