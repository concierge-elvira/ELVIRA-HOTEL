import { Users, TrendingUp, Activity, Target } from "lucide-react";
import {
  StatCard,
  StatCardsGrid,
} from "../../../../components/shared/stat-cards";
import {
  AnalyticsCard,
  BarChart,
  LineChart,
  PieChart,
} from "../../../../components/analytics";
import { useGuestBehaviorAnalytics } from "../../../../hooks/analytics";
import { CHART_COLORS } from "../../../../components/analytics/constants";

interface GuestBehaviorSectionProps {
  hotelId: string | undefined;
}

export function GuestBehaviorSection({ hotelId }: GuestBehaviorSectionProps) {
  const { data, isLoading } = useGuestBehaviorAnalytics(hotelId);

  if (isLoading || !data) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
        Loading guest behavior analytics...
      </div>
    );
  }

  const {
    engagement,
    spendingPatterns,
    serviceUsageByAge,
    serviceUsageByCountry,
    guestJourney,
  } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stat Cards Row - Engagement Metrics */}
      <StatCardsGrid columns={4}>
        <StatCard
          title="Avg Orders/Guest"
          value={engagement.averageOrdersPerGuest.toFixed(1)}
          icon={<Activity className="w-6 h-6 text-emerald-600" />}
          variant="primary"
        />
        <StatCard
          title="Customer Engagement"
          value={`${engagement.repeatCustomerRate}%`}
          icon={<Target className="w-6 h-6 text-blue-600" />}
          variant="info"
        />
        <StatCard
          title="Top Service"
          value={engagement.preferredServices[0]?.service || "N/A"}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          variant="success"
        />
        <StatCard
          title="Active Time"
          value={engagement.mostActiveTimeSlot.split(" ")[0]}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          variant="default"
        />
      </StatCardsGrid>

      {/* WHO: Guest Demographics & Spending */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        <AnalyticsCard
          title="Spending by Guest Type"
          subtitle="WHO spends more? Individual vs Group"
        >
          <BarChart
            data={spendingPatterns}
            dataKeys={[
              {
                key: "restaurant",
                name: "Restaurant",
                color: CHART_COLORS.orange,
              },
              { key: "shop", name: "Shop", color: CHART_COLORS.purple },
              { key: "amenities", name: "Amenities", color: CHART_COLORS.blue },
            ]}
            xAxisKey="guestType"
            height={300}
            stacked
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Service Usage by Age"
          subtitle="WHO uses each service? Age groups"
        >
          <BarChart
            data={serviceUsageByAge}
            dataKeys={[
              {
                key: "restaurant",
                name: "Restaurant",
                color: CHART_COLORS.orange,
              },
              { key: "shop", name: "Shop", color: CHART_COLORS.purple },
              { key: "amenities", name: "Amenities", color: CHART_COLORS.blue },
            ]}
            xAxisKey="demographic"
            height={300}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Service Preferences"
          subtitle="WHAT guests prefer most"
        >
          <PieChart
            data={engagement.preferredServices.map(
              (service, index: number) => ({
                name: service.service,
                value: service.count,
                color: [
                  CHART_COLORS.orange,
                  CHART_COLORS.purple,
                  CHART_COLORS.blue,
                ][index],
              })
            )}
            height={300}
          />
        </AnalyticsCard>
      </div>

      {/* HOW: Guest Behavior Patterns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        <AnalyticsCard
          title="Service Usage by Country"
          subtitle="HOW different cultures use services"
        >
          <BarChart
            data={serviceUsageByCountry}
            dataKeys={[
              {
                key: "restaurant",
                name: "Restaurant",
                color: CHART_COLORS.orange,
              },
              { key: "shop", name: "Shop", color: CHART_COLORS.purple },
              { key: "amenities", name: "Amenities", color: CHART_COLORS.blue },
            ]}
            xAxisKey="demographic"
            height={300}
            stacked
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Guest Journey"
          subtitle="HOW guests progress through stay"
        >
          <LineChart
            data={guestJourney}
            dataKeys={[
              { key: "count", name: "Guests", color: CHART_COLORS.primary },
            ]}
            xAxisKey="stage"
            height={300}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Service Distribution"
          subtitle="WHAT percentage each service"
        >
          <PieChart
            data={[
              {
                name: "Restaurant",
                value: serviceUsageByAge.reduce(
                  (sum: number, item) => sum + item.restaurant,
                  0
                ),
                color: CHART_COLORS.orange,
              },
              {
                name: "Shop",
                value: serviceUsageByAge.reduce(
                  (sum: number, item) => sum + item.shop,
                  0
                ),
                color: CHART_COLORS.purple,
              },
              {
                name: "Amenities",
                value: serviceUsageByAge.reduce(
                  (sum: number, item) => sum + item.amenities,
                  0
                ),
                color: CHART_COLORS.blue,
              },
            ]}
            height={300}
            donut
          />
        </AnalyticsCard>
      </div>
    </div>
  );
}
