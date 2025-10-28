import { Users, UserCheck, UserPlus, Calendar } from "lucide-react";
import {
  StatCard,
  StatCardsGrid,
} from "../../../../components/shared/stat-cards";
import {
  AnalyticsCard,
  LineChart,
  PieChart,
  BarChart,
} from "../../../../components/analytics";
import { useGuestAnalytics } from "../../../../hooks/analytics";
import { CHART_COLORS } from "../../../../components/analytics/constants";

interface GuestAnalyticsSectionProps {
  hotelId: string | undefined;
}

export function GuestAnalyticsSection({ hotelId }: GuestAnalyticsSectionProps) {
  const { data, isLoading } = useGuestAnalytics(hotelId);

  if (isLoading || !data) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
        Loading guest analytics...
      </div>
    );
  }

  const { analytics, demographics, trends } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stat Cards Row */}
      <StatCardsGrid columns={4}>
        <StatCard
          title="Total Guests"
          value={analytics.totalGuests}
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          variant="primary"
        />
        <StatCard
          title="Active Guests"
          value={analytics.activeGuests}
          icon={<UserCheck className="w-6 h-6 text-blue-600" />}
          variant="info"
        />
        <StatCard
          title="New This Week"
          value={analytics.newGuestsThisWeek}
          icon={<UserPlus className="w-6 h-6 text-green-600" />}
          variant="success"
        />
        <StatCard
          title="New This Month"
          value={analytics.newGuestsThisMonth}
          icon={<Calendar className="w-6 h-6 text-purple-600" />}
          variant="default"
        />
      </StatCardsGrid>

      {/* Charts Row - Growth Trend */}
      <AnalyticsCard
        title="Guest Growth Trend"
        subtitle="New guests over the last 30 days"
      >
        <LineChart
          data={trends.daily}
          dataKeys={[
            { key: "value", name: "New Guests", color: CHART_COLORS.primary },
          ]}
          xAxisKey="date"
          height={320}
        />
      </AnalyticsCard>

      {/* Charts Row - Demographics (3 columns) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        <AnalyticsCard
          title="Guest Type Distribution"
          subtitle="Individual vs Group guests"
        >
          <PieChart
            data={demographics.guestTypes.map((type, index) => ({
              name: type.type,
              value: type.count,
              color: index === 0 ? CHART_COLORS.blue : CHART_COLORS.purple,
            }))}
            height={300}
            donut
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Top Countries"
          subtitle="Guest distribution by country"
        >
          <BarChart
            data={demographics.countries.slice(0, 5)}
            dataKeys={[
              { key: "count", name: "Guests", color: CHART_COLORS.primary },
            ]}
            xAxisKey="country"
            height={300}
            horizontal
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Age Distribution"
          subtitle="Guest demographics by age"
        >
          <PieChart
            data={demographics.ageGroups.map((group, index) => ({
              name: group.range,
              value: group.count,
              color: [
                CHART_COLORS.blue,
                CHART_COLORS.green,
                CHART_COLORS.orange,
                CHART_COLORS.purple,
                CHART_COLORS.pink,
              ][index % 5],
            }))}
            height={300}
            donut
          />
        </AnalyticsCard>
      </div>
    </div>
  );
}
