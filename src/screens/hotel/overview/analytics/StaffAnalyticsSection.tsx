import { Users, Calendar, AlertCircle, Building2 } from "lucide-react";
import {
  StatCard,
  StatCardsGrid,
} from "../../../../components/shared/stat-cards";
import {
  AnalyticsCard,
  PieChart,
  BarChart,
} from "../../../../components/analytics";
import { useStaffAnalytics } from "../../../../hooks/analytics";

interface StaffAnalyticsSectionProps {
  hotelId: string | undefined;
}

export function StaffAnalyticsSection({ hotelId }: StaffAnalyticsSectionProps) {
  const { data, isLoading } = useStaffAnalytics(hotelId);

  if (isLoading || !data) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
        Loading staff analytics...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Summary Cards */}
      <StatCardsGrid columns={4}>
        <StatCard
          title="Total Staff"
          value={data.totalStaff}
          icon={<Users className="w-6 h-6 text-emerald-600" />}
          variant="primary"
        />
        <StatCard
          title="Schedules"
          value={data.totalSchedules}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
          variant="info"
        />
        <StatCard
          title="Total Absences"
          value={data.totalAbsences}
          icon={<AlertCircle className="w-6 h-6 text-orange-600" />}
          variant="warning"
        />
        <StatCard
          title="Departments"
          value={data.totalDepartments}
          icon={<Building2 className="w-6 h-6 text-purple-600" />}
          variant="default"
        />
      </StatCardsGrid>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Staff by Department */}
        <AnalyticsCard title="Staff by Department">
          <PieChart
            data={data.staffByDepartment}
            showLegend={true}
            showLabels={true}
          />
        </AnalyticsCard>

        {/* Staff by Position */}
        <AnalyticsCard title="Staff by Position">
          <BarChart
            data={data.staffByPosition}
            dataKeys={[{ key: "value", name: "Count", color: "#10b981" }]}
            xAxisKey="name"
            showGrid={true}
            showLegend={false}
          />
        </AnalyticsCard>

        {/* Schedules by Status */}
        <AnalyticsCard title="Schedules by Status">
          <BarChart
            data={data.schedulesByStatus}
            dataKeys={[{ key: "count", name: "Schedules", color: "#3b82f6" }]}
            xAxisKey="name"
            showGrid={true}
            showLegend={false}
          />
        </AnalyticsCard>

        {/* Absences by Type */}
        <AnalyticsCard title="Absences by Type">
          <PieChart
            data={data.absencesByType}
            showLegend={true}
            showLabels={true}
          />
        </AnalyticsCard>

        {/* Staff Status Distribution */}
        <AnalyticsCard title="Staff Status Distribution">
          <PieChart
            data={data.staffByStatus}
            showLegend={true}
            showLabels={true}
          />
        </AnalyticsCard>

        {/* Absence Requests by Status */}
        <AnalyticsCard title="Absence Requests by Status">
          <BarChart
            data={data.absencesByStatus}
            dataKeys={[{ key: "count", name: "Absences", color: "#f59e0b" }]}
            xAxisKey="name"
            showGrid={true}
            showLegend={false}
          />
        </AnalyticsCard>
      </div>

      {/* Department Performance - Full Width */}
      <AnalyticsCard title="Department Performance (Schedule Completion)">
        <BarChart
          data={data.departmentPerformance}
          dataKeys={[
            { key: "completed", name: "Completed", color: "#10b981" },
            { key: "total", name: "Total", color: "#e5e7eb" },
          ]}
          xAxisKey="name"
          showGrid={true}
          showLegend={true}
        />
      </AnalyticsCard>
    </div>
  );
}
