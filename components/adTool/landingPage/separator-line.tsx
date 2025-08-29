import { cn } from "@/lib/utils";

interface SeparatorLineProps {
  className?: string;
  variant?: "soft" | "subtle" | "gradient";
}

export function SeparatorLine({
  className,
  variant = "soft",
}: SeparatorLineProps) {
  const variants = {
    soft: "h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-800",
    subtle: "h-px bg-gray-100 dark:bg-gray-900",
    gradient:
      "h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700",
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full", variants[variant])} />
    </div>
  );
}
