import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DEFAULT_CHART_COLORS, CHART_THEME } from "../constants";

interface LineChartProps {
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
  curved?: boolean;
}

export function LineChart({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  curved = true,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
        )}
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
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_THEME.tooltipBg,
            border: `1px solid ${CHART_THEME.tooltipBorder}`,
            borderRadius: "8px",
            boxShadow: CHART_THEME.tooltipShadow,
          }}
          labelStyle={{ color: CHART_THEME.labelColor, fontWeight: 600 }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
            iconSize={16}
          />
        )}
        {dataKeys.map((item, index) => (
          <Line
            key={item.key}
            type={curved ? "monotone" : "linear"}
            dataKey={item.key}
            name={item.name}
            stroke={
              item.color ||
              DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]
            }
            strokeWidth={2}
            dot={{
              fill:
                item.color ||
                DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length],
              r: 4,
            }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
