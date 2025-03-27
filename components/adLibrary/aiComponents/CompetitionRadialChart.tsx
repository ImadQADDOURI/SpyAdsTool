import React from "react";
import { Activity, Gauge, Info } from "lucide-react";
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompetitionRadialChartProps {
  competition: number;
  className?: string;
}

const CompetitionRadialChart: React.FC<CompetitionRadialChartProps> = ({
  competition,
  className,
}) => {
  const data = [
    {
      name: "Competition",
      value: competition,
      fill: getColorByValue(competition),
    },
  ];

  function getColorByValue(value: number): string {
    if (value <= 33) return "#4ade80";
    if (value <= 66) return "#fbbf24";
    return "#f87171";
  }

  // Competition level label
  function getCompetitionLabel(value: number): string {
    if (value <= 33) return "Low";
    if (value <= 66) return "Medium";
    return "High";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              // 📐 Intrinsic Web Design - fill available space
              "flex w-full cursor-default flex-col rounded-lg bg-gradient-to-br from-white to-gray-100/80 p-3 transition-all duration-200",
              "hover:shadow-md dark:from-gray-800/70 dark:to-gray-900/50 dark:hover:shadow-gray-900/20",
              "border border-transparent hover:border-gray-200 dark:hover:border-gray-700",
              className,
            )}
          >
            {/* Enhanced Header with Gradient Title and Interactive Icon */}
            <div className="flex flex-row items-center justify-between">
              <span className="text-md font-semibold text-gray-600 dark:text-gray-300">
                Competition
              </span>

              <Gauge
                className={cn(
                  "h-5 w-5 text-[#9C5FF5] transition-transform duration-300 ease-in-out group-hover:scale-110 dark:text-[#B977F8]",
                )}
              />
            </div>
            {/* Chart Container with responsive design */}
            <div className="w-full">
              <ChartContainer
                config={{
                  // Set up chart configuration here
                  tooltip: {},
                }}
                className="mx-auto aspect-square w-full"
              >
                <RadialBarChart
                  innerRadius="70%" // Use percentages instead of fixed pixels
                  outerRadius="100%" // Use percentages instead of fixed pixels
                  data={data}
                  startAngle={180}
                  endAngle={0}
                  barSize={12}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              className="fill-current"
                            >
                              {/* Primary value with gradient text */}
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 10}
                                className="text-xl font-bold text-gray-900 dark:text-gray-100 xl:text-2xl"
                              >
                                {competition}%
                              </tspan>
                              {/* Secondary label with branded color */}
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 12}
                                className="text-sm font-medium"
                                style={{ fill: data[0].fill }}
                              >
                                {getCompetitionLabel(competition)}
                              </tspan>
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={12}
                    fill={data[0].fill}
                    className="stroke-transparent"
                  />
                  {/* Optional tooltip can be added here */}
                  <ChartTooltip
                    cursor={false}
                    content={({ payload }) => {
                      if (payload && payload.length) {
                        return (
                          <div className="rounded-lg bg-white p-2 shadow-md dark:bg-gray-800">
                            <p className="font-medium">{`Competition: ${payload[0].value}%`}</p>
                            <p className="text-xs opacity-75">
                              {getCompetitionLabel(
                                Number(payload[0].value) || 0,
                              )}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadialBarChart>
              </ChartContainer>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="max-w-xs">
          <div className="space-y-1.5 p-1 text-sm">
            <div className="font-medium">Market Competition</div>
            <div className="text-xs">
              {competition <= 33 &&
                "Low competition - Good opportunity for market entry"}
              {competition > 33 &&
                competition <= 66 &&
                "Moderate competition - Balanced market presence"}
              {competition > 66 &&
                "High competition - Requires strong differentiation"}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompetitionRadialChart;
