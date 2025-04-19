"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  Calculator as CalcIcon,
  Calculator,
  CircleDollarSign,
  FileText,
  HelpCircle,
  Info,
  LightbulbIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AffiliateMarketingCalculator from "@/components/adLibrary/calculator/AffiliateMarketingCalculator";
import DropshippingCalculator from "@/components/adLibrary/calculator/DropshippingCalculator";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-800">
      {/* 🎨 Title Section with Fireflies */}
      <FirefliesWrapper intensity="high">
        {/* Premium Header Section */}
        <div className="group relative overflow-hidden py-4">
          {/* <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 dark:opacity-[0.03]" /> */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#6566F1]/5 via-transparent to-[#B977F8]/5" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-[#B977F8]" />
                <span className="rounded-full bg-[#B977F8]/10 px-4 py-1 text-sm font-medium text-[#B977F8]">
                  Calculator
                </span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-r from-[#6566F1] via-[#B977F8] to-[#E9A8F2] bg-clip-text text-transparent">
                  Dropshipping
                </span>{" "}
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-transparent dark:from-gray-300 dark:via-gray-100 dark:to-white">
                  Calculator
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                Track costs, revenue, and ROI for your dropshipping business.
                Make data-driven decisions to optimize profits and scale your
                operations.
              </p>
              <div className="relative pt-4">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-500 ease-in-out group-hover:w-32 group-hover:from-[#6566F1]/60 group-hover:to-[#B977F8]/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-lg" />
              </div>
            </motion.div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-900" />
        </div>
      </FirefliesWrapper>

      {/* 📝 Description Section */}
      <div className="mx-auto px-4 py-6">
        {/* 🧮 Calculator Component */}
        <div className="mb-8">
          <Suspense
            fallback={<Loading message="Loading calculator..." size="large" />}
          >
            <DropshippingCalculator />
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
                      your profitability:
                    </p>

                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Total COGS:</span> Product
                        Cost Price × Quantity
                      </p>
                      <p>
                        <span className="font-medium">
                          Total Shipping Costs:
                        </span>{" "}
                        (Average Shipping Cost % × Product Selling Price) ×
                        Quantity
                      </p>
                      <p>
                        <span className="font-medium">
                          Total Transaction Fees:
                        </span>{" "}
                        (Average Transaction Fee % × Product Selling Price) ×
                        Quantity
                      </p>
                      <p>
                        <span className="font-medium">Total Revenue:</span>{" "}
                        Product Selling Price × Quantity
                      </p>
                      <p>
                        <span className="font-medium">Total Returns Cost:</span>{" "}
                        (Average Returns Rate % × Quantity) × Return Cost
                      </p>
                      <p>
                        <span className="font-medium">Total Spending:</span>{" "}
                        Total COGS + Total Shipping Costs + Total Transaction
                        Fees + Total Returns Cost + Sum of Extra Charges
                      </p>
                      <p>
                        <span className="font-medium">Net Profit:</span> Total
                        Revenue - Total Spending
                      </p>
                      <p>
                        <span className="font-medium">ROI:</span> (Net Profit ÷
                        Total Spending) × 100
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
                      <li>Enter the quantity of products sold</li>
                      <li>Input your product cost price and selling price</li>
                      <li>Add your total advertising costs</li>
                      <li>
                        Use the sliders to set your shipping costs, transaction
                        fees, and returns rate percentages
                      </li>
                      <li>If applicable, enter your return cost per unit</li>
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
                        Use real data wherever possible for the most accurate
                        results
                      </li>
                      <li>
                        Try different pricing scenarios to find your optimal
                        profit margin
                      </li>
                      <li>
                        Pay special attention to your ROI percentage—aim for at
                        least 30% for a sustainable business
                      </li>
                      <li>
                        Use the extra charges feature to account for platform
                        fees, subscription costs, or any other recurring
                        expenses
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
                    <CircleDollarSign className="h-5 w-5 text-[#6566F1]" />
                    <span className="text-lg font-medium">
                      Use Cases & Strategy
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <p>
                      Our Advanced Dropshipping Calculator can help you in
                      several key business scenarios:
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Product Analysis
                    </h3>
                    <p>
                      Compare the potential profitability of different products
                      by entering their respective costs and selling prices to
                      identify which items offer the best ROI.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Ad Spend Optimization
                    </h3>
                    <p>
                      Determine how much you can afford to spend on advertising
                      while maintaining your desired profit margin. Adjust your
                      ad costs and see how it affects your bottom line.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Pricing Strategy
                    </h3>
                    <p>
                      Experiment with different selling prices to find the sweet
                      spot that maximizes your profit while remaining
                      competitive in the market.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Supplier Evaluation
                    </h3>
                    <p>
                      Compare suppliers by inputting their different product and
                      shipping costs to see which partnership would be most
                      profitable for your business.
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
                        Why is my ROI negative?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        A negative ROI indicates that you&apos;re spending more
                        than you&apos;re earning. Review your costs, especially
                        advertising expenses, and consider increasing your
                        selling price or finding a supplier with lower product
                        costs.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        How can I improve my profit margin?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Focus on reducing costs (finding better suppliers or
                        more efficient shipping), optimizing ad spend (improving
                        targeting), increasing your average order value, or
                        adjusting your pricing strategy.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        What&apos;s a good return rate percentage?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Return rates vary by industry, but generally, aim to
                        keep your return rate below 10%. For some products like
                        clothing, rates up to 20% might be normal. Higher return
                        rates significantly impact profitability.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        Should I include my time cost in the calculations?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Yes, you can add your time as an extra charge. Estimate
                        how many hours you spend per order or in total, multiply
                        by your hourly rate, and add it as a flat fee or
                        percentage depending on how you value your time.
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
