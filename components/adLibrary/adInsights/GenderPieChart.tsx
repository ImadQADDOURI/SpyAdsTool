import React from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GenderPieChartProps {
  men: number;
  women: number;
  unknown: number;
}

const GenderPieChart: React.FC<GenderPieChartProps> = ({
  men,
  women,
  unknown,
}) => {
  const total = men + women + unknown;

  // Enhanced color palette for better visibility in both themes
  const chartData = [
    { gender: "Men", value: men, fill: "#6366F1" }, // Indigo
    { gender: "Women", value: women, fill: "#EC4899" }, // Pink
    { gender: "Unknown", value: unknown, fill: "#A855F7" }, // Purple
  ];

  const chartConfig: ChartConfig = {
    value: {
      label: "Value",
    },
    Men: {
      label: "Men",
      color: "#6366F1",
    },
    Women: {
      label: "Women",
      color: "#EC4899",
    },
    Unknown: {
      label: "Unknown",
      color: "#A855F7",
    },
  };

  const CustomLegendContent = ({ payload }: { payload?: Array<any> }) => {
    if (!payload) return null;
    return (
      <ul className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            className="flex items-center whitespace-nowrap"
          >
            <span
              className="mr-1.5 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {entry.value}
            </span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              ({((entry.payload.value / total) * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Compact Header */}
      <div className="px-2 py-1.5">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Gender Distribution
        </h4>
      </div>

      {/* Maximized Chart Area */}
      <div className="flex-1">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="rounded-lg border border-gray-100 bg-white/95 p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900/95"
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="gender"
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="80%"
                paddingAngle={2}
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="stroke-white stroke-2 dark:stroke-gray-900"
                  />
                ))}

                <Label
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox as { cx: number; cy: number };
                    return (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={cx}
                          y={cy}
                          dy="-0.5em"
                          fontSize="20"
                          fontWeight="bold"
                          className="fill-gray-900 dark:fill-gray-100"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={cx}
                          y={cy}
                          dy="1.5em"
                          fontSize="10"
                          className="fill-gray-500 dark:fill-gray-400"
                        >
                          Total Reach
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
              {/* Compact Legend */}
              <ChartLegend
                content={<CustomLegendContent />}
                verticalAlign="bottom"
                height={24}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default GenderPieChart;
