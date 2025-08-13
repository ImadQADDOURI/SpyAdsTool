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
  rating: number; // ⭐ Add rating property
  href?: string;
  className?: string;
}

export function TestimonialCard({
  author,
  text,
  rating,
  href,
  className,
}: TestimonialCardProps) {
  const Card = href ? "a" : "div";

  // ⭐ Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={cn(
          "transition-colors duration-200",
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200",
        )}
      />
    ));
  };

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t border-gray-800",
        "bg-gradient-to-b from-gray-900/80 to-gray-900/40",
        "p-4 text-start sm:p-6",
        "hover:from-gray-800/80 hover:to-gray-800/40",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-colors duration-300",
        "text-white",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-white">
            {author.name}
          </h3>
          <p className="text-sm text-gray-400">{author.handle}</p>
        </div>
      </div>

      {/* ⭐ Star rating display */}
      <div className="mt-3 flex gap-1">{renderStars(rating)}</div>

      <p className="sm:text-md mt-4 text-sm text-gray-300">{text}</p>
    </Card>
  );
}
