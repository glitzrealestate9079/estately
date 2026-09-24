import { timeAgoLabel } from "@/lib/site/derived";

export { timeAgoLabel };

export function formatPrice(property) {
  const { price, listingType } = property;
  if (price === null || price === undefined) return "Price on request";
  const amount = formatIndianCurrency(price);
  if (listingType === "Rent") return `${amount}/month`;
  if (listingType === "PG") return `${amount}/month`;
  return amount;
}

export function formatIndianCurrency(value) {
  if (value === null || value === undefined) return "—";
  if (value >= 10000000) {
    const cr = value / 10000000;
    return `₹${trimDecimal(cr)} Cr`;
  }
  if (value >= 100000) {
    const l = value / 100000;
    return `₹${trimDecimal(l)} Lakh`;
  }
  if (value >= 1000) {
    return `₹${trimDecimal(value / 1000)}K`;
  }
  return `₹${value}`;
}

function trimDecimal(value) {
  const rounded = Math.round(value * 100) / 100;
  return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2).replace(/0$/, "");
}

export function formatPricePerSqft(property) {
  if (!property.pricePerSqft) return null;
  return `₹${new Intl.NumberFormat("en-IN").format(property.pricePerSqft)}/sq.ft`;
}

export function formatArea(property) {
  const value = property.carpetArea || property.plotArea || property.builtUpArea;
  if (!value) return null;
  return `${new Intl.NumberFormat("en-IN").format(value)} sq.ft`;
}

export function formatBhkLabel(property) {
  if (!property.bedrooms) return property.type;
  return `${property.bedrooms} BHK ${property.type}`;
}

export function formatMonthYear(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(dateStr));
}

export function formatCompactViews(value) {
  if (!value) return "0";
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
