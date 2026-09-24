import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center sm:px-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-foreground-muted">
        <SearchX className="h-7 w-7" />
      </span>
      <h1 className="font-display text-xl font-bold text-foreground">Page not found</h1>
      <p className="text-sm text-foreground-muted">
        This listing may have been sold, rented, or removed — or the link might be incorrect.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/buy">
            <SearchX className="h-4 w-4" /> Browse Properties
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
