import React from "react";
import { SearchFilterBar } from "../shared/search-filter";
import { CartButton } from "../../../components/guest/shared/cart";

interface GuestShopHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onCartClick: () => void;
}

export const GuestShopHeader: React.FC<GuestShopHeaderProps> = ({
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
      placeholder="Search products..."
      cartButton={<CartButton itemCount={cartCount} onClick={onCartClick} />}
    />
  );
};
