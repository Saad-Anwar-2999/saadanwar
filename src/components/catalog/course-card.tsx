import { Link } from "@tanstack/react-router";
import { Clock, PlayCircle, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCategory, getInstructor } from "@/services/catalog-service";
import type { Course } from "@/types/catalog";
import { StarRating } from "./star-rating";

export function CourseCard({ course }: { course: Course }) {
  const instructor = getInstructor(course.instructorId);
  const category = getCategory(course.categoryId);

  return (
    <Card className="group shadow-soft hover:shadow-lift overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1">
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        className="block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <div
          className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${course.thumbnail}`}
        >
          <PlayCircle
            className="size-10 text-white/90 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          />
          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground hover:bg-background/90">
            {course.level}
          </Badge>
        </div>

        <div className="space-y-3 p-5">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {category?.name}
          </p>
          <h3 className="line-clamp-2 text-base font-semibold text-foreground">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{course.subtitle}</p>
          <p className="text-sm text-muted-foreground">{instructor?.name}</p>

          <StarRating rating={course.rating} count={course.reviewCount} />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" /> {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />{" "}
              {course.students.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-lg font-semibold text-foreground">
              {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
            <span className="text-sm font-medium text-primary">View course</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
