import { useEffect, useState } from "react";

interface UseGoogleMapsOptions {
  apiKey?: string;
  libraries?: string[];
}

interface GoogleMapsState {
  isLoaded: boolean;
  loadError: Error | null;
}

/**
 * Hook to load Google Maps JavaScript API
 * Manages the loading state and prevents duplicate script loading
 */
export function useGoogleMaps(options: UseGoogleMapsOptions = {}) {
  const [state, setState] = useState<GoogleMapsState>({
    isLoaded: false,
    loadError: null,
  });

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setState({ isLoaded: true, loadError: null });
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        setState({ isLoaded: true, loadError: null });
      });
      existingScript.addEventListener("error", (error) => {
        setState({
          isLoaded: false,
          loadError: error as any,
        });
      });
      return;
    }

    // Note: Google Maps API key should be loaded from environment or server-side
    // For now, we assume it's already loaded via script tag in index.html
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps) {
        setState({ isLoaded: true, loadError: null });
        clearInterval(checkInterval);
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
      if (!window.google || !window.google.maps) {
        setState({
          isLoaded: false,
          loadError: new Error("Google Maps failed to load"),
        });
      }
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []); // Only run once on mount

  return state;
}
