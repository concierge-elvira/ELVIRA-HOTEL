import React from "react";
import { SearchFilterBar } from "../shared/search-filter";
import { CartButton } from "../../../components/guest/shared/cart";

interface GuestAmenitiesHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export const GuestAmenitiesHeader: React.FC<GuestAmenitiesHeaderProps> = ({
  searchValue,
  onSearchChange,
  cartCount,
  onCartClick,
}) => {
  return (
    <SearchFilterBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onFilterClick={() => {
        console.log("Filter clicked");
      }}
      placeholder="Search amenities..."
      cartButton={<CartButton itemCount={cartCount} onClick={onCartClick} />}
    />
  );
};
