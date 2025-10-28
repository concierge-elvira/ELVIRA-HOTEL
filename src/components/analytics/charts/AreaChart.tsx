import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DEFAULT_CHART_COLORS, CHART_THEME } from "../constants";

interface AreaChartProps {
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
}

export function AreaChart({
  data,
  dataKeys,
  xAxisKey,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          {dataKeys.map((item, index) => {
            const color =
              item.color ||
              DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length];
            return (
              <linearGradient
                key={`gradient-${item.key}`}
                id={`color-${item.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            );
          })}
        </defs>
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
            iconType="square"
            iconSize={12}
          />
        )}
        {dataKeys.map((item, index) => {
          const color =
            item.color ||
            DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length];
          return (
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.name}
              stroke={color}
              strokeWidth={2}
              fill={`url(#color-${item.key})`}
              stackId={stacked ? "stack" : undefined}
            />
          );
        })}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
