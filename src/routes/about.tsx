import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HeartHandshake, Target } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instructors } from "@/data/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Lumina — Learning built by practitioners" },
      {
        name: "description",
        content:
          "Why Lumina exists, how courses are made, and the instructors who teach them.",
      },
      { property: "og:title", content: "About Lumina" },
      {
        property: "og:description",
        content: "Why Lumina exists and the practitioners who teach here.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Target,
    title: "Outcomes over hours",
    description:
      "A course is finished when you can do the thing, not when the runtime hits forty hours.",
  },
  {
    icon: Compass,
    title: "Taught by doers",
    description:
      "Instructors are working engineers, designers and operators, and we cap their teaching load.",
  },
  {
    icon: HeartHandshake,
    title: "Honest pricing",
    description:
      "No fake countdowns or permanent sales. Prices are what they say and refunds are simple.",
  },
];

function AboutPage() {
  return (
    <>
      <Container className="py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            About us
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            We build the courses we wish we had
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Lumina started as an internal onboarding curriculum for a small product team.
            It grew into a catalogue of fifty tracks because the format worked: short
            lessons, real projects, and instructors who still do the job they teach.
          </p>
        </div>
      </Container>

      <Section className="bg-card" eyebrow="Values" title="What we optimise for">
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title} className="shadow-soft gap-3 p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <value.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-foreground">{value.title}</h2>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Instructors"
        title="Twenty practitioners, one standard"
        description="Every instructor teaches at most three tracks so each one stays current."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.slice(0, 8).map((instructor) => (
            <Card key={instructor.id} className="shadow-soft gap-3 p-6">
              <Avatar className="size-12">
                <AvatarFallback className="bg-secondary text-sm font-semibold">
                  {instructor.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {instructor.name}
                </h3>
                <p className="text-xs text-muted-foreground">{instructor.title}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {instructor.students.toLocaleString()} learners · {instructor.courses}{" "}
                courses
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-card">
        <Card className="shadow-soft items-center gap-4 p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Ready to start a track?
          </h2>
          <p className="max-w-lg text-sm text-muted-foreground">
            Preview lessons are free in every course, so you can judge the teaching before
            you commit.
          </p>
          <Button size="lg" asChild>
            <Link to="/courses">Browse courses</Link>
          </Button>
        </Card>
      </Section>
    </>
  );
}
