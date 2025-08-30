import { testimonials } from "@/configuration/landing-config";

import { AuroraText } from "../hero/AuroraText";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsSection() {
  return (
    <section className="px-0">
      <div className="max-w-container mx-auto flex flex-col items-center gap-4 text-center sm:gap-16">
        <div className="mb-6 space-y-4 text-center">
          <h2 className="mb-1 text-balance text-2xl font-bold sm:text-3xl lg:text-5xl">
            What Our{" "}
            <AuroraText
              colors={["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"]}
              className="inline-block"
            >
              Users
            </AuroraText>{" "}
            Are Saying
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base lg:text-lg">
            Real feedback from our community—see how they're scaling faster with
            our platform.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex flex-row overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]">
            <div className="animate-marquee flex shrink-0 flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) =>
                testimonials.map((testimonial, i) => (
                  <TestimonialCard key={`${setIndex}-${i}`} {...testimonial} />
                )),
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee var(--duration) linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% - var(--gap)));
          }
        }
      `}</style>
    </section>
  );
}
