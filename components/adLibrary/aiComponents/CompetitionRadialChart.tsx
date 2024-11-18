import React from "react";
import { Info } from "lucide-react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompetitionRadialChartProps {
  competition: number;
}

const CompetitionRadialChart: React.FC<CompetitionRadialChartProps> = ({
  competition,
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex min-w-[160px] max-w-[160px] cursor-default flex-col rounded-lg bg-gray-100/50 p-2 dark:bg-gray-800/50">
            {/* Header with title and info icon */}
            <div className="flex flex-row items-center justify-between gap-1 px-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Competition Level
              </span>
              <Info className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
            </div>

            {/* Chart Container */}
            <div className="relative flex h-[110px] w-full flex-col items-center justify-center">
              <RadialBarChart
                width={200}
                height={110}
                cx={100}
                cy={90}
                innerRadius={60}
                outerRadius={80}
                barSize={10}
                data={data}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  fill={data[0].fill}
                  className="stroke-transparent"
                />
              </RadialBarChart>

              {/* Centered Value */}
              <div className="absolute bottom-2 flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {competition}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Competition
                </span>
              </div>
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
