import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PropertyImage } from "@/components/common/property-image";
import { imageForCity } from "@/data/property-images";

export function LocalityCard({ locality }) {
  const avgPrice = locality.intel?.avgPricePerSqft;
  return (
    <Link
      href={`/locality/${locality.id}`}
      className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div>
        <p className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <MapPin className="h-3.5 w-3.5" /> {locality.cityName}
        </p>
        <p className="mt-1 font-display text-base font-semibold text-foreground group-hover:text-primary-600">
          {locality.name}
        </p>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-foreground-muted">{locality.propertyCount} properties</p>
          {avgPrice && <p className="text-sm font-semibold text-foreground">₹{new Intl.NumberFormat("en-IN").format(avgPrice)}/sq.ft avg</p>}
        </div>
        <ArrowUpRight className="h-4 w-4 text-foreground-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-600" />
      </div>
    </Link>
  );
}

export function CityCard({ city, index = 0 }) {
  return (
    <Link
      href={`/city/${city.id}`}
      className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover sm:h-64"
    >
      <PropertyImage
        src={imageForCity(index)}
        alt=""
        className="transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5 transition-colors duration-500 group-hover:from-black/95" />
      <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 -translate-y-1 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-80" />
      <div className="relative p-4 sm:p-5">
        <span className="mb-2 block h-px w-8 bg-amber-300/80 transition-all duration-300 group-hover:w-12" />
        <p className="font-serif text-2xl italic leading-tight text-white sm:text-[26px]">{city.name}</p>
        <p className="mt-1.5 text-xs font-medium tracking-wide text-white/70">
          {city.propertyCount + city.projectCount} listings
        </p>
      </div>
    </Link>
  );
}
