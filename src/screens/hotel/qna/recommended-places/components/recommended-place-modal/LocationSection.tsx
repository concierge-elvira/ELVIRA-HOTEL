import { useEffect, useRef } from "react";
import { ModalFormSection } from "../../../../../../components/ui/modalform";
import { Input } from "../../../../../../components/ui";
import type { PlaceSectionProps } from "./types";

export function LocationSection({
  mode,
  formData,
  errors,
  onChange,
}: PlaceSectionProps) {
  const disabled = mode === "view";
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (disabled) return;

    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    // Wait for the input to be rendered
    const inputElement = document.getElementById(
      "place-address-input"
    ) as HTMLInputElement;
    if (!inputElement) return;

    addressInputRef.current = inputElement;

    // Initialize autocomplete
    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputElement,
      {
        types: ["establishment", "geocode"],
        fields: ["formatted_address", "geometry", "name"],
      }
    );

    // Listen for place selection
    const placeChangedListener = () => {
      const place = autocompleteInstance.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || "";

        // Update form data
        onChange("address", address);
        onChange("latitude", lat);
        onChange("longitude", lng);

        // If place name is empty, use the selected place name
        if (!formData.placeName && place.name) {
          onChange("placeName", place.name);
        }
      }
    };

    autocompleteInstance.addListener("place_changed", placeChangedListener);

    return () => {
      if (autocompleteInstance) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return (
    <ModalFormSection title="Location">
      <Input
        id="place-address-input"
        label="Address"
        value={formData.address}
        onChange={(e) => onChange("address", e.target.value)}
        error={errors?.address}
        disabled={disabled}
        placeholder="Start typing to search for an address..."
        required
      />

      {/* Hidden inputs to store lat/long but not display them */}
      <input type="hidden" value={formData.latitude?.toString() || ""} />
      <input type="hidden" value={formData.longitude?.toString() || ""} />

      {!disabled && formData.latitude && formData.longitude && (
        <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm text-emerald-700">
            <span className="font-medium">📍 Location set:</span>{" "}
            {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </p>
        </div>
      )}
    </ModalFormSection>
  );
}
