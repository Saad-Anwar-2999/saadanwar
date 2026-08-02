import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Infinity as InfinityIcon,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-learning.jpg";
import { CategoryCard } from "@/components/catalog/category-card";
import { CourseCard } from "@/components/catalog/course-card";
import { CourseGridSkeleton } from "@/components/catalog/course-card-skeleton";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getCategories,
  getFaqs,
  getFeaturedCourses,
  getTestimonials,
  getTopRatedCourses,
} from "@/services/catalog-service";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumina — Project-driven online courses" },
      {
        name: "description",
        content:
          "Learn engineering, design, data and business through 50+ project-based courses taught by practitioners.",
      },
      { property: "og:title", content: "Lumina — Project-driven online courses" },
      {
        property: "og:description",
        content:
          "Learn engineering, design, data and business through 50+ project-based courses taught by practitioners.",
      },
    ],
  }),
  component: LandingPage,
});

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Built by practitioners",
    description:
      "Every track is written by someone who ships the thing they teach, not a full-time course factory.",
  },
  {
    icon: Sparkles,
    title: "Project after project",
    description:
      "Each section ends with an applied exercise, so you finish with a portfolio instead of notes.",
  },
  {
    icon: InfinityIcon,
    title: "Lifetime updates",
    description:
      "Curricula are refreshed at least twice a year and your library keeps every update for free.",
  },
  {
    icon: Users,
    title: "Learn with company",
    description:
      "Discussion spaces per course with weekly instructor answers and peer project reviews.",
  },
];

const STATS = [
  { value: "50+", label: "Courses" },
  { value: "2,000+", label: "Lessons" },
  { value: "180k", label: "Learners" },
  { value: "4.8", label: "Average rating" },
];

function LandingPage() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [email, setEmail] = useState("");

  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const featuredQuery = useQuery({
    queryKey: ["courses", "featured"],
    queryFn: () => getFeaturedCourses(6),
  });
  const topRatedQuery = useQuery({
    queryKey: ["courses", "top-rated"],
    queryFn: () => getTopRatedCourses(3),
  });
  const testimonialsQuery = useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });
  const faqsQuery = useQuery({ queryKey: ["faqs"], queryFn: getFaqs });

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate({ to: "/courses", search: { q: term || undefined } });
  };

  const onSubscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're on the list. Watch your inbox for new tracks.");
    setEmail("");
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 60% at 15% 0%, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent), radial-gradient(50% 50% at 90% 10%, color-mix(in oklab, var(--color-accent) 14%, transparent), transparent)",
          }}
          aria-hidden="true"
        />
        <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              New AI engineering track for 2026
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Learn the craft by{" "}
              <span className="text-gradient-brand">actually building it</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Structured, project-driven courses in engineering, design, data and
              business — taught by people who do the work every day.
            </p>

            <form onSubmit={onSearch} className="mt-8 flex max-w-md gap-2" role="search">
              <div className="relative flex-1">
                <Search
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="What do you want to learn?"
                  aria-label="Search courses"
                  className="h-12 rounded-xl pl-9"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 rounded-xl">
                Search
              </Button>
            </form>

            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-semibold text-foreground">{stat.value}</dd>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <img
              src={heroImage}
              alt="Illustration of layered course player interfaces"
              width={1280}
              height={960}
              className="shadow-lift w-full rounded-3xl border border-border"
            />
          </motion.div>
        </Container>
      </section>

      <Section
        eyebrow="Categories"
        title="Find your field"
        description="Fifteen tracks covering the skills teams hire for right now."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categoriesQuery.data?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Section>

      <Section
        className="bg-card"
        eyebrow="Popular"
        title="Most enrolled this month"
        description="The tracks learners keep coming back to."
        action={
          <Button variant="outline" asChild>
            <Link to="/courses">
              Browse all courses <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      >
        {featuredQuery.isPending ? (
          <CourseGridSkeleton />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredQuery.data?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Top rated" title="Highest rated by learners">
        {topRatedQuery.isPending ? (
          <CourseGridSkeleton count={3} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topRatedQuery.data?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </Section>

      <Section
        className="bg-card"
        eyebrow="Why Lumina"
        title="A learning platform without the filler"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <Card key={benefit.title} className="shadow-soft gap-3 p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <benefit.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Testimonials" title="What learners say">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonialsQuery.data?.slice(0, 6).map((testimonial) => (
            <Card key={testimonial.id} className="shadow-soft gap-4 p-6">
              <p className="text-sm text-foreground">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary text-xs font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-card" eyebrow="FAQ" title="Questions, answered">
        <Accordion type="single" collapsible className="mx-auto max-w-3xl">
          {faqsQuery.data?.slice(0, 8).map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section>
        <Card className="gradient-brand shadow-lift items-center gap-6 border-0 p-10 text-center text-primary-foreground">
          <h2 className="text-3xl font-semibold tracking-tight">
            One email a month. New tracks only.
          </h2>
          <p className="max-w-xl text-sm opacity-90">
            No drip campaigns, no discount spam — just what launched and what changed.
          </p>
          <form
            onSubmit={onSubscribe}
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-label="Email address"
              className="h-12 rounded-xl border-transparent bg-background text-foreground"
            />
            <Button type="submit" size="lg" variant="secondary" className="h-12 rounded-xl">
              Subscribe
            </Button>
          </form>
        </Card>
      </Section>
    </>
  );
}
