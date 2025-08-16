import { comparePlans, plansColumns } from "@/configuration/pricing-config";
import { PlansRow } from "@/types";
import {
  BadgeDollarSign,
  CircleCheck,
  HandCoins,
  Info,
  ListCheck,
  ListChecks,
  TicketsIcon,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import TitleSection from "../adTool/sharedComponents/TitleSection";

export function ComparePlans() {
  const getColumnStyles = (col: string) => {
    switch (col.toLowerCase()) {
      case "starter":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800";
      case "pro":
        return "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 relative";
      default:
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
    }
  };

  const getHeaderTextColor = (col: string) => {
    switch (col.toLowerCase()) {
      case "starter":
        return "text-blue-700 dark:text-blue-300";
      case "pro":
        return "text-purple-700 dark:text-purple-300";
      default:
        return "text-green-700 dark:text-green-300";
    }
  };

  const renderCell = (value: string | boolean | null, col: string) => {
    if (value === null)
      return <span className="text-muted-foreground/60">—</span>;
    if (typeof value === "boolean") {
      const iconColor =
        col.toLowerCase() === "starter"
          ? "text-blue-500"
          : col.toLowerCase() === "pro"
            ? "text-purple-500"
            : "text-green-500";
      return value ? (
        <CircleCheck className={`mx-auto size-[22px] ${iconColor}`} />
      ) : (
        <span className="text-muted-foreground/60">—</span>
      );
    }
    return <span className="font-medium">{value}</span>;
  };

  return (
    <MaxWidthWrapper>
      <div className="flex flex-col items-center">
        <TitleSection
          icon={TicketsIcon}
          badgeText="Plans"
          image={ListChecks}
          imageColor="text-yellow-500 dark:text-yellow-300"
          highlightedText="Compare"
          remainingTitle="Our Plans"
          auroraColors={["#f97316", "#f59e0b", "#fbbf24", "#fde047"]}
          description="Find the perfect plan tailored for your business needs!"
        />

        <div className="my-10 w-full max-w-5xl overflow-x-scroll max-lg:mx-[-0.8rem] md:overflow-x-visible">
          <div className="relative">
            <table className="w-full table-fixed border-separate border-spacing-0 overflow-hidden rounded-xl shadow-lg">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 w-40 border-b-2 border-border bg-background/95 p-6 backdrop-blur-sm md:w-1/4"></th>
                  {plansColumns.map((col) => (
                    <th
                      key={col}
                      className={`sticky z-10 w-40 border-b-2 p-6 font-heading text-xl capitalize tracking-wide md:w-auto lg:text-2xl ${getColumnStyles(col)} ${getHeaderTextColor(col)} ${
                        col.toLowerCase() === "pro" ? "relative" : ""
                      }`}
                    >
                      {/* {col.toLowerCase() === "pro" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                          <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                            POPULAR
                          </span>
                        </div>
                      )} */}
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparePlans.map((row: PlansRow, index: number) => (
                  <tr
                    key={index}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="sticky left-0 border-b border-border bg-background/95 backdrop-blur-sm">
                      <div className="flex items-center justify-between space-x-2 p-4">
                        <span className="text-[15px] font-medium text-foreground lg:text-base">
                          {row.feature}
                        </span>
                        {row.tooltip && (
                          <Popover>
                            <PopoverTrigger className="rounded-full p-1 transition-colors hover:bg-muted">
                              <Info className="size-[18px] text-muted-foreground transition-colors hover:text-foreground" />
                            </PopoverTrigger>
                            <PopoverContent
                              side="top"
                              className="max-w-80 border-2 p-3 text-sm shadow-xl"
                            >
                              {row.tooltip}
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </td>
                    {plansColumns.map((col) => (
                      <td
                        key={col}
                        className={`border-b border-border p-4 text-center text-[15px] transition-colors lg:text-base ${getColumnStyles(col)} ${
                          col.toLowerCase() === "pro"
                            ? "border-l-2 border-r-2 border-purple-200 dark:border-purple-800"
                            : ""
                        }`}
                      >
                        {renderCell(row[col], col)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
