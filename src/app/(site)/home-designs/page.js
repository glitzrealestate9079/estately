import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Home Page Designs",
  description: "10 alternate animated homepage concepts for Estately, each built around a different hero/animation style.",
};

const DESIGNS = [
  {
    slug: "aurora",
    title: "Aurora Dreams",
    description: "A flowing, colorful WebGL aurora backdrop behind the search hero.",
    gradient: "from-fuchsia-500 via-primary-500 to-cyan-400",
  },
  {
    slug: "particles",
    title: "Midnight Particles",
    description: "A slow-drifting particle field over a premium night-sky hero.",
    gradient: "from-navy-950 via-navy-800 to-navy-950",
  },
  {
    slug: "ripple-grid",
    title: "Ripple Grid",
    description: "An interactive grid that ripples outward as you move your cursor.",
    gradient: "from-primary-700 via-primary-500 to-primary-300",
  },
  {
    slug: "silk",
    title: "Liquid Silk",
    description: "A luxury-toned, softly flowing 3D silk backdrop.",
    gradient: "from-amber-700 via-amber-500 to-navy-900",
  },
  {
    slug: "card-swap",
    title: "3D Showcase",
    description: "Featured listings auto-cycle as a stacked, swapping 3D card deck.",
    gradient: "from-navy-900 via-primary-700 to-navy-900",
  },
  {
    slug: "carousel",
    title: "Drag Carousel",
    description: "A draggable, physics-based carousel of popular cities.",
    gradient: "from-primary-500 via-accent-500 to-primary-700",
  },
  {
    slug: "bento",
    title: "Bento Grid",
    description: "A grid-first homepage — glowing spotlight cards by property category.",
    gradient: "from-navy-800 via-accent-600 to-navy-900",
  },
  {
    slug: "shiny-text",
    title: "Shine",
    description: "A minimal, elegant hero with a shimmering animated headline.",
    gradient: "from-navy-900 via-navy-700 to-primary-600",
  },
  {
    slug: "split-text",
    title: "Reveal",
    description: "A light, airy hero whose headline reveals word-by-word on scroll.",
    gradient: "from-primary-100 via-primary-300 to-primary-500",
  },
  {
    slug: "interactive-list",
    title: "Hover Preview",
    description: "Hover a trending locality to reveal a large, cursor-following photo preview.",
    gradient: "from-neutral-900 via-neutral-700 to-neutral-900",
  },
];

export default function HomeDesignsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Reveal>
        <Badge variant="primary" className="mb-3 inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Experimental
        </Badge>
      </Reveal>
      <SectionHeading
        eyebrow="Home page designs"
        title="10 different homepage concepts"
        description="Each one is a fully working homepage — real listings, real search, a different animated hero. The current live homepage is untouched; these are alternates to browse and compare."
        className="mb-10"
      />

      <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DESIGNS.map((design, index) => (
          <RevealItem key={design.slug}>
            <Link
              href={`/home-designs/${design.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${design.gradient}`}>
                <span className="font-display text-4xl font-bold text-white/25">{String(index + 1).padStart(2, "0")}</span>
                <span className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-foreground">{design.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground-muted">{design.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400">
                  View design
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
