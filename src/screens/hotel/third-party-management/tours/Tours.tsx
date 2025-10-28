import { PlacesTable } from "../shared";

interface ToursProps {
  searchValue: string;
}

export function Tours({ searchValue }: ToursProps) {
  return (
    <PlacesTable
      category="tours"
      searchValue={searchValue}
      title="Tours & Activities Partners"
      description="Tour operators, excursion providers, and activity centers from Google Places"
      emptyMessage="No tours places available yet."
    />
  );
}
