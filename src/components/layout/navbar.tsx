import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Container } from "./container";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2" aria-label="Lumina home">
          <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Lumina</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/courses">Browse</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/courses">Start learning</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="px-4 pt-4 text-base">Menu</SheetTitle>
            <nav aria-label="Mobile" className="mt-4 flex flex-col gap-1 px-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: link.to === "/" }}
                  activeProps={{ className: "bg-secondary text-foreground" }}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
