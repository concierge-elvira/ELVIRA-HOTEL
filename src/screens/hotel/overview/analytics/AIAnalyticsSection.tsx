import { MessageSquare, TrendingUp, Users, AlertCircle } from "lucide-react";
import {
  StatCard,
  StatCardsGrid,
} from "../../../../components/shared/stat-cards";
import {
  AnalyticsCard,
  PieChart,
  BarChart,
} from "../../../../components/analytics";
import { useAIAnalytics } from "../../../../hooks/analytics";
import { CHART_COLORS } from "../../../../components/analytics/constants";
import { Table } from "../../../../components/ui";
import type { TableColumn } from "../../../../components/ui/tables/types";
import type { GuestMessageData } from "../../../../types/analytics";
import { InteractiveParetoChart, TimelineChart } from "./components";

interface AIAnalyticsSectionProps {
  hotelId: string | undefined;
}

export function AIAnalyticsSection({ hotelId }: AIAnalyticsSectionProps) {
  const { data, isLoading } = useAIAnalytics(hotelId);

  if (isLoading || !data) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
        Loading AI analytics...
      </div>
    );
  }

  const { analytics } = data;

  // Columns for top guests table
  const guestColumns: TableColumn<GuestMessageData>[] = [
    {
      key: "guestName",
      label: "Guest Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "messageCount",
      label: "Messages",
      sortable: true,
    },
    {
      key: "averageSentiment",
      label: "Sentiment",
      sortable: true,
      render: (_value: unknown, row: GuestMessageData) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.averageSentiment?.toLowerCase() === "positive"
              ? "bg-green-100 text-green-800"
              : row.averageSentiment?.toLowerCase() === "negative"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.averageSentiment || "Neutral"}
        </span>
      ),
    },
    {
      key: "topTopics",
      label: "Top Topics",
      render: (_value: unknown, row: GuestMessageData) => (
        <div className="flex flex-wrap gap-1">
          {row.topTopics.slice(0, 3).map((topic: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800"
            >
              {topic}
            </span>
          ))}
          {row.topTopics.length > 3 && (
            <span className="text-xs text-gray-500">
              +{row.topTopics.length - 3} more
            </span>
          )}
        </div>
      ),
    },
  ];

  // Calculate sentiment percentage
  const sentimentPercentage =
    analytics.totalMessages > 0
      ? ((analytics.averageSentiment + 1) / 2) * 100
      : 50;

  // Prepare data for charts with specific colors for sentiment
  const sentimentChartData = analytics.sentimentDistribution.map((item) => {
    let color: string = CHART_COLORS.yellow; // default neutral
    if (item.sentiment.toLowerCase() === "positive") {
      color = CHART_COLORS.green;
    } else if (item.sentiment.toLowerCase() === "negative") {
      color = CHART_COLORS.red;
    }
    return {
      name: item.sentiment,
      value: item.count,
      color,
    };
  });

  const urgencyChartData = analytics.urgencyDistribution.map((item) => ({
    urgency: item.urgency,
    count: item.count,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Stat Cards Row */}
      <StatCardsGrid columns={4}>
        <StatCard
          title="Total Messages"
          value={analytics.totalMessages}
          icon={<MessageSquare className="w-6 h-6 text-emerald-600" />}
          variant="primary"
        />
        <StatCard
          title="AI Analyzed"
          value={analytics.analyzedMessages}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          variant="info"
        />
        <StatCard
          title="Sentiment Score"
          value={`${sentimentPercentage.toFixed(0)}%`}
          icon={<AlertCircle className="w-6 h-6 text-purple-600" />}
          variant={
            sentimentPercentage >= 70
              ? "success"
              : sentimentPercentage >= 40
              ? "default"
              : "danger"
          }
        />
        <StatCard
          title="Active Guests"
          value={analytics.messagesByGuest.length}
          icon={<Users className="w-6 h-6 text-green-600" />}
          variant="success"
        />
      </StatCardsGrid>

      {/* Interactive Pareto Chart - Topics with Subtopic Drill-down */}
      <AnalyticsCard
        title="Topic & Subtopic Analysis - Interactive Pareto Chart"
        subtitle="Click on any topic to drill down into its subtopics (80/20 analysis)"
      >
        <InteractiveParetoChart topics={analytics.topTopics} />
      </AnalyticsCard>

      {/* Timeline Chart - Topics, Sentiment & Urgency Over Time */}
      <AnalyticsCard
        title="Timeline Analysis - Topics, Sentiment & Urgency"
        subtitle="Track conversation patterns over time with interactive view modes"
      >
        <TimelineChart
          data={analytics.topicTrends}
          topTopics={analytics.topTopics.map((t) => t.topic)}
        />
      </AnalyticsCard>

      {/* Sentiment & Urgency Distribution Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
        }}
      >
        <AnalyticsCard
          title="Sentiment Distribution"
          subtitle="Overall guest message sentiment"
        >
          <PieChart data={sentimentChartData} height={250} />
        </AnalyticsCard>

        <AnalyticsCard
          title="Urgency Distribution"
          subtitle="Message priority breakdown"
        >
          <BarChart
            data={urgencyChartData}
            dataKeys={[
              { key: "count", name: "Messages", color: CHART_COLORS.orange },
            ]}
            xAxisKey="urgency"
            height={250}
          />
        </AnalyticsCard>
      </div>

      {/* Top Messaging Guests Table */}
      <AnalyticsCard
        title="Top Messaging Guests"
        subtitle="Guests with the most interactions"
      >
        <Table
          columns={guestColumns}
          data={analytics.messagesByGuest.slice(0, 20)}
          itemsPerPage={10}
          emptyMessage="No guest messages found"
        />
      </AnalyticsCard>
    </div>
  );
}
