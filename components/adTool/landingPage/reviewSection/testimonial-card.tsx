import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export interface TestimonialAuthor {
  name: string;
  handle: string;
  avatar: string;
}

export interface TestimonialCardProps {
  author: TestimonialAuthor;
  text: string;
  rating: number;
  screenshot?: string;
  href?: string;
  className?: string;
}

export function TestimonialCard({
  author,
  text,
  rating,
  screenshot,
  href,
  className,
}: TestimonialCardProps) {
  const Card = href ? "a" : "div";

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={cn(
          "transition-colors duration-200",
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600",
        )}
      />
    ));
  };

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "p-4 text-start sm:p-6",
        "hover:from-muted/60 hover:to-muted/20",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none">{author.name}</h3>
          <p className="text-sm text-muted-foreground">{author.handle}</p>
        </div>
      </div>

      {/* ⭐ Star rating display */}
      <div className="mt-3 flex gap-1">{renderStars(rating)}</div>

      <p className="sm:text-md mt-4 text-sm text-gray-500">{text}</p>

      {/* Screenshot */}
      {screenshot && (
        <div className="-mx-4 mt-4 overflow-hidden rounded-md border border-gray-200 dark:border-gray-600">
          <img
            src={screenshot}
            alt="Shopify store screenshot"
            className="h-auto w-full object-contain"
            style={{ maxHeight: "200px" }}
          />
        </div>
      )}
    </Card>
  );
}
