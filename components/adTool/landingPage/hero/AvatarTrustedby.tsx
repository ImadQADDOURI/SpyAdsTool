import React from "react";

import { cn } from "@/lib/utils"; // Optional: For merging classnames if you use Shadcn

interface AvatarTrustedbyProps {
  avatars: string[];
}
function AvatarTrustedby({ avatars }: AvatarTrustedbyProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-white/20 px-3 py-1 dark:border-white/10",
        "bg-white/20 backdrop-blur-sm dark:bg-black/20",
        "shadow-md shadow-black/10 dark:shadow-black/20",
        "hover:shadow-lg hover:shadow-purple-400/20 dark:hover:shadow-purple-300/10",
        "transition-all duration-300 ease-out",
      )}
    >
      {/* 👥 Avatar Group */}
      <div className="flex -space-x-2">
        {avatars.map((src, i) => (
          <div
            key={i}
            className="relative z-10 transition-transform duration-300 hover:scale-110"
          >
            <img
              src={src}
              alt={`Avatar ${i + 1}`}
              className="h-7 w-7 rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-900"
            />
            {/* ✨ Ring Pulse on Hover */}
            <span className="absolute inset-0 scale-100 rounded-full opacity-0 ring-2 ring-purple-400/40 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100"></span>
          </div>
        ))}
      </div>

      {/* 📝 Text */}
      <p className="animate-fade-in text-xs text-muted-foreground">
        Trusted by <span className="font-medium text-foreground">1K+</span>{" "}
        Users
      </p>
    </div>
  );
}

export default AvatarTrustedby;
