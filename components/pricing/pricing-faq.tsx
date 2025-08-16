import { pricingFaqData } from "@/configuration/pricing-config";
import { HelpCircle, Mail, MessageCircleQuestion, Send } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import TitleSection from "../adTool/sharedComponents/TitleSection";

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <div className="flex flex-col items-center">
        <TitleSection
          icon={Send}
          badgeText="FAQ"
          image={HelpCircle}
          imageColor="text-green-500 dark:text-green-400"
          highlightedText="Frequently"
          remainingTitle="Asked Questions"
          auroraColors={["#f87171", "#fbbf24", "#34d399", "#60a5fa"]}
          description="Explore our comprehensive FAQ to find quick answers to common
            inquiries. If you need further assistance, don't hesitate to
            contact us for personalized help."
        />

        <div className="w-full max-w-3xl">
          <Accordion
            type="single"
            collapsible
            className="my-12 w-full space-y-4"
          >
            {pricingFaqData.map((faqItem, index) => (
              <AccordionItem
                key={faqItem.id}
                value={faqItem.id}
                className="rounded-xl border-2 border-border bg-gradient-to-r from-background to-muted/20 px-6 py-2 transition-all duration-300 hover:from-muted/30 hover:to-muted/40 hover:shadow-md"
              >
                <AccordionTrigger className="py-4 text-left font-semibold text-foreground transition-colors hover:text-primary [&[data-state=open]]:text-primary">
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    {faqItem.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pl-11 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {faqItem.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
