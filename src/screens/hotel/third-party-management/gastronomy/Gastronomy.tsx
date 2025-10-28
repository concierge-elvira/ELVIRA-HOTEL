import { PlacesTable } from "../shared";

interface GastronomyProps {
  searchValue: string;
}

export function Gastronomy({ searchValue }: GastronomyProps) {
  return (
    <PlacesTable
      category="gastronomy"
      searchValue={searchValue}
      title="Gastronomy Partners"
      description="Restaurants, cafes, and food establishments from Google Places"
      emptyMessage="No gastronomy places available yet."
    />
  );
}
