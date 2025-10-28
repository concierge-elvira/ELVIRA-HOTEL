import {
  StatCard,
  StatCardsGrid,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
} from "../../../../components/shared/stat-cards";
import { useHotelThirdPartyPlacesStats } from "../../../../hooks/third-party-management/hotel-places";
import { useCurrentUserHotel } from "../../../../hooks/useCurrentUserHotel";

interface ThirdPartyStatsCardsProps {
  category?: string;
}

export function ThirdPartyStatsCards({ category }: ThirdPartyStatsCardsProps) {
  const { data: hotelData } = useCurrentUserHotel();
  const hotelId = hotelData?.hotel?.id;
  const { data: stats, isLoading } = useHotelThirdPartyPlacesStats(
    hotelId,
    category
  );

  if (isLoading || !stats) {
    return (
      <StatCardsGrid columns={4}>
        <StatCard
          title="Total Places"
          value={0}
          icon={<MapPinIcon className="w-6 h-6 text-gray-600" />}
          loading={true}
        />
        <StatCard
          title="Approved"
          value={0}
          icon={<CheckCircleIcon className="w-6 h-6 text-emerald-600" />}
          variant="primary"
          loading={true}
        />
        <StatCard
          title="Recommended"
          value={0}
          icon={
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          }
          variant="warning"
          loading={true}
        />
        <StatCard
          title="Pending Review"
          value={0}
          icon={<ClockIcon className="w-6 h-6 text-orange-600" />}
          variant="warning"
          loading={true}
        />
      </StatCardsGrid>
    );
  }

  return (
    <StatCardsGrid columns={4}>
      <StatCard
        title="Total Places"
        value={stats.total}
        icon={<MapPinIcon className="w-6 h-6 text-gray-600" />}
      />
      <StatCard
        title="Approved"
        value={stats.approved}
        icon={<CheckCircleIcon className="w-6 h-6 text-emerald-600" />}
        variant="primary"
      />
      <StatCard
        title="Recommended"
        value={stats.recommended}
        icon={
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        }
        variant="warning"
      />
      <StatCard
        title="Pending Review"
        value={stats.pending}
        icon={<ClockIcon className="w-6 h-6 text-orange-600" />}
        variant="warning"
      />
    </StatCardsGrid>
  );
}
