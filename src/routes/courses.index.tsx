import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CourseCard } from "@/components/catalog/course-card";
import { CourseGridSkeleton } from "@/components/catalog/course-card-skeleton";
import { EmptyState } from "@/components/catalog/empty-state";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories, getCourses } from "@/services/catalog-service";
import type { CourseQuery } from "@/services/catalog-service";
import type { Level } from "@/types/catalog";

interface CoursesSearch {
  q?: string | undefined;
  category?: string | undefined;
  level?: Level | "all" | undefined;
  price?: "all" | "free" | "paid" | undefined;
  sort?: NonNullable<CourseQuery["sort"]> | undefined;
  page?: number | undefined;
}

export const Route = createFileRoute("/courses/")({
  validateSearch: (search: Record<string, unknown>): CoursesSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? (search["q"] as string) : undefined,
    category:
      typeof search["category"] === "string" ? (search["category"] as string) : undefined,
    level: (search["level"] as CoursesSearch["level"]) ?? undefined,
    price: (search["price"] as CoursesSearch["price"]) ?? undefined,
    sort: (search["sort"] as CoursesSearch["sort"]) ?? undefined,
    page: Number(search["page"]) > 1 ? Number(search["page"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All courses — Lumina" },
      {
        name: "description",
        content:
          "Browse 50+ project-based courses. Filter by category, level and price, and sort by rating or popularity.",
      },
      { property: "og:title", content: "All courses — Lumina" },
      {
        property: "og:description",
        content: "Browse 50+ project-based courses across 15 categories.",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/courses" });

  const setSearch = (patch: Partial<CoursesSearch>) => {
    navigate({
      search: (prev: CoursesSearch) => ({
        ...prev,
        ...patch,
        page: patch.page ?? undefined,
      }),
    });
  };

  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  const query: CourseQuery = {
    search: search.q,
    categoryId: search.category ?? "all",
    level: search.level ?? "all",
    price: search.price ?? "all",
    sort: search.sort ?? "popular",
    page: search.page ?? 1,
    perPage: 9,
  };

  const coursesQuery = useQuery({
    queryKey: ["courses", query],
    queryFn: () => getCourses(query),
    placeholderData: keepPreviousData,
  });

  const result = coursesQuery.data;

  return (
    <Container className="py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          All courses
        </h1>
        <p className="mt-3 text-muted-foreground">
          Fifty project-driven tracks across fifteen fields. Filter down to what you need
          next.
        </p>
      </header>

      <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-4 lg:grid-cols-5">
        <Input
          value={search.q ?? ""}
          onChange={(e) => setSearch({ q: e.target.value || undefined })}
          placeholder="Search courses"
          aria-label="Search courses"
          className="lg:col-span-2"
        />

        <Select
          value={search.category ?? "all"}
          onValueChange={(value) =>
            setSearch({ category: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger aria-label="Category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoriesQuery.data?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={search.level ?? "all"}
          onValueChange={(value) =>
            setSearch({ level: value === "all" ? undefined : (value as Level) })
          }
        >
          <SelectTrigger aria-label="Level">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={search.sort ?? "popular"}
          onValueChange={(value) =>
            setSearch({ sort: value as NonNullable<CourseQuery["sort"]> })
          }
        >
          <SelectTrigger aria-label="Sort by">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {result ? `${result.total} courses` : "Loading courses…"}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate({ search: {} })
          }
        >
          Reset filters
        </Button>
      </div>

      <div className="mt-6">
        {coursesQuery.isPending ? (
          <CourseGridSkeleton count={9} />
        ) : result && result.items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No courses match those filters"
            description="Try a broader search term or clear one of the filters to see more results."
            action={
              <Button onClick={() => navigate({ search: {} })}>Clear filters</Button>
            }
          />
        )}
      </div>

      {result && result.totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSearch({ page: Math.max(1, result.page - 1) });
                }}
              />
            </PaginationItem>
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === result.page}
                  onClick={(e) => {
                    e.preventDefault();
                    setSearch({ page });
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSearch({ page: Math.min(result.totalPages, result.page + 1) });
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </Container>
  );
}
