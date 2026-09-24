import Link from "next/link";
import { ArrowRight, BadgeCheck, Check } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { Button } from "@/components/ui/button";
import { SKYLINE_IMAGES } from "@/data/property-images";

const TRUST_POINTS = [
  "No brokerage — post directly to buyers and tenants",
  "3x more qualified enquiries on average",
  "Live in minutes with our guided posting wizard",
];

export function OwnerCtaCard() {
  return (
    <div className="sticky top-20 flex flex-col justify-center overflow-hidden rounded-3xl p-8 text-white sm:p-10">
      <PropertyImage src={SKYLINE_IMAGES[2]} alt="" className="opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700/95 via-primary-800/96 to-navy-950" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-primary-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-navy-300/20 blur-3xl" />

      <div className="relative">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/20 backdrop-blur">
          <BadgeCheck className="h-6 w-6 text-primary-200" />
        </span>
        <p className="mt-5 font-display text-xl font-bold sm:text-2xl">Have a property to sell or rent?</p>
        <p className="mt-2 text-sm text-primary-100">
          List it in minutes with our guided posting wizard — completely free for individual owners.
        </p>
        <ul className="mt-5 space-y-2.5">
          {TRUST_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-primary-100">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" /> {point}
            </li>
          ))}
        </ul>
        <Button asChild size="lg" variant="secondary" className="mt-7 w-fit">
          <Link href="/post-property">
            Post Property — FREE <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
