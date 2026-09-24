import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  CalendarClock,
  Compass,
  IndianRupee,
  Layers,
  Mail,
  MapPin,
  Phone,
  Ruler,
  Sofa,
} from "lucide-react";
import { PropertyGallery } from "@/components/site/property/gallery";
import { TrustBadges } from "@/components/site/property/trust-badges";
import { EnquiryForm } from "@/components/site/property/enquiry-form";
import { ScheduleVisitModal } from "@/components/site/property/schedule-visit-modal";
import { StickyContactBar } from "@/components/site/property/sticky-contact-bar";
import { EmiCalculator } from "@/components/site/property/emi-calculator";
import { ReportListingModal } from "@/components/site/property/report-listing-modal";
import { LocalityInsightsCard } from "@/components/site/locality/locality-insights-card";
import { PropertyCard } from "@/components/site/property/property-card";
import { SectionHeading } from "@/components/site/ui/section-heading";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROPERTIES } from "@/data/properties";
import { getPropertyBySlug, getRelatedProperties, getLocalityByName, slugify } from "@/lib/site/site-data";
import { deriveHighlights } from "@/lib/site/highlights";
import { derivePossession } from "@/lib/site/derived";
import { formatArea, formatPrice, formatPricePerSqft, timeAgoLabel } from "@/lib/site/format";
import { initials } from "@/lib/utils";

export function generateStaticParams() {
  return PROPERTIES.filter((p) => p.status === "Active").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property Not Found" };
  return {
    title: `${property.bedrooms ? `${property.bedrooms} BHK ` : ""}${property.type} for ${property.listingType === "Sale" ? "Sale" : "Rent"} in ${property.location.locality}, ${property.location.city}`,
    description: property.description,
  };
}

const SPEC_ROWS = (property) => [
  { icon: BedDouble, label: "Bedrooms", value: property.bedrooms },
  { icon: Bath, label: "Bathrooms", value: property.bathrooms },
  { icon: Ruler, label: "Carpet Area", value: formatArea(property) },
  { icon: Layers, label: "Floor", value: property.floor ? `${property.floor} of ${property.totalFloors}` : null },
  { icon: Compass, label: "Facing", value: property.facing },
  { icon: Sofa, label: "Furnishing", value: property.furnishing },
  { icon: Car, label: "Parking", value: property.parking ? "Available" : "Not available" },
  { icon: Calendar, label: "Status", value: derivePossession(property) },
];

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const related = getRelatedProperties(property, 4);
  const locality = getLocalityByName(property.location.city, property.location.locality);
  const highlights = deriveHighlights(property);
  const isSale = property.listingType === "Sale";

  return (
    <div className="pb-24 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <p className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-foreground-muted">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href={property.listingType === "Rent" ? "/rent" : "/buy"} className="hover:text-foreground">
            {property.listingType === "Rent" ? "Rent" : "Buy"}
          </Link>
          <span>/</span>
          <Link href={`/city/${slugify(property.location.city)}`} className="hover:text-foreground">
            {property.location.city}
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{property.location.locality}</span>
        </p>

        <PropertyGallery images={property.images} title={property.title} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Summary */}
            <section>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">{property.type}</Badge>
                <Badge>{property.listingType === "Sale" ? "For Sale" : property.listingType === "Rent" ? "For Rent" : "PG"}</Badge>
                {property.featured && <Badge variant="featured">Featured</Badge>}
                <TrustBadges property={property} size="md" />
              </div>
              <h1 className="mt-3 font-display text-xl font-bold text-foreground sm:text-2xl">
                {property.bedrooms ? `${property.bedrooms} BHK ` : ""}
                {property.type} for {isSale ? "Sale" : "Rent"} in {property.location.locality}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-foreground-muted">
                <MapPin className="h-4 w-4" /> {property.address}
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-3">
                <p className="font-display text-3xl font-bold text-primary-700 dark:text-primary-400">{formatPrice(property)}</p>
                {formatPricePerSqft(property) && <p className="pb-1 text-sm text-foreground-muted">{formatPricePerSqft(property)}</p>}
              </div>
              <p className="mt-1 text-xs text-foreground-muted">{timeAgoLabel(property.createdAt)}</p>
            </section>

            {/* Key facts */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SPEC_ROWS(property)
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} className="rounded-xl border border-border-subtle bg-surface p-3">
                    <row.icon className="h-4 w-4 text-foreground-muted" />
                    <p className="mt-1.5 text-xs text-foreground-muted">{row.label}</p>
                    <p className="text-sm font-semibold text-foreground">{row.value}</p>
                  </div>
                ))}
            </section>

            {/* Highlights */}
            {highlights.length > 0 && (
              <section>
                <h2 className="mb-3 font-display text-base font-semibold text-foreground">Highlights</h2>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-sm text-foreground-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Description */}
            <section>
              <h2 className="mb-2 font-display text-base font-semibold text-foreground">About this property</h2>
              <p className="text-sm leading-relaxed text-foreground-muted">{property.description}</p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="mb-3 font-display text-base font-semibold text-foreground">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity}>{amenity}</Badge>
                ))}
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="mb-3 font-display text-base font-semibold text-foreground">Location</h2>
              <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-navy-50 dark:bg-navy-950">
                <div
                  className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <span className="relative flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-popover">
                  <MapPin className="h-3.5 w-3.5" /> {property.location.locality}
                </span>
              </div>
              <p className="mt-2 text-xs text-foreground-muted">Approximate location shown for privacy — exact address shared after enquiry.</p>
            </section>

            {/* Locality insights */}
            <section>
              <h2 className="mb-3 font-display text-base font-semibold text-foreground">Locality Insights</h2>
              <LocalityInsightsCard locality={locality} />
            </section>

            {/* EMI calculator */}
            {isSale && (
              <section>
                <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-semibold text-foreground">
                  <IndianRupee className="h-4 w-4" /> EMI Calculator
                </h2>
                <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
                  <EmiCalculator defaultPrice={property.price} />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-20 lg:h-fit">
            <div className="hidden rounded-2xl border border-border-subtle bg-surface p-5 shadow-card lg:block">
              <p className="font-display text-lg font-bold text-primary-700 dark:text-primary-400">{formatPrice(property)}</p>
              <p className="text-xs text-foreground-muted">{property.address}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ScheduleVisitModal
                  property={property}
                  trigger={
                    <Button variant="outline" className="w-full gap-1.5">
                      <CalendarClock className="h-4 w-4" /> Schedule Visit
                    </Button>
                  }
                />
                <Button variant="outline" className="w-full gap-1.5" asChild>
                  <a href="#enquiry-form">
                    <Phone className="h-4 w-4" /> Contact
                  </a>
                </Button>
              </div>
            </div>

            <div id="enquiry-form" className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
              <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Contact {property.sellerType === "Owner" ? "Owner" : property.sellerType === "Agent" ? "Agent" : "Builder"}</h3>
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={property.agent.avatar} alt={property.owner.name} />
                  <AvatarFallback>{initials(property.owner.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{property.owner.name}</p>
                  <p className="flex items-center gap-1 text-xs text-foreground-muted">
                    <Mail className="h-3 w-3" /> Responds within a few hours
                  </p>
                </div>
              </div>
              <EnquiryForm property={property} />
            </div>

            <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-card">
              <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Verification</h3>
              <ul className="space-y-2.5 text-sm">
                <VerificationRow label="Phone verified" done={property.phoneVerified} />
                <VerificationRow label="Identity verification" done={property.identityVerified === "Verified"} />
                <VerificationRow label="Property verification" done={property.propertyVerified === "Verified"} />
              </ul>
              {property.rera && (
                <div className="mt-3 border-t border-border-subtle pt-3 text-xs">
                  <p className="text-foreground-muted">RERA Number</p>
                  <p className="font-medium text-foreground">{property.rera}</p>
                  <p className="mt-0.5 text-foreground-muted">{property.reraAuthority}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-1">
              <Badge variant="default" className="gap-1">
                <Building2 className="h-3 w-3" /> {property.id}
              </Badge>
              <ReportListingModal propertyTitle={property.title} />
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {related.length > 0 && (
          <section className="mt-14">
            <SectionHeading title="Similar properties" description={`More options in ${property.location.city}`} />
            <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <RevealItem key={item.id}>
                  <PropertyCard property={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        )}
      </div>

      <StickyContactBar property={property} />
    </div>
  );
}

function VerificationRow({ label, done }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${done ? "bg-success-600 text-white" : "border border-border-subtle text-transparent"}`}>
        {done ? "✓" : "•"}
      </span>
      <span className={done ? "text-foreground" : "text-foreground-muted"}>{label}</span>
    </li>
  );
}
