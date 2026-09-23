import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  Ruler,
  Compass,
  Building,
  Car,
  MapPin,
  Pencil,
  Phone,
  Mail,
  Eye,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropertyImage } from "@/components/common/property-image";
import { TrustBadges } from "@/components/properties/TrustBadges";
import { ListingCompleteness } from "@/components/properties/ListingCompleteness";
import { VerificationChecklist } from "@/components/properties/VerificationChecklist";
import { ListingStatusPanel } from "@/components/properties/ListingStatusPanel";
import { getPropertyById, PROPERTIES } from "@/data/properties";
import { formatCurrency, formatDate, formatNumber, initials } from "@/lib/utils";

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  return { title: property ? property.title : "Property" };
}

function Stat({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2.5">
      <Icon className="h-4 w-4 text-foreground-muted" />
      <div>
        <p className="text-xs text-foreground-muted">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={property.title}
        subtitle={`${property.id} · Listed ${formatDate(property.createdAt)}`}
        actions={
          <>
            <ListingStatusPanel property={property} />
            <Button variant="outline" asChild>
              <Link href={`/properties/${property.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="grid grid-cols-2 gap-1 p-1 sm:grid-cols-4">
              {property.images.map((src, i) => (
                <div key={i} className={i === 0 ? "relative col-span-2 row-span-2 aspect-square overflow-hidden rounded-lg sm:aspect-auto" : "relative aspect-square overflow-hidden rounded-lg"}>
                  <PropertyImage src={src} alt={`${property.title} ${i + 1}`} />
                </div>
              ))}
            </div>
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="primary">{property.type}</Badge>
                <Badge>{property.listingType}</Badge>
                <TrustBadges property={property} />
              </div>
              <p className="flex items-center gap-1.5 text-sm text-foreground-muted">
                <MapPin className="h-4 w-4" />
                {property.address}
              </p>
              <p className="mt-3 font-display text-2xl font-bold text-primary-700 dark:text-primary-400">
                {formatCurrency(property.price)}
                {property.listingType === "Rent" && <span className="text-sm font-normal text-foreground-muted">/month</span>}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon={BedDouble} label="Bedrooms" value={property.bedrooms} />
                <Stat icon={Bath} label="Bathrooms" value={property.bathrooms} />
                <Stat icon={Ruler} label="Carpet Area" value={`${property.carpetArea} sq.ft`} />
                <Stat icon={Compass} label="Facing" value={property.facing} />
                <Stat icon={Building} label="Floor" value={property.floor ? `${property.floor} / ${property.totalFloors}` : null} />
                <Stat icon={Car} label="Parking" value={property.parking ? "Available" : "Not Available"} />
              </div>

              <h3 className="mb-2 mt-6 font-display text-base font-semibold text-foreground">Description</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{property.description}</p>

              <h3 className="mb-2 mt-6 font-display text-base font-semibold text-foreground">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <Eye className="mx-auto mb-1 h-4 w-4 text-foreground-muted" />
                <p className="font-display text-lg font-bold text-foreground">{formatNumber(property.views)}</p>
                <p className="text-xs text-foreground-muted">Views</p>
              </div>
              <div className="text-center">
                <MessageSquare className="mx-auto mb-1 h-4 w-4 text-foreground-muted" />
                <p className="font-display text-lg font-bold text-foreground">{formatNumber(property.enquiries)}</p>
                <p className="text-xs text-foreground-muted">Enquiries</p>
              </div>
              <div className="text-center">
                <Bookmark className="mx-auto mb-1 h-4 w-4 text-foreground-muted" />
                <p className="font-display text-lg font-bold text-foreground">{formatNumber(property.saves)}</p>
                <p className="text-xs text-foreground-muted">Saves</p>
              </div>
            </CardContent>
          </Card>

          <ListingCompleteness property={property} />

          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials(property.owner.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{property.owner.name}</p>
                  <p className="text-xs text-foreground-muted">Property Owner</p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-sm text-foreground-muted">
                <Phone className="h-3.5 w-3.5" /> {property.owner.phone}
              </p>
              <p className="flex items-center gap-2 text-sm text-foreground-muted">
                <Mail className="h-3.5 w-3.5" /> {property.owner.email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Agent</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={property.agent.avatar} alt={property.agent.name} />
                <AvatarFallback>{initials(property.agent.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{property.agent.name}</p>
                <p className="text-xs text-foreground-muted">Listing Agent</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <VerificationChecklist property={property} />
              {property.rera && (
                <div>
                  <p className="text-foreground-muted">RERA Number</p>
                  <p className="font-medium text-foreground">{property.rera}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
