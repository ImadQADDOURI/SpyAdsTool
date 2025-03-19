"use client";

import React from "react";
import { BarChart, CreditCard, TrendingUp, Wallet } from "lucide-react";
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { cn } from "@/lib/utils";

type CODPieChartProps = {
  totalRevenue: number;
  netProfit: number;
  totalSpending: number;
  totalRefundCost: number;
};

const CODPieChart: React.FC<CODPieChartProps> = ({
  totalRevenue,
  netProfit,
  totalSpending,
  totalRefundCost,
}) => {
  // Modern color palette matching the app's theme
  const colors = {
    profit: "#10B981",
    spending: "#A855F7",
    refund: "#F87171",
  };

  const chartData = [
    {
      name: "Net Profit",
      value: netProfit > 0 ? netProfit : 0,
      color: colors.profit,
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      name: "Total Spending",
      value: totalSpending,
      color: colors.spending,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      name: "Total Refund Cost",
      value: totalRefundCost,
      color: colors.refund,
      icon: <CreditCard className="h-4 w-4" />,
    },
  ];

  // Enhanced Tooltip with modern styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="rounded-xl border border-gray-200/50 bg-white/95 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 dark:border-gray-800/50 dark:bg-gray-900/95">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {data.name}
            </p>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            ${data.value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Enhanced Legend with modern styling
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className="group flex items-center gap-3 rounded-full border border-gray-200/50 bg-white/50 px-4 py-2 transition-all duration-300 hover:border-[#6566F1]/20 hover:bg-white/80 dark:border-gray-800/50 dark:bg-gray-900/50 dark:hover:bg-gray-900/80"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {entry.value}
              </span>
            </div>
            <span className="font-mono text-sm text-gray-900 dark:text-white">
              ${entry.payload.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {/* Chart container with fixed height */}
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={4}
              dataKey="value"
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-300 hover:opacity-80"
                  strokeWidth={0}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                          style={{ fill: "url(#gradient)" }}
                        >
                          ${totalRevenue.toFixed(2)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm font-medium"
                        >
                          Total Revenue
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              animationDuration={200}
            />
            {/* Define gradient for text */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6566F1" />
                <stop offset="100%" stopColor="#B977F8" />
              </linearGradient>
            </defs>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend container with its own space */}
      <div className="mt-4 w-full">
        <CustomLegend
          payload={chartData.map((item) => ({
            value: item.name,
            color: item.color,
            payload: item,
          }))}
        />
      </div>
    </div>
  );
};

export default CODPieChart;
