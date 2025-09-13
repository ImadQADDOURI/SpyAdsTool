import React from "react";
import dynamic from "next/dynamic";
import { AdAnalysis } from "@/actions/geminiAiService";
import {
  Baby,
  Info,
  Megaphone,
  OctagonAlert,
  Snowflake,
  Tags,
  UserRound,
  VenusAndMars,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Loading } from "../sharedComponents/Loading";
import BudgetIndicator from "./BudgetIndicator";
import CPMDisplay from "./CPMDisplay";
import InsightItem from "./InsightItem";

const CompetitionRadialChart = dynamic(
  () => import("./CompetitionRadialChart"),
  { ssr: false },
);

interface WorldwideAdStatisticsProps {
  data: AdAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

const WorldwideAdStatistics: React.FC<WorldwideAdStatisticsProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <Loading message="Loading Worldwide Statistics..." size="small" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-100/50 p-3 text-red-700 dark:bg-red-900/50 dark:text-red-300">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <OctagonAlert className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          No Worldwide Statistics available.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          this ad is not targeted worldwide.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2 rounded-lg bg-white px-2 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 py-2 dark:border-gray-700">
        <h3 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-lg font-semibold text-transparent">
          Worldwide Statistics
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="max-w-xs p-2">
              <p className="text-xs">
                Detailed audience insights and Statistics
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Insights Grid Container */}
      <div className="grid grid-cols-3 gap-2 md:grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_1.5fr]">
        {/* First 3 → row on small, normal cols on md+ */}
        <InsightItem
          label="Gender"
          value={data.genderTarget}
          description="Target audience gender distribution"
          icon={VenusAndMars}
          className="col-span-1 md:col-span-1"
        />
        <InsightItem
          label="Age"
          value={data.ageTarget}
          description="Primary age groups for targeting"
          icon={Baby}
          className="col-span-1 md:col-span-1"
        />
        <InsightItem
          label="Season"
          value={data.seasonTarget}
          description="Optimal seasonal timing"
          icon={Snowflake}
          className="col-span-1 md:col-span-1"
        />

        {/* These stack on small screens (col-span-3), grid-based on md+ */}
        <div className="col-span-3 shadow-lg md:col-span-1">
          <InsightItem
            label="Target"
            value={data.targetAudience}
            description="Target audience characteristics and preferences"
            icon={UserRound}
          />
        </div>
        <div className="col-span-3 shadow-lg md:col-span-1">
          <InsightItem
            label="Category"
            value={data.adCategories}
            description="Primary advertising categories"
            icon={Tags}
          />
        </div>
        <div className="col-span-3 shadow-lg md:col-span-1">
          <InsightItem
            label="Marketing"
            value={data.marketingStrategies}
            description="Recommended marketing approaches"
            icon={Megaphone}
          />
        </div>

        {/* Performance row → 3 items split equally on md+, stacked on small */}
        <div className="col-span-3 shadow-lg md:col-span-2">
          <CompetitionRadialChart competition={data.competition} />
        </div>
        <div className="col-span-3 shadow-lg md:col-span-2">
          <CPMDisplay value={data.cpm} />
        </div>
        <div className="col-span-3 shadow-lg md:col-span-2">
          <BudgetIndicator budget={data.estimatedBudget} />
        </div>
      </div>
    </div>
  );
};

export default WorldwideAdStatistics;
