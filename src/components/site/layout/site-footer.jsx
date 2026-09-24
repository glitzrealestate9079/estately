import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { getPopularCities } from "@/lib/site/site-data";
import { PROPERTY_TYPES } from "@/lib/constants";

const PROPERTY_TYPE_LINKS = [
  { label: "Flats for Sale", href: "/buy" },
  { label: "Flats for Rent", href: "/rent" },
  { label: "PG / Co-living", href: "/pg" },
  { label: "Commercial Property", href: "/commercial" },
  { label: "Plots & Land", href: "/plots" },
  { label: "New Projects", href: "/projects" },
];

const COMPANY_LINKS = [
  { label: "About Estately", href: "/services" },
  { label: "Our Services", href: "/services" },
  { label: "Blog & Guides", href: "/blog" },
  { label: "Post a Property — FREE", href: "/post-property" },
  { label: "Owner Dashboard", href: "/dashboard" },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: "/blog" },
  { label: "Privacy Policy", href: "/blog" },
  { label: "Safety & Fraud Guide", href: "/blog" },
  { label: "Sitemap", href: "/blog" },
];

const SOCIAL_LINKS = [
  { label: "f", name: "Facebook", href: "https://facebook.com/estately" },
  { label: "IG", name: "Instagram", href: "https://instagram.com/estately" },
  { label: "X", name: "X (Twitter)", href: "https://x.com/estately" },
  { label: "in", name: "LinkedIn", href: "https://linkedin.com/company/estately" },
];

export function SiteFooter() {
  const cities = getPopularCities(10);

  return (
    <footer className="border-t border-border-subtle bg-navy-950 text-navy-200">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-navy-700 text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold text-white">Estately</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
              A trusted property marketplace that helps you discover, compare and connect with verified
              owners, agents and builders across India — for buying, renting, PG stays, commercial spaces
              and plots.
            </p>
            <div className="mt-5 space-y-2 text-sm text-navy-300">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400" /> 1800-123-4567 (Toll-free)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400" /> support@estately.example
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-400" /> Jaipur, Rajasthan, India
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, name, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[11px] font-bold text-navy-300 transition-colors hover:bg-primary-600 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Explore Properties" links={PROPERTY_TYPE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal & Safety" links={LEGAL_LINKS} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-400">
            Popular Cities
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {cities.map((city) => (
              <Link key={city.id} href={`/city/${city.id}`} className="text-sm text-navy-300 hover:text-white">
                Properties in {city.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-400">
            Popular Property Searches
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {PROPERTY_TYPES.map((type) => (
              <Link
                key={type}
                href={`/buy?propertyType=${encodeURIComponent(type)}`}
                className="text-sm text-navy-300 hover:text-white"
              >
                {type} for Sale
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Estately Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Made for buyers, tenants, owners, agents &amp; builders across India.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-navy-400">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-navy-300 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
