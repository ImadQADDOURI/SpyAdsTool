import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AgeRangeData {
  ageRange: string;
  total: number;
  male: number;
  female: number;
  unknown: number;
}

interface AgeBarChartProps {
  data: AgeRangeData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface LegendProps {
  payload?: any[];
}

export const AgeBarChart: React.FC<AgeBarChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => {
    const ageA = parseInt(a.ageRange.split("-")[0]);
    const ageB = parseInt(b.ageRange.split("-")[0]);
    return ageA - ageB;
  });

  // Enhanced color scheme with opacity variants
  const chartConfig = {
    male: {
      label: "Male",
      color: "#6366F1",
      hoverColor: "#4F46E5",
    },
    female: {
      label: "Female",
      color: "#EC4899",
      hoverColor: "#DB2777",
    },
    unknown: {
      label: "Unknown",
      color: "#A855F7",
      hoverColor: "#9333EA",
    },
  };

  const CustomTooltipContent: React.FC<TooltipProps> = ({
    active,
    payload,
  }) => {
    if (!active || !payload?.length) return null;

    const total = payload[0]?.payload.total || 0;

    return (
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white/95 shadow-lg dark:border-gray-800 dark:bg-gray-900/95">
        {/* Tooltip Header */}
        <div className="border-b border-gray-100 bg-gray-50/50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-800/50">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {payload[0].payload.ageRange}
          </span>
        </div>

        {/* Tooltip Content */}
        <div className="space-y-1 p-2">
          {payload.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-medium tabular-nums text-gray-900 dark:text-gray-100">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}

          {/* Total Section */}
          <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Total
              </span>
              <span className="text-xs font-medium tabular-nums text-gray-900 dark:text-gray-100">
                {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
    if (!payload) return null;

    return (
      <ul className="flex flex-wrap items-center justify-center gap-3 px-2 pb-1 pt-2 text-xs">
        {payload.map((entry, index) => (
          <li
            key={index}
            className="flex items-center gap-1.5 rounded-full bg-gray-50/50 px-2 py-0.5 dark:bg-gray-800/50"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1.5">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
          Age Distribution
        </h4>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          Stacked View
        </span>
      </div>

      {/* Chart Container */}
      <div className="flex-1 px-1">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={0}
              barCategoryGap={8}
            >
              <XAxis
                dataKey="ageRange"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
                tick={{ fill: "#6B7280" }}
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280" }}
                width={35}
              />
              <Tooltip
                cursor={{
                  fill: "currentColor",
                  className: "text-gray-500/10 dark:text-gray-300/10",
                }}
                content={<CustomTooltipContent />}
                wrapperStyle={{ outline: "none" }}
              />
              <Legend
                content={<CustomLegend />}
                verticalAlign="bottom"
                height={32}
              />
              {/* Bars */}
              {Object.entries(chartConfig).map(([key, config]) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={config.color}
                  radius={[4, 4, 0, 0]}
                  className="transition-colors duration-200"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AgeBarChart;
