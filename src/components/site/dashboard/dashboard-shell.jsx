"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "@/components/site/providers/site-provider";
import { deriveLeadsForListing } from "@/lib/site/template/dashboard-derive";

const NAV_ITEMS = [
  { key: "dashboard", href: "/dashboard", icon: "bi-grid", label: "Overview" },
  { key: "listings", href: "/dashboard/listings", icon: "bi-card-list", label: "Listings" },
  { key: "leads", href: "/dashboard/leads", icon: "bi-people", label: "Leads" },
  { key: "visits", href: "/dashboard/visits", icon: "bi-calendar-check", label: "Visits" },
  { key: "profile", href: "/dashboard/profile", icon: "bi-person", label: "Profile" },
];

function activeKeyFor(pathname) {
  const match = [...NAV_ITEMS].reverse().find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return match?.key ?? "dashboard";
}

// Ported from the prototype's Dash.mount()/dashShell() in dash-common.js —
// the shared sidebar + mobile tabs shell wrapping every seller-dashboard
// page, plus the same login-required gate.
export function DashboardShell({ children }) {
  const pathname = usePathname();
  const { mounted, auth, openAuthGate, myListings } = useSite();
  const active = activeKeyFor(pathname);
  const newLeadsCount = mounted
    ? myListings.flatMap(deriveLeadsForListing).filter((l) => l.status === "New").length
    : 0;

  if (!mounted) return null;

  if (!auth.isAuthenticated) {
    return (
      <main className="container" style={{ paddingTop: 28, paddingBottom: 28 }}>
        <div className="card card-pad-lg" style={{ maxWidth: 520, margin: "40px auto" }}>
          <div className="state">
            <i className="bi bi-lock state-ico info" />
            <h3>Log in to continue</h3>
            <p className="muted">Your listings, leads and visits are private. Log in with your mobile number to continue — you&apos;ll land right back here.</p>
            <button className="btn btn-primary btn-lg" onClick={() => openAuthGate(null, { title: "Log in to continue", description: "Your listings, leads and visits are private." })}>
              Log in with OTP
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="dash">
      <aside className="dash-side" aria-label="Dashboard">
        {NAV_ITEMS.map((item) => (
          <Link key={item.key} href={item.href} className={item.key === active ? "is-active" : ""} title={item.label}>
            <i className={`bi ${item.icon}`} /><span>{item.label}</span>
            {item.key === "leads" && newLeadsCount > 0 && <span className="count">{newLeadsCount}</span>}
          </Link>
        ))}
        <div className="divider" />
        <Link href="/post-property" title="Post property"><i className="bi bi-plus-square" /><span>Post property</span></Link>
        <Link href="/" title="Back to search"><i className="bi bi-search" /><span>Browse properties</span></Link>
      </aside>
      <div className="dash-main">
        <div className="tabs dash-tabs mb-16" style={{ display: "none" }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} className={`tab ${item.key === active ? "is-active" : ""}`} href={item.href}>
              {item.label}
              {item.key === "leads" && newLeadsCount > 0 && <span className="count">{newLeadsCount}</span>}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
