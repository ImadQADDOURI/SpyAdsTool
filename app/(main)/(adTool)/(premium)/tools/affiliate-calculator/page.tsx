"use client";

import { Suspense } from "react";
import {
  Calculator,
  FileText,
  HelpCircle,
  Info,
  LightbulbIcon,
  Pickaxe,
  PieChart,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AffiliateMarketingCalculator from "@/components/adLibrary/calculator/AffiliateMarketingCalculator";
import { Loading } from "@/components/adLibrary/microComponents/Loading";
import TitleSection from "@/components/adLibrary/TitleSection";

export default function AffiliateCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-800">
      <TitleSection
        icon={Calculator}
        badgeText="Calculator"
        image={Pickaxe}
        imageColor="text-purple-500 dark:text-purple-400"
        highlightedText="Affiliate Marketing"
        remainingTitle="Calculator"
        auroraColors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
        description=" Calculate affiliate campaign ROI, commission costs, and profit
                margins."
      />

      <div className="mx-auto px-4 py-6">
        {/* 🧮 Calculator Component */}
        <div className="mb-8">
          <Suspense
            fallback={<Loading message="Loading calculator..." size="large" />}
          >
            <AffiliateMarketingCalculator />
          </Suspense>
        </div>

        {/* 📊 Formulas & Methodology */}
        <div className="mx-auto mb-8 max-w-6xl">
          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="formulas">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-[#6566F1]" />
                    <span className="text-lg font-medium">
                      Formulas & Methodology
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <p>
                      Our calculator uses the following formulas to determine
                      your affiliate marketing performance:
                    </p>

                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Total Conversions:</span>{" "}
                        (Conversion Rate ÷ 100) × Total Clicks
                      </p>
                      <p>
                        <span className="font-medium">Total Revenue:</span>{" "}
                        Average Order Value × Total Conversions
                      </p>
                      <p>
                        <span className="font-medium">
                          Total Affiliate Commissions:
                        </span>{" "}
                        (Affiliate Commission Rate ÷ 100) × Total Revenue
                      </p>
                      <p>
                        <span className="font-medium">Total Refund Cost:</span>{" "}
                        (Refund Rate ÷ 100 × Total Conversions) × Refund Cost
                      </p>
                      <p>
                        <span className="font-medium">Net Revenue:</span> Total
                        Revenue - (Total Refund Cost + Total Affiliate
                        Commissions)
                      </p>
                      <p>
                        <span className="font-medium">Extra Charges:</span>{" "}
                        Calculated based on whether charges apply per order or
                        as a total
                      </p>
                      <p>
                        <span className="font-medium">Net Profit:</span> Net
                        Revenue - (Total Ad Spend + Total Extra Charges)
                      </p>
                      <p>
                        <span className="font-medium">ROI:</span> (Net Profit ÷
                        Total Ad Spend) × 100
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* 💡 Usage Guide & Tips */}
        <div className="mx-auto mb-8 max-w-6xl">
          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="guide">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <LightbulbIcon className="h-5 w-5 text-[#B977F8]" />
                    <span className="text-lg font-medium">
                      How To Use This Calculator
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Step-by-step Instructions:
                    </h3>
                    <ol className="list-decimal space-y-2 pl-5">
                      <li>Enter your total ad spend for the campaign</li>
                      <li>
                        Input the total number of clicks received on your
                        affiliate links
                      </li>
                      <li>
                        Use the slider to set your conversion rate percentage
                      </li>
                      <li>Enter your average order value</li>
                      <li>
                        Set your affiliate commission rate percentage using the
                        slider
                      </li>
                      <li>
                        If applicable, set your refund rate and cost per refund
                      </li>
                      <li>
                        Add any additional charges using the Add Extra Charge
                        button
                      </li>
                      <li>
                        Review your calculated metrics at the bottom of the
                        calculator
                      </li>
                    </ol>

                    <h3 className="mt-4 font-medium text-gray-800 dark:text-gray-200">
                      Pro Tips:
                    </h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>
                        Use data from your analytics platform for accurate click
                        and conversion numbers
                      </li>
                      <li>
                        Test different commission rate scenarios to find the
                        optimal balance
                      </li>
                      <li>
                        Pay attention to your Cost Per Acquisition (CPA) by
                        dividing your total spend by conversions
                      </li>
                      <li>
                        Compare ROI across different affiliate programs to
                        optimize your marketing budget
                      </li>
                      <li>
                        Use the extra charges feature to account for platform
                        fees, software costs, or any other recurring expenses
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* 🚀 Use Cases & Strategy */}
        <div className="mx-auto mb-8 max-w-6xl">
          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="use-cases">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-[#6566F1]" />
                    <span className="text-lg font-medium">
                      Use Cases & Strategy
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <p>
                      Our Advanced Affiliate Marketing Calculator can help you
                      in several key business scenarios:
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Campaign Analysis
                    </h3>
                    <p>
                      Compare the performance of different affiliate campaigns
                      by entering their respective metrics to identify which
                      offers the best ROI and should receive more investment.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Commission Structure Optimization
                    </h3>
                    <p>
                      Determine the optimal commission rate that balances
                      affiliate motivation with your profit margins. Test
                      different scenarios to find the sweet spot.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Affiliate Partner Evaluation
                    </h3>
                    <p>
                      Compare different affiliate partners by analyzing their
                      conversion rates and average order values to determine
                      which partnerships are most profitable.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Budget Allocation
                    </h3>
                    <p>
                      Use ROI data to decide where to allocate your marketing
                      budget across different affiliate programs and channels
                      for maximum return.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Scaling Planning
                    </h3>
                    <p>
                      Model how profitability would change as you scale your
                      affiliate program, helping you anticipate costs and plan
                      for growth.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* ❓ Common Questions */}
        <div className="mx-auto mb-8 max-w-6xl">
          <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq">
                <AccordionTrigger className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-[#B977F8]" />
                    <span className="text-lg font-medium">
                      Common Questions
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="divide-y dark:divide-gray-800">
                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        What&apos;s a good conversion rate for affiliate
                        marketing?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Conversion rates vary by industry, but generally, 1-5%
                        is considered average. Niche products with highly
                        targeted traffic can sometimes see rates of 5-15%.
                        Anything above 15% is exceptional and worth
                        investigating for optimization lessons.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        How should I determine the optimal commission rate?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Consider your profit margins, industry standards,
                        competitor rates, and the value affiliates bring. Start
                        with industry averages (typically 5-30%) and adjust
                        based on performance. Higher commission rates can
                        attract better affiliates but must be sustainable for
                        your business.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        Why is my ROI negative?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        A negative ROI could result from high ad spend, low
                        conversion rates, high commission rates, or excessive
                        refunds. Try optimizing your traffic quality, adjusting
                        commission structure, or improving your product offering
                        to reduce refunds.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        Should I include my time cost in the calculations?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Yes, especially when evaluating program sustainability.
                        Add your time as an extra charge based on hours spent
                        managing the program multiplied by your hourly rate.
                        This gives a more complete picture of true program
                        profitability.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        How can I improve my affiliate marketing ROI?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Focus on recruiting high-quality affiliates, optimizing
                        your landing pages, providing affiliates with effective
                        marketing materials, setting appropriate commission
                        structures, and regularly analyzing performance data to
                        identify improvement opportunities.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
