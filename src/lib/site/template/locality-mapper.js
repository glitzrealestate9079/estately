import { imageForCity } from "@/data/property-images";
import { deriveLocalityRating, deriveLocalityTrend, deriveLocalityImageIndex } from "@/lib/site/derived";

// Reshapes a PUBLIC_LOCALITIES entry (src/lib/site/site-data.js) into the
// field vocabulary the ported HomePlace template's locality card expects.
// `intel` (richer price data) isn't guaranteed for every locality — falls
// back to a reasonable flat estimate when absent, same spirit as the rest
// of this mapping layer.
export function toTemplateLocality(locality) {
  const avg = locality.intel?.avgPricePerSqft ?? 6200;
  const rentMin = locality.intel?.rentRangeMin ?? 15000;
  const rentMax = locality.intel?.rentRangeMax ?? 28000;
  return {
    slug: locality.id,
    name: locality.name,
    zone: locality.cityName,
    img: imageForCity(deriveLocalityImageIndex(locality)),
    rating: deriveLocalityRating(locality),
    avg,
    rent: [rentMin, rentMax],
    count: locality.propertyCount,
    trend: deriveLocalityTrend(avg),
    distanceKm: locality.distanceKm,
    _locality: locality,
  };
}
