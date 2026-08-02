import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="gradient-brand flex size-9 items-center justify-center rounded-xl text-primary-foreground">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Lumina</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Project-driven courses from practitioners, built for people who learn by
            shipping.
          </p>
        </div>

        <nav aria-label="Platform">
          <h3 className="text-sm font-semibold text-foreground">Platform</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/courses" className="hover:text-foreground">
                All courses
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Resources">
          <h3 className="text-sm font-semibold text-foreground">Resources</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Learning paths</li>
            <li>Instructor handbook</li>
            <li>Student stories</li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-sm font-semibold text-foreground">Company</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Careers</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </nav>
      </Container>
      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Lumina Learning. All rights reserved.</p>
          <p>Built for curious people.</p>
        </Container>
      </div>
    </footer>
  );
}
