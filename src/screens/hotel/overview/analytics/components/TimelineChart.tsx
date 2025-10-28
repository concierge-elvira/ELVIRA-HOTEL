import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CHART_COLORS,
  CHART_THEME,
} from "../../../../../components/analytics/constants";
import type { TopicTrendData } from "../../../../../types/analytics";

interface TimelineChartProps {
  data: TopicTrendData[];
  topTopics: string[];
}

type ViewMode = "topics" | "sentiment" | "urgency" | "all";

export function TimelineChart({ data, topTopics }: TimelineChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No timeline data available. Messages will appear here once guest
        conversations are analyzed.
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Get data keys based on view mode
  const getDataKeys = () => {
    switch (viewMode) {
      case "topics":
        return topTopics.slice(0, 5).map((topic, index) => ({
          key: topic,
          name: topic,
          color: [
            CHART_COLORS.primary,
            CHART_COLORS.blue,
            CHART_COLORS.purple,
            CHART_COLORS.orange,
            CHART_COLORS.teal,
          ][index % 5],
        }));
      case "sentiment":
        return [
          {
            key: "positive",
            name: "Positive",
            color: CHART_COLORS.green,
          },
          {
            key: "neutral",
            name: "Neutral",
            color: CHART_COLORS.yellow,
          },
          {
            key: "negative",
            name: "Negative",
            color: CHART_COLORS.red,
          },
        ];
      case "urgency":
        return [
          {
            key: "urgencyHigh",
            name: "High",
            color: CHART_COLORS.red,
          },
          {
            key: "urgencyMedium",
            name: "Medium",
            color: CHART_COLORS.orange,
          },
          {
            key: "urgencyLow",
            name: "Low",
            color: CHART_COLORS.green,
          },
        ];
      case "all":
      default:
        return [
          // Top 3 topics
          ...topTopics.slice(0, 3).map((topic, index) => ({
            key: topic,
            name: topic,
            color: [
              CHART_COLORS.primary,
              CHART_COLORS.blue,
              CHART_COLORS.purple,
            ][index],
          })),
          // Sentiment
          {
            key: "positive",
            name: "Positive",
            color: CHART_COLORS.green,
          },
          {
            key: "negative",
            name: "Negative",
            color: CHART_COLORS.red,
          },
        ];
    }
  };

  const dataKeys = getDataKeys();

  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setViewMode("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "all"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Combined
        </button>
        <button
          onClick={() => setViewMode("topics")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "topics"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Topics Only
        </button>
        <button
          onClick={() => setViewMode("sentiment")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "sentiment"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Sentiment Only
        </button>
        <button
          onClick={() => setViewMode("urgency")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "urgency"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Urgency Only
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
          <XAxis
            dataKey="date"
            stroke={CHART_THEME.axisColor}
            fontSize={11}
            tickLine={false}
            tickFormatter={formatDate}
          />
          <YAxis
            stroke={CHART_THEME.axisColor}
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: "8px",
              boxShadow: CHART_THEME.tooltipShadow,
            }}
            labelStyle={{ color: CHART_THEME.labelColor, fontWeight: 600 }}
            labelFormatter={formatDate}
          />
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            iconType="line"
            iconSize={14}
          />

          {dataKeys.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.name}
              stroke={item.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend explanation */}
      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
        {viewMode === "all" && (
          <p>
            <strong>Combined view:</strong> Top 3 topics and positive/negative
            sentiment trends
          </p>
        )}
        {viewMode === "topics" && (
          <p>
            <strong>Topics view:</strong> Top 5 conversation topics over time
          </p>
        )}
        {viewMode === "sentiment" && (
          <p>
            <strong>Sentiment view:</strong> Positive, neutral, and negative
            trends
          </p>
        )}
        {viewMode === "urgency" && (
          <p>
            <strong>Urgency view:</strong> High, medium, and low urgency trends
          </p>
        )}
      </div>
    </div>
  );
}
