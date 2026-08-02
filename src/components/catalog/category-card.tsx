import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Category } from "@/types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  const Icon =
    (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] ??
    Icons.BookOpen;

  return (
    <Link
      to="/courses"
      search={{ category: category.id }}
      className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-2xl"
    >
      <Card className="shadow-soft hover:shadow-lift h-full gap-3 p-5 transition-all duration-300 hover:-translate-y-1">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {category.description}
        </p>
        <p className="text-xs font-medium text-muted-foreground">
          {category.courseCount} courses
        </p>
      </Card>
    </Link>
  );
}
