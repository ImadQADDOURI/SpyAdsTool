import { testimonials } from "@/configuration/landing-config";

import { Header } from "../header";
import { AuroraText } from "../hero/AuroraText";
import { TestimonialCard } from "./testimonial-card";

export function TestimonialsSection() {
  return (
    <section className="px-0">
      <div className="max-w-container mx-auto flex flex-col items-center gap-4 text-center sm:gap-16">
        {/* 📝Header */}
        <Header
          gradientColors={testimonials.gradientColors}
          headline={testimonials.headline}
          subtitle={testimonials.subtitle}
          className="px-4"
          // headlineClassName="text-6xl"
          // subtitleClassName="text-xl"
          // containerClassName="max-w-4xl"
          // forceDarkMode={true}
        />

        {/* Marquee container */}
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex flex-row overflow-hidden p-2 [--duration:25s] [--gap:1.25rem] [gap:var(--gap)] sm:[--duration:35s] sm:[--gap:1.5rem]">
            {/* Track 1 */}
            <div className="animate-marquee flex shrink-0 flex-row [gap:var(--gap)] group-hover:[animation-play-state:paused]">
              {testimonials.reviews.map((testimonial, i) => (
                <TestimonialCard key={`track1-${i}`} {...testimonial} />
              ))}
            </div>
            {/* Track 2 (duplicate for seamless loop) */}
            <div className="animate-marquee flex shrink-0 flex-row [gap:var(--gap)] group-hover:[animation-play-state:paused]">
              {testimonials.reviews.map((testimonial, i) => (
                <TestimonialCard key={`track2-${i}`} {...testimonial} />
              ))}
            </div>
          </div>

          {/* Fade edges */}
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
            transform: translateX(-100%);
          }
        }
      `}</style>
    </section>
  );
}
