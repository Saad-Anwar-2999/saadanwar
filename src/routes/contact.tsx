import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Lumina — Talk to the team" },
      {
        name: "description",
        content:
          "Questions about courses, team plans or teaching with us? Send the Lumina team a message.",
      },
      { property: "og:title", content: "Contact Lumina" },
      {
        property: "og:description",
        content: "Questions about courses, team plans or teaching with us?",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("Enter a valid email address."),
  topic: z.string().min(1, "Choose a topic."),
  message: z.string().min(20, "A little more detail helps us answer well."),
});

type ContactValues = z.infer<typeof contactSchema>;

const DETAILS = [
  { icon: Mail, label: "Email", value: "hello@lumina.courses" },
  { icon: MessageSquare, label: "Support hours", value: "Mon–Fri, 9:00–18:00 CET" },
  { icon: MapPin, label: "Studio", value: "Lisbon, Portugal" },
];

function ContactPage() {
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "", message: "" },
  });

  const onSubmit = (values: ContactValues) => {
    toast.success(`Thanks ${values.name}, we'll reply within one business day.`);
    form.reset();
  };

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          Talk to the team
        </h1>
        <p className="mt-4 text-muted-foreground">
          Course questions, team plans, or a pitch to teach with us — this form reaches a
          human.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="shadow-soft p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Ada Lovelace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a topic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="courses">Course question</SelectItem>
                        <SelectItem value="teams">Team plans</SelectItem>
                        <SelectItem value="teaching">Teaching with Lumina</SelectItem>
                        <SelectItem value="other">Something else</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what you need…"
                        className="min-h-40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg">
                Send message
              </Button>
            </form>
          </Form>
        </Card>

        <div className="space-y-4">
          {DETAILS.map((detail) => (
            <Card key={detail.label} className="shadow-soft gap-2 p-5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                <detail.icon className="size-4" aria-hidden="true" />
              </span>
              <p className="text-xs text-muted-foreground">{detail.label}</p>
              <p className="text-sm font-medium text-foreground">{detail.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
