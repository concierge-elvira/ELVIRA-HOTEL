import React from "react";
import { SearchFilterBar } from "../shared/search-filter";
import { MapButton } from "../../../components/guest/shared/map";

interface GuestWellnessHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onBackClick: () => void;
  onMapClick?: () => void;
}

export const GuestWellnessHeader: React.FC<GuestWellnessHeaderProps> = ({
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
      placeholder="Search wellness places..."
      rightIcon={onMapClick ? <MapButton onClick={onMapClick} /> : undefined}
    />
  );
};
