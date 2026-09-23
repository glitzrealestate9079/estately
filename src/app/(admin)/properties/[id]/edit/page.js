import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { PropertyWizard } from "@/components/properties/form/property-wizard";
import { getPropertyById, PROPERTIES } from "@/data/properties";

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  return { title: property ? `Edit ${property.title}` : "Edit Property" };
}

export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  const defaultValues = {
    title: property.title,
    propertyType: property.type,
    listingType: property.listingType,
    description: property.description,
    country: "India",
    state: "",
    city: property.location.city,
    locality: property.location.locality,
    address: property.address,
    pincode: "",
    latitude: "",
    longitude: "",
    bedrooms: property.bedrooms ?? "",
    bathrooms: property.bathrooms ?? "",
    balconies: property.balconies ?? "",
    carpetArea: property.carpetArea ?? "",
    builtUpArea: property.builtUpArea ?? "",
    plotArea: property.plotArea ?? "",
    floor: property.floor ?? "",
    totalFloors: property.totalFloors ?? "",
    facing: property.facing ?? "",
    furnishing: property.furnishing ?? "",
    parking: !!property.parking,
    price: property.price,
    pricePerSqft: property.pricePerSqft ?? "",
    maintenance: "",
    securityDeposit: "",
    amenities: property.amenities ?? [],
    images: property.images.map((url, i) => ({ id: `${property.id}-${i}`, url, name: `${property.id}-${i}` })),
    video: "",
    floorPlan: "",
    ownerName: property.owner.name,
    ownerPhone: property.owner.phone,
    ownerEmail: property.owner.email,
    sellerType: property.sellerType ?? "Owner",
    areaUnit: property.areaUnit ?? "sqft",
    reraNumber: property.rera ?? "",
    reraAuthority: property.reraAuthority ?? "",
    reraStatus: property.reraStatus ?? "Not Applicable",
    phoneVerified: property.phoneVerified ?? false,
    identityVerified: property.identityVerified ?? "Pending",
    propertyVerified: property.propertyVerified ?? "Pending",
    verificationStatus: property.verified ? "Verified" : "Pending",
  };

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit Property`} subtitle={`Updating ${property.id} · ${property.title}`} />
      <PropertyWizard mode="edit" defaultValues={defaultValues} />
    </div>
  );
}
