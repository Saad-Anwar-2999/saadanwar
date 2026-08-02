import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Container } from "./container";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  action,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <Container>
        {(title || eyebrow) && (
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {eyebrow && (
                <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-3 text-base text-muted-foreground">{description}</p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
