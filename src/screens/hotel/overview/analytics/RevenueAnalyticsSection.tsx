import {
  DollarSign,
  TrendingUp,
  Utensils,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import {
  StatCard,
  StatCardsGrid,
} from "../../../../components/shared/stat-cards";
import {
  AnalyticsCard,
  AreaChart,
  PieChart,
  BarChart,
} from "../../../../components/analytics";
import { useRevenueAnalytics } from "../../../../hooks/analytics";
import { CHART_COLORS } from "../../../../components/analytics/constants";

interface RevenueAnalyticsSectionProps {
  hotelId: string | undefined;
}

export function RevenueAnalyticsSection({
  hotelId,
}: RevenueAnalyticsSectionProps) {
  const { data, isLoading } = useRevenueAnalytics(hotelId);

  if (isLoading || !data) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
        Loading revenue analytics...
      </div>
    );
  }

  const { analytics, bySource, trends } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stat Cards Row */}
      <StatCardsGrid columns={5}>
        <StatCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          variant="success"
        />
        <StatCard
          title="This Month"
          value={`$${analytics.revenueThisMonth.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          variant="info"
        />
        <StatCard
          title="Restaurant Revenue"
          value={`$${bySource.restaurant.toLocaleString()}`}
          icon={<Utensils className="w-6 h-6 text-orange-600" />}
          variant="warning"
        />
        <StatCard
          title="Shop Revenue"
          value={`$${bySource.shop.toLocaleString()}`}
          icon={<ShoppingCart className="w-6 h-6 text-purple-600" />}
          variant="default"
        />
        <StatCard
          title="Amenities Revenue"
          value={`$${bySource.amenities.toLocaleString()}`}
          icon={<Sparkles className="w-6 h-6 text-emerald-600" />}
          variant="primary"
        />
      </StatCardsGrid>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        <AnalyticsCard
          title="Revenue Trend"
          subtitle="Daily revenue over 30 days"
        >
          <AreaChart
            data={trends.daily}
            dataKeys={[
              { key: "value", name: "Revenue ($)", color: CHART_COLORS.green },
            ]}
            xAxisKey="date"
            height={300}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Revenue by Source"
          subtitle="Distribution across services"
        >
          <PieChart
            data={[
              {
                name: "Restaurant",
                value: bySource.restaurant,
                color: CHART_COLORS.orange,
              },
              {
                name: "Shop",
                value: bySource.shop,
                color: CHART_COLORS.purple,
              },
              {
                name: "Amenities",
                value: bySource.amenities,
                color: CHART_COLORS.blue,
              },
            ].filter((item) => item.value > 0)}
            height={300}
          />
        </AnalyticsCard>

        <AnalyticsCard title="Average Revenue" subtitle="Per source comparison">
          <BarChart
            data={[
              { source: "Restaurant", value: bySource.restaurant },
              { source: "Shop", value: bySource.shop },
              { source: "Amenities", value: bySource.amenities },
            ]}
            dataKeys={[
              {
                key: "value",
                name: "Revenue ($)",
                color: CHART_COLORS.primary,
              },
            ]}
            xAxisKey="source"
            height={300}
          />
        </AnalyticsCard>
      </div>

      {/* Revenue by Source Timeline */}
      <AnalyticsCard
        title="Revenue by Source Over Time"
        subtitle="Track revenue streams over the last 30 days"
      >
        <AreaChart
          data={trends.bySource}
          dataKeys={[
            {
              key: "restaurant",
              name: "Restaurant",
              color: CHART_COLORS.orange,
            },
            { key: "shop", name: "Shop", color: CHART_COLORS.purple },
            { key: "amenities", name: "Amenities", color: CHART_COLORS.blue },
          ]}
          xAxisKey="date"
          height={320}
          stacked
        />
      </AnalyticsCard>
    </div>
  );
}
