import Link from "next/link";
import { Building2, Home, SearchX } from "lucide-react";

// A root-level not-found is required so genuinely unmatched URLs (outside
// any defined route) get this branded page instead of Next's bare default —
// src/app/(site)/not-found.js only covers notFound() calls and unmatched
// paths *within* that route group's own subtree.
export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <Link href="/" className="mb-2 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-navy-900 text-white shadow-sm">
          <Building2 className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-bold text-foreground">Estately</span>
      </Link>
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-foreground-muted">
        <SearchX className="h-7 w-7" />
      </span>
      <h1 className="font-display text-xl font-bold text-foreground">Page not found</h1>
      <p className="max-w-sm text-sm text-foreground-muted">
        The page you&apos;re looking for may have moved or no longer exists.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
      >
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
