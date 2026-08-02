import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  PlayCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/catalog/empty-state";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getCourseBySlug } from "@/services/catalog-service";
import type { Lesson } from "@/types/catalog";

export const Route = createFileRoute("/learn/$slug")({
  head: () => ({
    meta: [
      { title: "Learning player — Lumina" },
      {
        name: "description",
        content:
          "Watch lessons, download resources and keep private notes in the Lumina learning player.",
      },
      { property: "og:title", content: "Learning player — Lumina" },
      {
        property: "og:description",
        content: "Watch lessons, download resources and keep notes as you learn.",
      },
    ],
  }),
  component: LearningPage,
});

function LearningPage() {
  const { slug } = Route.useParams();
  const courseQuery = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourseBySlug(slug),
  });
  const course = courseQuery.data;

  const flatLessons = useMemo(
    () =>
      course
        ? course.sections.flatMap((section) =>
            section.lessons.map((lesson) => ({ lesson, sectionTitle: section.title })),
          )
        : [],
    [course],
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (flatLessons.length > 0) setActiveId(flatLessons[0]!.lesson.id);
  }, [flatLessons]);

  if (courseQuery.isPending) {
    return (
      <Container className="grid gap-6 py-10 lg:grid-cols-[320px_1fr]">
        <Skeleton className="h-[520px] rounded-2xl" />
        <Skeleton className="h-[520px] rounded-2xl" />
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Course not found"
          description="We couldn't load this learning track. Try picking another course."
          action={
            <Button asChild>
              <Link to="/courses">Back to courses</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const index = Math.max(
    0,
    flatLessons.findIndex((item) => item.lesson.id === activeId),
  );
  const active: Lesson = flatLessons[index]!.lesson;
  const progress = Math.round((completed.size / flatLessons.length) * 100);

  const goTo = (nextIndex: number) => {
    const next = flatLessons[nextIndex];
    if (next) setActiveId(next.lesson.id);
  };

  const markComplete = () => {
    setCompleted((prev) => new Set(prev).add(active.id));
    toast.success("Lesson marked complete");
    goTo(index + 1);
  };

  return (
    <Container className="grid gap-8 py-8 lg:grid-cols-[340px_1fr]">
      <aside className="order-2 lg:order-1">
        <Card className="shadow-soft gap-4 p-5">
          <div>
            <Link
              to="/courses/$slug"
              params={{ slug: course.slug }}
              className="text-xs font-medium text-primary"
            >
              ← Course overview
            </Link>
            <h2 className="mt-2 line-clamp-2 text-base font-semibold text-foreground">
              {course.title}
            </h2>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress}% complete</span>
              <span>
                {completed.size}/{flatLessons.length}
              </span>
            </div>
            <Progress value={progress} className="mt-2" />
          </div>

          <ScrollArea className="h-[520px] pr-3">
            <nav aria-label="Course lessons" className="space-y-5">
              {course.sections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {section.title}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {section.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => setActiveId(lesson.id)}
                          aria-current={lesson.id === active.id ? "true" : undefined}
                          className={cn(
                            "flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                            lesson.id === active.id
                              ? "bg-secondary font-medium text-foreground"
                              : "text-muted-foreground hover:bg-secondary/60",
                          )}
                        >
                          <PlayCircle
                            className={cn(
                              "mt-0.5 size-4 shrink-0",
                              completed.has(lesson.id) && "text-success",
                            )}
                            aria-hidden="true"
                          />
                          <span className="flex-1 line-clamp-2">{lesson.title}</span>
                          <span className="text-[11px]">{lesson.duration}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </ScrollArea>
        </Card>
      </aside>

      <div className="order-1 space-y-6 lg:order-2">
        <Card className="shadow-soft overflow-hidden p-0">
          <div className="aspect-video w-full bg-black">
            <video
              key={active.id}
              controls
              className="size-full"
              poster=""
              aria-label={`Video for ${active.title}`}
            >
              <source src={active.videoUrl} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Lesson {index + 1}</Badge>
              {active.isPreview && <Badge>Free preview</Badge>}
              <span className="text-xs text-muted-foreground">{active.duration}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {active.title}
            </h1>
            <p className="text-sm text-muted-foreground">{active.description}</p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
              >
                <ChevronLeft className="size-4" aria-hidden="true" /> Previous
              </Button>
              <Button onClick={markComplete}>Mark complete</Button>
              <Button
                variant="outline"
                onClick={() => goTo(index + 1)}
                disabled={index === flatLessons.length - 1}
              >
                Next <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="resources">
          <TabsList>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-4">
            <Card className="shadow-soft gap-2 p-5">
              <ul className="divide-y divide-border">
                {active.resources.map((resource) => (
                  <li
                    key={resource.id}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                      {resource.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info("Resource downloads arrive with the API.")}
                    >
                      <Download className="size-4" aria-hidden="true" /> Download
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card className="shadow-soft gap-3 p-5">
              <label htmlFor="lesson-notes" className="text-sm font-medium text-foreground">
                Your notes for this lesson
              </label>
              <Textarea
                id="lesson-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write down what you want to remember…"
                className="min-h-40"
              />
              <div>
                <Button
                  size="sm"
                  onClick={() => toast.success("Notes saved locally for this session.")}
                >
                  Save notes
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
