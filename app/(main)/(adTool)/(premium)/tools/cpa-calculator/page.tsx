"use client";

import { Suspense } from "react";
import {
  Calculator,
  FileText,
  HelpCircle,
  Info,
  LightbulbIcon,
  Pickaxe,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CPACalculator from "@/components/adTool/calculator/CPACalculator";
import { Loading } from "@/components/adTool/microComponents/Loading";
import TitleSection from "@/components/adTool/TitleSection";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-800">
      <TitleSection
        icon={Calculator}
        badgeText="Calculator"
        image={Pickaxe}
        imageColor="text-purple-500 dark:text-purple-400"
        highlightedText="CPA"
        remainingTitle="Calculator"
        auroraColors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
        description="Optimize your cost per action, track campaign ROI, and maximize ad profit."
      />

      <div className="mx-auto px-4 py-6">
        {/* 🧮 Calculator Component */}
        <div className="mb-8">
          <Suspense
            fallback={<Loading message="Loading calculator..." size="large" />}
          >
            <CPACalculator />
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
                      your CPA campaign performance:
                    </p>

                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Total Conversions:</span>{" "}
                        (Conversion Rate / 100) × Total Clicks
                      </p>
                      <p>
                        <span className="font-medium">Total Revenue:</span>{" "}
                        Average Order Value × Total Conversions
                      </p>
                      <p>
                        <span className="font-medium">Total Refund Cost:</span>{" "}
                        (Refund Rate / 100 × Total Conversions) × Refund Cost
                      </p>
                      <p>
                        <span className="font-medium">Net Revenue:</span> Total
                        Revenue - Total Refund Cost
                      </p>
                      <p>
                        <span className="font-medium">
                          CPA (Cost Per Action):
                        </span>{" "}
                        Total Ad Spend / Total Conversions
                      </p>
                      <p>
                        <span className="font-medium">
                          Total Extra Charges:
                        </span>{" "}
                        Sum of all extra charges (applied per order or as total)
                      </p>
                      <p>
                        <span className="font-medium">Net Profit:</span> Net
                        Revenue - (Total Ad Spend + Total Extra Charges)
                      </p>
                      <p>
                        <span className="font-medium">ROI:</span> (Net Profit /
                        Total Ad Spend) × 100
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* 💡 How To Use Section */}
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
                      <li>Input the total number of clicks received</li>
                      <li>
                        Use the slider to set your conversion rate percentage
                      </li>
                      <li>Enter your average order value</li>
                      <li>
                        If applicable, input your refund cost per unit and
                        refund rate percentage
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
                        Use data from your ad platform analytics for the most
                        accurate results
                      </li>
                      <li>
                        Compare CPA across different campaigns to identify your
                        best performers
                      </li>
                      <li>
                        A healthy ROI for most e-commerce businesses is above
                        200%
                      </li>
                      <li>
                        Use the extra charges feature to account for affiliate
                        commissions, platform fees, or other marketing-related
                        costs
                      </li>
                      <li>
                        Run calculations both with and without refunds to
                        understand their impact on your profitability
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
                      Our Advanced CPA Calculator can help you optimize your
                      marketing strategies in several key ways:
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Campaign Comparison
                    </h3>
                    <p>
                      Compare CPA metrics across different campaigns, platforms,
                      or ad groups to identify which are delivering the best
                      return on investment.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Budget Allocation
                    </h3>
                    <p>
                      Use CPA insights to determine where to allocate your
                      marketing budget for maximum impact. Reduce spending on
                      high-CPA channels and increase investment in low-CPA ones.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Conversion Rate Optimization
                    </h3>
                    <p>
                      Simulate improvements in your conversion rate to
                      understand how website or landing page optimizations could
                      impact your bottom line.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Scaling Assessment
                    </h3>
                    <p>
                      Determine if your current CPA allows for profitable
                      scaling of your ad campaigns, and identify the maximum ad
                      spend you can afford while maintaining profitability.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Refund Mitigation
                    </h3>
                    <p>
                      Analyze how different refund rates affect your overall
                      profitability and set targets for reducing returns through
                      improved product quality or customer service.
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
                        What&apos;s a good CPA for my business?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        A good CPA varies by industry and product price point.
                        As a general rule, your CPA should be less than 1/3 of
                        your average order value to maintain profitability. For
                        high-ticket items, you can afford a higher CPA.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        How can I lower my CPA?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Focus on improving your conversion rate through better
                        targeting, stronger ad creative, optimized landing
                        pages, and improved checkout processes. Additionally,
                        refine your audience targeting to focus on users most
                        likely to convert.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        Should I include my customer service costs?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Yes, if customer service is a significant expense
                        related to your conversions, add it as an extra charge.
                        You can calculate the average customer service cost per
                        order and add it as a flat fee per order.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        How do I account for lifetime value (LTV)?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This calculator focuses on first-purchase profitability.
                        For businesses with strong repeat purchase behavior, you
                        can manually adjust your acceptable CPA based on your
                        customer lifetime value. Generally, you can afford a
                        higher CPA if your customers make multiple purchases.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        Why is my ROI negative?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        A negative ROI means you&apos;re spending more on
                        acquiring customers than you&apos;re earning from their
                        purchases. Either your CPA is too high, your average
                        order value is too low, or your refund rate is too high.
                        Adjust these factors to reach a positive ROI.
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
