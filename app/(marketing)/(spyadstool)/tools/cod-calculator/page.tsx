"use client";

import { Suspense } from "react";
import {
  Banknote,
  FileText,
  HelpCircle,
  Info,
  LightbulbIcon,
  TrendingUp,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CODCalculator from "@/components/adLibrary/calculator/CODCalculator";
import FirefliesWrapper from "@/components/adLibrary/microComponents/FirefliesWrapper";
import { Loading } from "@/components/adLibrary/microComponents/Loading";

export default function CODCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-8 dark:bg-gray-800">
      {/* 🎨 Title Section with Fireflies */}
      <FirefliesWrapper intensity={"medium"}>
        <div className="group relative py-6">
          <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
            <h1 className="bg-gradient-to-r from-[#6566F1] to-[#B977F8] bg-clip-text px-4 text-4xl font-bold tracking-tight text-transparent transition-all duration-300 ease-in-out hover:scale-[1.01]">
              Cash on Delivery Calculator
            </h1>
            <div className="relative">
              <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-[#6566F1]/40 to-[#B977F8]/40 transition-all duration-300 ease-in-out group-hover:w-24" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/20 to-[#B977F8]/20 blur-sm" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#6566F1]/10 via-transparent to-[#B977F8]/10" />
        </div>
      </FirefliesWrapper>

      {/* 📝 Description Section */}
      <div className="mx-auto px-4 py-6">
        <div className="mx-auto mb-8 max-w-6xl rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <div className="flex items-start space-x-3">
            <Banknote className="mt-1 h-5 w-5 text-[#6566F1]" />
            <div>
              <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                COD Business Analysis Tool
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This enhanced calculator provides e-commerce professionals with
                a comprehensive analysis of their Cash on Delivery operations.
                Track your costs, deliveries, confirmation rates, and
                profitability with this specialized tool designed for COD
                business models.
              </p>
            </div>
          </div>
        </div>

        {/* 🧮 Calculator Component */}
        <div className="mx-auto mb-8">
          <Suspense
            fallback={<Loading message="Loading calculator..." size="large" />}
          >
            <CODCalculator />
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
                      Our COD calculator uses the following formulas to
                      determine your profitability:
                    </p>

                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Delivered Orders:</span>{" "}
                        (Quantity × Order Confirmation Rate ÷ 100) × (Delivery
                        Success Rate ÷ 100)
                      </p>
                      <p>
                        <span className="font-medium">
                          Total Shipping Costs:
                        </span>{" "}
                        (Average Shipping Cost % × Product Selling Price) ×
                        Delivered Orders
                      </p>
                      <p>
                        <span className="font-medium">
                          Total Fulfillment Costs:
                        </span>{" "}
                        (Average Fulfillment Cost % × Product Selling Price) ×
                        Delivered Orders
                      </p>
                      <p>
                        <span className="font-medium">Total COD Fees:</span>{" "}
                        (Average COD Fee % × Product Selling Price) × Delivered
                        Orders
                      </p>
                      <p>
                        <span className="font-medium">Total Revenue:</span>{" "}
                        Product Selling Price × Delivered Orders
                      </p>
                      <p>
                        <span className="font-medium">Total Refund Cost:</span>{" "}
                        (Quantity - Delivered Orders) × Product Refund Cost
                      </p>
                      <p>
                        <span className="font-medium">Total Spending:</span>{" "}
                        (Product Cost Price × Quantity) + Advertising Costs +
                        Total Shipping Costs + Total Fulfillment Costs + Total
                        COD Fees + Sum of Extra Charges
                      </p>
                      <p>
                        <span className="font-medium">Net Profit:</span> Total
                        Revenue - (Total Spending + Total Refund Cost)
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
                      <li>
                        Enter the quantity of products sold through your COD
                        channel
                      </li>
                      <li>Input your product cost price and selling price</li>
                      <li>Add your total advertising costs</li>
                      <li>
                        Use the sliders to set your shipping, fulfillment, and
                        COD fee percentages
                      </li>
                      <li>
                        Adjust your order confirmation and delivery success
                        rates based on historical data
                      </li>
                      <li>If applicable, enter your product refund cost</li>
                      <li>
                        Add any additional charges using the "Add Extra Charge"
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
                        Regularly update your confirmation and delivery success
                        rates to keep calculations accurate
                      </li>
                      <li>
                        COD fees often vary by region—consider creating separate
                        calculations for different markets
                      </li>
                      <li>
                        Pay special attention to the gap between ordered and
                        delivered products to identify optimization
                        opportunities
                      </li>
                      <li>
                        Use the extra charges feature to account for return
                        shipping, restocking fees, or any other COD-specific
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
                    <TrendingUp className="h-5 w-5 text-[#6566F1]" />
                    <span className="text-lg font-medium">
                      Use Cases & Strategy
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0">
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <p>
                      Our Cash on Delivery Calculator can help you optimize your
                      COD business in several key ways:
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Market Analysis
                    </h3>
                    <p>
                      Compare COD performance across different regions or
                      countries by creating separate calculations for each
                      market, helping you identify where your COD strategy works
                      best.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Risk Assessment
                    </h3>
                    <p>
                      Calculate the financial impact of non-delivery and order
                      cancellations to better manage your risk exposure and
                      adjust your pricing strategy accordingly.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Fulfillment Optimization
                    </h3>
                    <p>
                      Analyze how different fulfillment partners affect your
                      delivery success rates and overall profitability to select
                      the most cost-effective option.
                    </p>

                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      COD vs. Prepaid Comparison
                    </h3>
                    <p>
                      Compare the profitability of COD versus prepaid payment
                      methods for your business by running parallel calculations
                      to determine the most profitable approach.
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
                        What is a good order confirmation rate?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Order confirmation rates vary by industry and market,
                        but a healthy COD operation typically aims for
                        confirmation rates above 75%. Rates below 60% often
                        indicate issues with your product appeal, pricing, or
                        lead qualification process.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        How can I improve my delivery success rate?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Focus on better address verification, partner with
                        reliable logistics providers, implement pre-delivery
                        confirmation calls, offer delivery time slots, and
                        ensure your packaging clearly displays the COD amount to
                        avoid customer confusion.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        Are COD fees typically percentages or flat fees?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This varies by carrier and region. Many carriers charge
                        a percentage of the order value (typically 1-5%), while
                        others charge a flat fee per transaction. Some use a
                        hybrid model with a minimum fee plus a percentage. Our
                        calculator handles both approaches through the
                        percentage slider and extra charges feature.
                      </p>
                    </div>

                    <div className="py-3">
                      <h3 className="mb-1 font-medium text-gray-800 dark:text-gray-200">
                        Is COD still viable in markets with growing digital
                        payments?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Yes, but it depends on the market. COD remains strong in
                        regions with low banking penetration or limited trust in
                        online payments. Use this calculator to compare the ROI
                        between your COD and digital payment channels to make
                        data-driven decisions about your payment strategy in
                        each market.
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
