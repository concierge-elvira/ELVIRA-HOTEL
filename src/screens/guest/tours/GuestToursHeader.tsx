import React from "react";
import { SearchFilterBar } from "../shared/search-filter";
import { MapButton } from "../../../components/guest/shared/map";

interface GuestToursHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onBackClick: () => void;
  onMapClick?: () => void;
}

export const GuestToursHeader: React.FC<GuestToursHeaderProps> = ({
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
      placeholder="Search tours and activities..."
      rightIcon={onMapClick ? <MapButton onClick={onMapClick} /> : undefined}
    />
  );
};
