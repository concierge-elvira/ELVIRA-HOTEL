import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
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
import { useOperationsAnalytics } from "../../../../hooks/analytics";
import { CHART_COLORS } from "../../../../components/analytics/constants";

interface OperationsAnalyticsSectionProps {
  hotelId: string | undefined;
}

export function OperationsAnalyticsSection({
  hotelId,
}: OperationsAnalyticsSectionProps) {
  const { data, isLoading } = useOperationsAnalytics(hotelId);

  if (isLoading || !data) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
        Loading operations analytics...
      </div>
    );
  }

  const { operations, trends } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stat Cards Row */}
      <StatCardsGrid columns={4}>
        <StatCard
          title="Total Orders"
          value={operations.totalOrders}
          icon={<Package className="w-6 h-6 text-emerald-600" />}
          variant="primary"
        />
        <StatCard
          title="Pending Orders"
          value={operations.pendingOrders}
          icon={<Clock className="w-6 h-6 text-orange-600" />}
          variant="warning"
        />
        <StatCard
          title="Completion Rate"
          value={`${operations.orderCompletionRate.toFixed(1)}%`}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          variant="success"
        />
        <StatCard
          title="Avg Processing Time"
          value={`${operations.averageOrderTime.toFixed(0)} min`}
          icon={<XCircle className="w-6 h-6 text-blue-600" />}
          variant="info"
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
          title="Orders by Type"
          subtitle="Comparison across services"
        >
          <BarChart
            data={trends.byType}
            dataKeys={[
              {
                key: "count",
                name: "Order Count",
                color: CHART_COLORS.primary,
              },
            ]}
            xAxisKey="type"
            height={300}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Order Trends"
          subtitle="Daily orders over 30 days"
        >
          <LineChart
            data={trends.daily}
            dataKeys={[
              { key: "dineIn", name: "Restaurant", color: CHART_COLORS.orange },
              { key: "shop", name: "Shop", color: CHART_COLORS.purple },
              { key: "amenities", name: "Amenities", color: CHART_COLORS.blue },
            ]}
            xAxisKey="date"
            height={300}
          />
        </AnalyticsCard>

        <AnalyticsCard
          title="Service Distribution"
          subtitle="Order breakdown by service"
        >
          <PieChart
            data={trends.byType.map((item, index) => ({
              name: item.type,
              value: item.count,
              color: [
                CHART_COLORS.orange,
                CHART_COLORS.purple,
                CHART_COLORS.blue,
              ][index],
            }))}
            height={300}
            donut
          />
        </AnalyticsCard>
      </div>
    </div>
  );
}
