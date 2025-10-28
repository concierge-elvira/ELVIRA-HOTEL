import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DEFAULT_CHART_COLORS, CHART_THEME } from "../constants";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  showLegend?: boolean;
  donut?: boolean;
  showLabels?: boolean;
}

export function PieChart({
  data,
  height = 300,
  showLegend = true,
  donut = false,
  showLabels = true,
}: PieChartProps) {
  // Custom label with better positioning
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (props: any) => {
    if (!showLabels) return null;

    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={donut ? 90 : 100}
          innerRadius={donut ? 60 : 0}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.color ||
                DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]
              }
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_THEME.tooltipBg,
            border: `1px solid ${CHART_THEME.tooltipBorder}`,
            borderRadius: "8px",
            boxShadow: CHART_THEME.tooltipShadow,
          }}
          formatter={(value: number) => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return [`${value} (${percent}%)`, ""];
          }}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={10}
            formatter={(value, entry) => {
              const item = entry.payload as { value: number };
              const total = data.reduce((sum, d) => sum + d.value, 0);
              const percent = ((item.value / total) * 100).toFixed(1);
              return `${value} (${percent}%)`;
            }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
