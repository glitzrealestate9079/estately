"use client";

import { useState } from "react";
import Link from "next/link";
import { getPopularLocalities, getPopularCities, PROJECT_STATUS_OPTIONS } from "@/lib/site/site-data";
import { PG_ROOM_TYPES, COMMERCIAL_CATEGORIES, PLOT_TYPES } from "@/lib/site/derived";
import { SoonLink } from "@/components/site/ui/soon-link";

// Ported from the prototype's footerHtml()/footerDirectory() in app.js — same
// 6 tabs (sale/rent/pg/commercial/projects/houses) and the same multi-group
// layout per tab (locality lists, BHK/budget/furnishing bands, by-city links,
// etc.), rebuilt from real multi-city data instead of the prototype's
// hand-authored, single-city (Jaipur) link farm. Every link routes through
// this app's real filter query params (usePropertySearch()/applyFilters()),
// so every one of these links actually filters the destination page.
function qs(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

function L(label, route, params = {}) {
  return { label, href: `${route}${qs(params)}` };
}

function locLabel(l) {
  return `${l.name}, ${l.cityName}`;
}

function locParams(l, extra = {}) {
  return { city: l.cityName, locality: l.name, ...extra };
}

const BUDGET_SALE_BANDS = [
  ["Under ₹30 Lakh", "0", "3000000"],
  ["₹30 – ₹50 Lakh", "3000000", "5000000"],
  ["₹50 Lakh – ₹1 Cr", "5000000", "10000000"],
  ["₹1 – ₹2 Cr", "10000000", "20000000"],
  ["Above ₹2 Cr", "20000000", ""],
];

const BUDGET_RENT_BANDS = [
  ["Under ₹10,000", "0", "10000"],
  ["₹10,000 – ₹20,000", "10000", "20000"],
  ["₹20,000 – ₹35,000", "20000", "35000"],
  ["Above ₹35,000", "35000", ""],
];

const COMMERCIAL_LABEL = { Office: "Office space", Industrial: "Industrial building" };

function buildFooterDirectory(localities, cities) {
  const first7 = localities.slice(0, 7);
  const next7 = localities.slice(7, 14);

  return [
    {
      key: "sale",
      label: "Properties for Sale",
      groups: [
        ["Flats for Sale by Locality", first7.map((l) => L(`Flats for sale in ${locLabel(l)}`, "/buy", locParams(l, { propertyType: "Apartment" })))],
        [
          "Flats for Sale by BHK",
          [1, 2, 3, 4]
            .map((b) => L(`${b} BHK flats for sale`, "/buy", { bhk: String(b) }))
            .concat([
              L("Ready to move flats", "/buy", { possession: "Ready to Move" }),
              L("Under construction flats", "/buy", { possession: "Under Construction" }),
              L("Luxury flats (₹2 Cr+)", "/buy", { minPrice: "20000000" }),
            ]),
        ],
        ["Homes by Budget", BUDGET_SALE_BANDS.map(([t, min, max]) => L(`Homes ${t}`, "/buy", { minPrice: min, maxPrice: max }))],
        ["Property for Sale by City", cities.map((c) => L(`Property for sale in ${c.name}`, "/buy", { city: c.name }))],
        ["More Flats for Sale", next7.map((l) => L(`Flats for sale in ${locLabel(l)}`, "/buy", locParams(l, { propertyType: "Apartment" })))],
      ],
    },
    {
      key: "rent",
      label: "Flats for Rent",
      groups: [
        ["Flats for Rent by Locality", first7.map((l) => L(`Flats for rent in ${locLabel(l)}`, "/rent", locParams(l)))],
        ["Rentals by BHK", [1, 2, 3, 4].map((b) => L(`${b} BHK flats for rent`, "/rent", { bhk: String(b) }))],
        ["Rentals by Furnishing", ["Unfurnished", "Semi-Furnished", "Fully Furnished"].map((f) => L(`${f} flats for rent`, "/rent", { furnishing: f }))],
        ["Houses for Rent by Locality", localities.slice(0, 6).map((l) => L(`Houses for rent in ${locLabel(l)}`, "/rent", locParams(l, { propertyType: "Independent House" })))],
        ["Rent by Budget", BUDGET_RENT_BANDS.map(([t, min, max]) => L(`Flats for rent ${t}`, "/rent", { minPrice: min, maxPrice: max }))],
      ],
    },
    {
      key: "pg",
      label: "PG / Hostels",
      groups: [
        ["PG by Locality", first7.map((l) => L(`PG in ${locLabel(l)}`, "/pg", locParams(l)))],
        ["Boys PG by Locality", localities.slice(0, 6).map((l) => L(`Boys PG in ${locLabel(l)}`, "/pg", locParams(l, { gender: "Male" })))],
        ["Girls PG by Locality", localities.slice(0, 6).map((l) => L(`Girls PG in ${locLabel(l)}`, "/pg", locParams(l, { gender: "Female" })))],
        [
          "PG by Sharing",
          PG_ROOM_TYPES.map((r) => L(`${r.replace(" Sharing", "")} sharing PG`, "/pg", { roomType: r })).concat([
            L("PG near colleges", "/pg"),
            L("Co-living spaces", "/pg"),
          ]),
        ],
      ],
    },
    {
      key: "commercial",
      label: "Commercial",
      groups: [
        [
          "Commercial for Rent",
          COMMERCIAL_CATEGORIES.filter((t) => t !== "Commercial Land").map((t) =>
            L(`${COMMERCIAL_LABEL[t] ?? t} for rent`, "/commercial", { commercialCategory: t, listingType: "Rent" })
          ),
        ],
        [
          "Commercial for Sale",
          COMMERCIAL_CATEGORIES.map((t) => L(`${COMMERCIAL_LABEL[t] ?? t} for sale`, "/commercial", { commercialCategory: t, listingType: "Sale" })),
        ],
        ["Office Space by Locality", localities.slice(0, 6).map((l) => L(`Office space in ${locLabel(l)}`, "/commercial", locParams(l, { commercialCategory: "Office" })))],
        [
          "Shops & Warehouses",
          [
            L(`Shops for rent in ${locLabel(localities[0])}`, "/commercial", locParams(localities[0], { commercialCategory: "Shop", listingType: "Rent" })),
            L(`Shops for rent in ${locLabel(localities[1])}`, "/commercial", locParams(localities[1], { commercialCategory: "Shop", listingType: "Rent" })),
            L(`Warehouse in ${locLabel(localities[2])}`, "/commercial", locParams(localities[2], { commercialCategory: "Warehouse" })),
            L(`Warehouse in ${locLabel(localities[3])}`, "/commercial", locParams(localities[3], { commercialCategory: "Warehouse" })),
            L(`Industrial shed in ${locLabel(localities[4])}`, "/commercial", locParams(localities[4], { commercialCategory: "Industrial" })),
          ],
        ],
      ],
    },
    {
      key: "projects",
      label: "New Projects & Plots",
      groups: [
        ["New Projects by Locality", first7.map((l) => L(`New projects in ${locLabel(l)}`, "/projects", locParams(l)))],
        ["Projects by Status", PROJECT_STATUS_OPTIONS.map((st) => L(`${st} projects`, "/projects", { status: st }))],
        ["Plots for Sale by Locality", localities.slice(0, 6).map((l) => L(`Plots in ${locLabel(l)}`, "/plots", locParams(l)))],
        ["Land by Type", PLOT_TYPES.map((t) => L(`${t} for sale`, "/plots", { plotType: t })).concat([L("Explore all plots & land", "/plots")])],
      ],
    },
    {
      key: "houses",
      label: "Independent Houses & Villas",
      groups: [
        ["Villas by Locality", first7.map((l) => L(`Villas in ${locLabel(l)}`, "/buy", locParams(l, { propertyType: "Villa" })))],
        ["Independent Houses by Locality", first7.map((l) => L(`Independent house in ${locLabel(l)}`, "/buy", locParams(l, { propertyType: "Independent House" })))],
        ["Houses by BHK", [2, 3, 4, 5].map((b) => L(`${b} BHK independent house`, "/buy", { propertyType: "Independent House", bhk: String(b) }))],
      ],
    },
  ];
}

const GUIDES = [
  "Home Loan EMI Calculator",
  "Home Loan Eligibility Calculator",
  "Apply for Home Loan",
  "Home Loan Balance Transfer",
  "Compare Home Loan Interest",
  "Property Buyers Guide",
  "Property Sellers Guide",
  "Tenant Guide",
  "Landlord Guide",
  "NRI Real Estate Guide",
  "Real Estate Vastu Guide",
  "Real Estate Legal Guide",
  "RERA Guide",
  "Due Diligence Service",
];

const SERVICES = [
  ["Rent Agreement", "/services"],
  ["Property Valuation", "/services"],
  ["Packers & Movers"],
  ["Home Cleaning"],
  ["Painting Services"],
  ["Interior Design"],
  ["Property Management"],
  ["Legal Services"],
  ["Plumbing Services"],
  ["Electrician Services"],
  ["Carpentry Services"],
  ["AC Services"],
  ["Notary Services"],
];

export function SiteFooter() {
  const localities = getPopularLocalities(14);
  const cities = getPopularCities(8);
  const directory = buildFooterDirectory(localities, cities);
  const [activeTab, setActiveTab] = useState(directory[0].key);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <div className="footer-cta-text">
            <h3>Have a property to sell or rent?</h3>
            <p>List it free on Estately and reach verified buyers and tenants across India.</p>
          </div>
          <div className="footer-cta-actions">
            <Link className="btn btn-accent" href="/post-property">
              <i className="bi bi-plus-lg" />Post Property Free
            </Link>
            <Link className="btn footer-cta-ghost" href="/search">
              <i className="bi bi-search" />Browse listings
            </Link>
          </div>
        </div>

        <div className="footer-dir">
          <div className="footer-tabs" role="tablist" aria-label="Browse properties">
            {directory.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                className={`footer-tab ${activeTab === tab.key ? "is-active" : ""}`}
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {directory.map((tab) => (
            <div key={tab.key} className="footer-panel" role="tabpanel" hidden={activeTab !== tab.key}>
              {tab.groups.map(([heading, links]) => (
                <div key={heading} className="footer-group">
                  <h4>{heading}</h4>
                  {links.map((l) => (
                    <Link key={l.label} href={l.href}>{l.label}</Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-tags">
          <div>
            <h4>Guides &amp; tools</h4>
            <div className="footer-tag-list">
              {GUIDES.map((label) => (
                <SoonLink key={label}>{label}</SoonLink>
              ))}
            </div>
          </div>
          <div>
            <h4>Home services</h4>
            <div className="footer-tag-list">
              {SERVICES.map(([label, href]) =>
                href ? (
                  <Link key={label} href={href}>{label}</Link>
                ) : (
                  <SoonLink key={label}>{label}</SoonLink>
                )
              )}
            </div>
          </div>
        </div>

        <div className="footer-card">
          <div className="footer-brand-row">
            <div className="footer-brand">
              <Link className="logo logo-img" href="/" aria-label="Home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/site/header-logo.png" alt="Glitz Technology" />
              </Link>
              <p className="footer-note">
                A search-first property marketplace for buying, renting and listing homes, PGs, plots and commercial spaces across India.
              </p>
            </div>
            <div className="footer-connect">
              <div className="footer-apps">
                <span className="footer-label">Get the Estately app</span>
                <div className="app-badges">
                  <SoonLink className="app-badge" aria-label="Get it on Google Play">
                    <i className="bi bi-google-play" /><span><small>GET IT ON</small>Google Play</span>
                  </SoonLink>
                  <SoonLink className="app-badge" aria-label="Download on the App Store">
                    <i className="bi bi-apple" /><span><small>Download on the</small>App Store</span>
                  </SoonLink>
                </div>
              </div>
              <div className="footer-follow">
                <span className="footer-label">Follow us</span>
                <div className="footer-social">
                  <SoonLink aria-label="Facebook"><i className="bi bi-facebook" /></SoonLink>
                  <SoonLink aria-label="Instagram"><i className="bi bi-instagram" /></SoonLink>
                  <SoonLink aria-label="X"><i className="bi bi-twitter-x" /></SoonLink>
                  <SoonLink aria-label="LinkedIn"><i className="bi bi-linkedin" /></SoonLink>
                  <SoonLink aria-label="YouTube"><i className="bi bi-youtube" /></SoonLink>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-card-foot">
            <nav className="footer-links" aria-label="Company">
              <SoonLink>About Us</SoonLink>
              <SoonLink>Careers</SoonLink>
              <SoonLink>Terms &amp; Conditions</SoonLink>
              <SoonLink>Privacy Policy</SoonLink>
              <SoonLink>Testimonials</SoonLink>
              <SoonLink>Sitemap</SoonLink>
              <SoonLink>FAQs</SoonLink>
              <SoonLink>RERA / Legal</SoonLink>
            </nav>
            <p className="footer-disclaimer">
              <i className="bi bi-info-circle" /> Sample marketplace — listings, people, developers and RERA numbers shown are demo data.
            </p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>© 2026 Estately. All rights reserved.</span>
          <span className="footer-credit">Designed &amp; built by Glitz Technology</span>
        </div>
      </div>
    </footer>
  );
}
