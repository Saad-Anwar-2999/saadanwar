import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Review } from "@/types/catalog";
import { StarRating } from "./star-rating";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="shadow-soft gap-3 p-5">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-secondary text-xs font-semibold">
            {review.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{review.author}</p>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
      </div>
      <StarRating rating={review.rating} />
      <p className="text-sm text-muted-foreground">{review.comment}</p>
    </Card>
  );
}
