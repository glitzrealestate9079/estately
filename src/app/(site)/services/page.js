import Link from "next/link";
import { Camera, Headphones, Rocket, Scale, Share2, Sofa, Star, Video, Wrench, Calculator } from "lucide-react";
import { EmiCalculator } from "@/components/site/property/emi-calculator";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/data/services";
import { FAQS } from "@/data/faqs";
import { formatIndianCurrency } from "@/lib/site/format";

// Icons aren't serializable across data boundaries, so services.js stores
// only the icon's lucide-react name — resolved to a component right here.
const SERVICE_ICON_MAP = { Camera, Rocket, Scale, Video, Star, Share2, Sofa, Headphones };

export const metadata = {
  title: "Services & Tools",
  description: "Free EMI calculator plus seller add-on services like professional photography, listing boosts and legal assistance.",
};

export default function ServicesPage() {
  const generalFaqs = FAQS.filter((f) => f.category === "General").slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <SectionHeading
          eyebrow="Free tool"
          title="EMI Calculator"
          description="Plan your home loan before you commit — instant, no sign-up required."
          align="center"
        />
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border-subtle bg-surface p-6 shadow-card sm:p-8">
          <EmiCalculator />
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="For sellers"
          title="Boost your listing"
          description="Optional add-ons to help your property stand out and convert faster."
        />
        <RevealGroup className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.filter((s) => s.status === "Active").map((service) => {
            const Icon = SERVICE_ICON_MAP[service.icon] ?? Wrench;
            return (
              <RevealItem key={service.id}>
                <div className="flex h-full flex-col rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-display text-sm font-semibold text-foreground">{service.name}</p>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-foreground-muted">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
                    <span className="font-display text-sm font-bold text-foreground">{formatIndianCurrency(service.price)}</span>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/post-property">Add to listing</Link>
                    </Button>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Help center" title="Frequently asked questions" />
          <div className="mt-6 space-y-3">
            {generalFaqs.map((faq) => (
              <details key={faq.id} className="group rounded-xl border border-border-subtle bg-surface p-4 transition-colors hover:bg-surface-muted">
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-navy-900 p-8 text-white">
          <Calculator className="h-9 w-9 text-primary-200" />
          <p className="mt-4 font-display text-lg font-bold">Still have questions?</p>
          <p className="mt-2 text-sm text-primary-100">
            Our support team is available every day to help you buy, rent or list a property with confidence.
          </p>
          <Button asChild variant="secondary" className="mt-5">
            <Link href="/blog">Read our guides</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
