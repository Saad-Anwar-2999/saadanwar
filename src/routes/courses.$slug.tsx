import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarClock,
  Clock,
  Globe,
  PlayCircle,
  Users,
} from "lucide-react";

import { CourseCard } from "@/components/catalog/course-card";
import { EmptyState } from "@/components/catalog/empty-state";
import { ReviewCard } from "@/components/catalog/review-card";
import { StarRating } from "@/components/catalog/star-rating";
import { Container } from "@/components/layout/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCategory,
  getCourseBySlug,
  getCourseReviews,
  getFaqs,
  getInstructor,
  getRelatedCourses,
} from "@/services/catalog-service";

export const Route = createFileRoute("/courses/$slug")({
  head: ({ params }) => {
    const title = params.slug
      .replace(/-\d+$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${title} — Lumina` },
        {
          name: "description",
          content: `Curriculum, reviews and lessons for the ${title} course on Lumina.`,
        },
        { property: "og:title", content: `${title} — Lumina` },
        {
          property: "og:description",
          content: `Curriculum, reviews and lessons for the ${title} course on Lumina.`,
        },
      ],
    };
  },
  component: CourseDetailsPage,
});

function CourseDetailsPage() {
  const { slug } = Route.useParams();
  const courseQuery = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourseBySlug(slug),
  });
  const course = courseQuery.data;

  const reviewsQuery = useQuery({
    queryKey: ["course", course?.id, "reviews"],
    queryFn: () => getCourseReviews(course!.id),
    enabled: Boolean(course),
  });
  const relatedQuery = useQuery({
    queryKey: ["course", course?.id, "related"],
    queryFn: () => getRelatedCourses(course!, 3),
    enabled: Boolean(course),
  });
  const faqsQuery = useQuery({ queryKey: ["faqs"], queryFn: getFaqs });

  if (courseQuery.isPending) {
    return (
      <Container className="space-y-6 py-12">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Course not found"
          description="This course may have been renamed or retired. Browse the catalog to find something close."
          action={
            <Button asChild>
              <Link to="/courses">Back to courses</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  const instructor = getInstructor(course.instructorId);
  const category = getCategory(course.categoryId);
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);

  return (
    <>
      <section className="border-b border-border bg-card">
        <Container className="py-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/courses">Courses</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{course.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <Badge variant="secondary">{category?.name}</Badge>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                {course.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <StarRating rating={course.rating} count={course.reviewCount} />
                <span className="flex items-center gap-1.5">
                  <Users className="size-4" aria-hidden="true" />
                  {course.students.toLocaleString()} learners
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden="true" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="size-4" aria-hidden="true" />
                  {course.language}
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="size-4" aria-hidden="true" />
                  {course.level}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="size-4" aria-hidden="true" />
                  Updated {course.updatedAt}
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-secondary text-xs font-semibold">
                    {instructor?.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {instructor?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{instructor?.title}</p>
                </div>
              </div>
            </div>

            <Card className="shadow-lift h-fit gap-4 p-6">
              <div
                className={`flex h-40 items-center justify-center rounded-xl bg-gradient-to-br ${course.thumbnail}`}
              >
                <PlayCircle className="size-10 text-white/90" aria-hidden="true" />
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </p>
              <Button size="lg" asChild>
                <Link to="/learn/$slug" params={{ slug: course.slug }}>
                  Start learning
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/learn/$slug" params={{ slug: course.slug }}>
                  Watch free preview
                </Link>
              </Button>
              <Separator />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{totalLessons} on-demand lessons</li>
                <li>Downloadable resources in every lesson</li>
                <li>Lifetime access and future updates</li>
                <li>Certificate of completion</li>
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <Tabs defaultValue="curriculum">
          <TabsList>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="curriculum" className="mt-6 max-w-3xl">
            <Accordion type="single" collapsible defaultValue={course.sections[0]?.id}>
              {course.sections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-left">
                    <span>
                      {section.title}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {section.lessons.length} lessons
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="divide-y divide-border">
                      {section.lessons.map((lesson) => (
                        <li
                          key={lesson.id}
                          className="flex items-center justify-between gap-4 py-3"
                        >
                          <span className="flex items-center gap-2 text-sm text-foreground">
                            <PlayCircle
                              className="size-4 text-muted-foreground"
                              aria-hidden="true"
                            />
                            {lesson.title}
                            {lesson.isPreview && (
                              <Badge variant="secondary" className="text-[10px]">
                                Preview
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="overview" className="mt-6 max-w-3xl space-y-4">
            <p className="text-muted-foreground">{course.description}</p>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Card className="shadow-soft gap-2 p-6">
              <h3 className="text-base font-semibold text-foreground">
                About {instructor?.name}
              </h3>
              <p className="text-sm text-muted-foreground">{instructor?.bio}</p>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {reviewsQuery.data && reviewsQuery.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviewsQuery.data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No reviews yet"
                description="Be the first to share how this course helped you."
              />
            )}
          </TabsContent>

          <TabsContent value="faq" className="mt-6 max-w-3xl">
            <Accordion type="single" collapsible>
              {faqsQuery.data?.slice(0, 6).map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>

        {relatedQuery.data && relatedQuery.data.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Related courses
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedQuery.data.map((related) => (
                <CourseCard key={related.id} course={related} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
