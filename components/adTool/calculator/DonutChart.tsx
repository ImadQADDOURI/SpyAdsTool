"use client";

import type React from "react";
import type { LucideIcon } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export type ChartDataItem = {
  name: string;
  value: number;
  color: string;
  icon: LucideIcon;
};

type DonutChartProps = {
  data: ChartDataItem[];
};

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const filteredData = data.filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {payload[0].name}
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: payload[0].payload.color }}
          >
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 pt-4">
        {payload.map((entry: any, index: number) => {
          const IconComponent = filteredData[index]?.icon;
          return (
            <div
              key={`legend-${index}`}
              className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {IconComponent && (
                <IconComponent size={14} style={{ color: entry.color }} />
              )}
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {entry.value}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: entry.color }}
              >
                ${filteredData[index]?.value.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (filteredData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter values to see the breakdown
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          labelLine={false}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          fill="#8884d8"
          dataKey="value"
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
