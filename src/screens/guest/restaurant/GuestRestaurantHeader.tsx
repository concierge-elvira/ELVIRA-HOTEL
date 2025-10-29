import React from "react";
import { SearchFilterBar } from "../shared/search-filter";
import { CartButton } from "../../../components/guest/shared/cart";

interface GuestRestaurantHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onCartClick: () => void;
  onBackClick: () => void;
}

export const GuestRestaurantHeader: React.FC<GuestRestaurantHeaderProps> = ({
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
      placeholder="Search menu..."
      cartButton={<CartButton itemCount={cartCount} onClick={onCartClick} />}
    />
  );
};
