import React from "react";
import { SearchFilterBar } from "../shared/search-filter";
import { CartButton } from "../../../components/guest/shared/cart";

interface GuestAmenitiesHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onCartClick: () => void;
  onBackClick: () => void;
}

export const GuestAmenitiesHeader: React.FC<GuestAmenitiesHeaderProps> = ({
  searchValue,
  onSearchChange,
  cartCount,
  onCartClick,
  onBackClick,
}) => {
  return (
    <SearchFilterBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onBackClick={onBackClick}
      placeholder="Search amenities..."
      cartButton={<CartButton itemCount={cartCount} onClick={onCartClick} />}
    />
  );
};
