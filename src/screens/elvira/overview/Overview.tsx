import { useState } from "react";
import {
  PageContent,
  PageHeader,
} from "../../../components/shared/page-layouts";
import { OverviewContent } from "../../../components/analytics";
import { Select } from "../../../components/ui";
import type { TabItem } from "../../../components/ui";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";
import type { Database } from "../../../types/database";
import { WebAnalyticsSection } from "./web-analytics";

type Hotel = Database["public"]["Tables"]["hotels"]["Row"];

// Hook to fetch all hotels for Elvira dashboard
function useAllHotels() {
  return useQuery({
    queryKey: ["elvira", "all-hotels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Hotel[];
    },
  });
}

export function Overview() {
  const { data: hotels, isLoading: hotelsLoading } = useAllHotels();
  const [selectedHotelId, setSelectedHotelId] = useState<string | undefined>(
    undefined
  );

  // Prepare options for Select component
  const hotelOptions = [
    { value: "all", label: "All Hotels" },
    ...(hotels?.map((hotel: Hotel) => ({
      value: hotel.id,
      label: hotel.name,
    })) || []),
  ];

  // Web Analytics tab
  const webAnalyticsTab: TabItem = {
    id: "web-analytics",
    label: "Web Analytics",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  };

  const renderAdditionalTab = (tabId: string) => {
    if (tabId === "web-analytics") {
      return <WebAnalyticsSection hotelId={selectedHotelId} />;
    }
    return null;
  };

  const selectedHotel = hotels?.find((h: Hotel) => h.id === selectedHotelId);

  return (
    <PageContent>
      <PageHeader
        title="Analytics Dashboard"
        icon={
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
        rightContent={
          /* Hotel Selector */
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Filter by Hotel:
            </span>
            <div className="w-64">
              <Select
                options={hotelOptions}
                value={selectedHotelId || "all"}
                onChange={(e) =>
                  setSelectedHotelId(
                    e.target.value === "all" ? undefined : e.target.value
                  )
                }
                disabled={hotelsLoading}
                fullWidth={true}
              />
            </div>
            {selectedHotel && (
              <span className="text-sm text-gray-500">
                {selectedHotel.city}, {selectedHotel.country}
              </span>
            )}
          </div>
        }
      />

      <OverviewContent
        hotelId={selectedHotelId}
        prependTabs={[webAnalyticsTab]}
        renderAdditionalTab={renderAdditionalTab}
      />
    </PageContent>
  );
}
