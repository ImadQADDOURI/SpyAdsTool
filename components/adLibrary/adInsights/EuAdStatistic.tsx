// components/adsLibrary/EuAdStatistic.tsx
import React from "react";
import dynamic from "next/dynamic";
import {
  Baby,
  ChartPie,
  Earth,
  Euro,
  Info,
  Loader2,
  Megaphone,
  OctagonAlert,
  VenusAndMars,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import InsightItem from "../aiComponents/InsightItem";
import { Loading } from "../microComponents/Loading";
import { countryCodesAlpha2Flag } from "../searchFilters/filter-config";
import AmountSpend from "./AmountSpend";

const GenderPieChart = dynamic(
  () => import("@/components/adLibrary/adInsights/GenderPieChart"),
  { ssr: false },
);

const CountryBarChart = dynamic(
  () => import("@/components/adLibrary/adInsights/CountryBarChart"),
  { ssr: false },
);

const AgeBarChart = dynamic(
  () => import("@/components/adLibrary/adInsights/AgeBarChart"),
  { ssr: false },
);

interface EuAdStatisticProps {
  data: any;
  isLoading: boolean;
  error: string | null;
  cpmEurope?: number; // Make it optional with a question mark
}

export const EuAdStatistic: React.FC<EuAdStatisticProps> = ({
  data,
  isLoading,
  error,
  cpmEurope = 0, // Provide default value of 0
}) => {
  if (isLoading) {
    return <Loading message="Loading EU Statistics..." size="small" />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <OctagonAlert className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          No European Union Statistics available.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          this ad is not targeted to the European Union.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-lg bg-red-100/80 p-3 text-red-700 dark:bg-red-900/80 dark:text-red-300"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
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
      <div className="grid grid-cols-3 gap-1 p-2">
        <InsightItem
          label="Gender"
          value={gender_audience || "Not specified"}
          description=""
          icon={VenusAndMars}
        />
        <InsightItem
          label="Age"
          value={
            age_audience
              ? `${age_audience.min}-${age_audience.max}`
              : "Not specified"
          }
          description=""
          icon={Baby}
        />
        <InsightItem
          label="Reach"
          value={eu_total_reach.toLocaleString()}
          description=""
          icon={ChartPie}
        />
        {/* <InsightItem
          label="Spend"
          value={
            cpmEurope
              ? `${((cpmEurope * eu_total_reach) / 1000).toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  },
                )} €`
              : "Not specified"
          }
          description=""
          icon={Euro}
        /> */}
      </div>
      <AmountSpend cpm={cpmEurope} totalReach={eu_total_reach} />

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
