import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DEFAULT_CHART_COLORS, CHART_THEME } from "../constants";

interface BarChartProps {
  data: Array<{ [key: string]: string | number }>;
  dataKeys: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
}

export function BarChart({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  horizontal = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
        )}
        {horizontal ? (
          <>
            <XAxis
              type="number"
              stroke={CHART_THEME.axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke={CHART_THEME.axisColor}
              fontSize={12}
              tickLine={false}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke={CHART_THEME.axisColor}
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke={CHART_THEME.axisColor}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_THEME.tooltipBg,
            border: `1px solid ${CHART_THEME.tooltipBorder}`,
            borderRadius: "8px",
            boxShadow: CHART_THEME.tooltipShadow,
          }}
          labelStyle={{ color: CHART_THEME.labelColor, fontWeight: 600 }}
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="square"
            iconSize={12}
          />
        )}
        {dataKeys.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.name}
            fill={
              item.color ||
              DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]
            }
            radius={[8, 8, 0, 0]}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
