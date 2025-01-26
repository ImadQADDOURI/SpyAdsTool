// components/adsLibrary/EuAdStatistic.tsx
import React from "react";
import { countryCodesAlpha2Flag } from "@/utils/countryCodesAlpha2Flag";
import { Info, Loader2 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AgeBarChart from "@/components/adLibrary/adInsights/AgeBarChart";
import CountryBarChart from "@/components/adLibrary/adInsights/CountryBarChart";
import GenderPieChart from "@/components/adLibrary/adInsights/GenderPieChart";

import { Loading } from "../microComponents/Loading";

interface EuAdStatisticProps {
  data: any;
  isLoading: boolean;
  error: string | null;
}

export const EuAdStatistic: React.FC<EuAdStatisticProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <Loading message="Loading Statistics..." size="small" />;
  }

  // if (error) {
  //   return (
  //     <div
  //       className="rounded-lg bg-red-100/80 p-3 text-red-700 dark:bg-red-900/80 dark:text-red-300"
  //       role="alert"
  //     >
  //       <p className="font-bold">Error</p>
  //       <p>{error}</p>
  //     </div>
  //   );
  // }

  if (!data) {
    return (
      <div className="rounded-lg bg-gray-100/50 p-3 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
        No Statistics available.
      </div>
    );
  }
  const {
    gender_audience,
    age_audience,
    eu_total_reach,
    age_country_gender_reach_breakdown,
  } = data;

  // Initialize totals
  let totalMale = 0;
  let totalFemale = 0;
  let totalUnknown = 0;
  const countryTotals: Record<
    string,
    { total: number; male: number; female: number; unknown: number }
  > = {};
  const ageRangeTotals: Record<
    string,
    { total: number; male: number; female: number; unknown: number }
  > = {};

  // Calculate totals
  age_country_gender_reach_breakdown.forEach((country) => {
    country.age_gender_breakdowns.forEach((breakdown) => {
      const male = breakdown.male || 0;
      const female = breakdown.female || 0;
      const unknown = breakdown.unknown || 0;

      // Update global totals
      totalMale += male;
      totalFemale += female;
      totalUnknown += unknown;

      // Update country-specific totals
      if (!countryTotals[country.country]) {
        countryTotals[country.country] = {
          total: 0,
          male: 0,
          female: 0,
          unknown: 0,
        };
      }
      countryTotals[country.country].male += male;
      countryTotals[country.country].female += female;
      countryTotals[country.country].unknown += unknown;
      countryTotals[country.country].total += male + female + unknown;

      // Update age range totals
      if (!ageRangeTotals[breakdown.age_range]) {
        ageRangeTotals[breakdown.age_range] = {
          total: 0,
          male: 0,
          female: 0,
          unknown: 0,
        };
      }
      ageRangeTotals[breakdown.age_range].male += male;
      ageRangeTotals[breakdown.age_range].female += female;
      ageRangeTotals[breakdown.age_range].unknown += unknown;
      ageRangeTotals[breakdown.age_range].total += male + female + unknown;
    });
  });

  // Sort age ranges
  const sortedAgeRanges = Object.entries(ageRangeTotals).sort((a, b) => {
    const ageA = parseInt(a[0].split("-")[0]);
    const ageB = parseInt(b[0].split("-")[0]);
    return ageA - ageB;
  });

  // Sort countries by total audience size
  const sortedCountries = Object.entries(countryTotals).sort(
    (a, b) => b[1].total - a[1].total,
  );

  // Prepare data for AgeBarChart
  const ageBarChartData = sortedAgeRanges.map(([ageRange, totals]) => ({
    ageRange,
    total: totals.total,
    male: totals.male,
    female: totals.female,
    unknown: totals.unknown,
  }));

  // Prepare data for CountryBarChart
  const countryBarChartData = sortedCountries.map(([countryCode, totals]) => ({
    countryCode,
    countryLabel:
      countryCodesAlpha2Flag.find((c) => c.value === countryCode)?.label ||
      countryCode,
    total: totals.total,
    male: totals.male,
    female: totals.female,
    unknown: totals.unknown,
  }));

  return (
    <div className="rounded-lg bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-2 dark:border-gray-700">
        <h3 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text text-lg font-semibold text-transparent">
          European Union Statistics
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="max-w-xs p-2">
              <p className="text-xs">
                Detailed audience insights and regional distribution
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 p-2">
        <StatCard
          title="Gender Audience"
          value={gender_audience || "Not specified"}
        />
        <StatCard
          title="Age Audience"
          value={
            age_audience
              ? `${age_audience.min}-${age_audience.max}`
              : "Not specified"
          }
        />
        <StatCard
          title="EU Total Reach"
          value={eu_total_reach.toLocaleString()}
        />
      </div>

      {/* Charts Section */}
      <div className="space-y-2 p-2">
        <div className="overflow-hidden rounded-md border border-gray-100/50 bg-gray-50/50 dark:border-gray-700/50 dark:bg-gray-700/50">
          <GenderPieChart
            men={totalMale}
            women={totalFemale}
            unknown={totalUnknown}
          />
        </div>

        <div className="overflow-hidden rounded-md border border-gray-100/50 bg-gray-50/50 dark:border-gray-700/50 dark:bg-gray-700/50">
          <AgeBarChart data={ageBarChartData} />
        </div>

        <div className="overflow-hidden rounded-md border border-gray-100/50 bg-gray-50/50 dark:border-gray-700/50 dark:bg-gray-700/50">
          <CountryBarChart data={countryBarChartData} />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <div className="rounded-md bg-gray-50/50 p-2 dark:bg-gray-700/50">
    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
      {title}
    </p>
    <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
      {value}
    </p>
  </div>
);
