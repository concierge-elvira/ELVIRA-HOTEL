import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS, CHART_THEME } from "../constants";

interface ParetoChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: number;
    cumulativePercentage: number;
  }>;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  barColor?: string;
  lineColor?: string;
}

export function ParetoChart({
  data,
  height = 400,
  showGrid = true,
  showLegend = true,
  barColor = CHART_COLORS.primary,
  lineColor = CHART_COLORS.red,
}: ParetoChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 50 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
        )}
        <XAxis
          dataKey="name"
          stroke={CHART_THEME.axisColor}
          fontSize={11}
          tickLine={false}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis
          yAxisId="left"
          stroke={CHART_THEME.axisColor}
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke={CHART_THEME.axisColor}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_THEME.tooltipBg,
            border: `1px solid ${CHART_THEME.tooltipBorder}`,
            borderRadius: "8px",
            boxShadow: CHART_THEME.tooltipShadow,
          }}
          labelStyle={{ color: CHART_THEME.labelColor, fontWeight: 600 }}
          formatter={(value: number, name: string) => {
            if (name === "Cumulative %") {
              return [`${value.toFixed(1)}%`, name];
            }
            return [value, name];
          }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            iconType="square"
            iconSize={10}
          />
        )}
        <Bar
          yAxisId="left"
          dataKey="value"
          name="Count"
          fill={barColor}
          radius={[6, 6, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="cumulativePercentage"
          name="Cumulative %"
          stroke={lineColor}
          strokeWidth={2}
          dot={{ fill: lineColor, r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
