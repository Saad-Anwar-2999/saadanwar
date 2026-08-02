import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span className="flex" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(
              "size-3.5",
              i < Math.round(rating)
                ? "fill-warning text-warning"
                : "text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
