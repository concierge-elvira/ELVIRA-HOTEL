import { PlacesTable } from "../shared";

interface WellnessProps {
  searchValue: string;
}

export function Wellness({ searchValue }: WellnessProps) {
  return (
    <PlacesTable
      category="wellness"
      searchValue={searchValue}
      title="Wellness & Spa Partners"
      description="Wellness centers, spas, and health service providers from Google Places"
      emptyMessage="No wellness places available yet."
    />
  );
}
