"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "@/components/site/providers/site-provider";

// Ported from the prototype's NAV array (assets/js/app.js) — same flat,
// no-mega-menu nav the product spec calls for. Hrefs point at this app's
// real Next.js routes instead of the prototype's search.html?cat= scheme.
const NAV = [
  { key: "buy", label: "Buy", href: "/buy", icon: "bi-house-door" },
  { key: "rent", label: "Rent", href: "/rent", icon: "bi-key" },
  { key: "pg", label: "PG / Co-living", href: "/pg", icon: "bi-people" },
  { key: "project", label: "New Projects", href: "/projects", icon: "bi-buildings" },
  { key: "commercial", label: "Commercial", href: "/commercial", icon: "bi-shop" },
  { key: "plot", label: "Plots / Land", href: "/plots", icon: "bi-bounding-box" },
  { key: "services", label: "Services", href: "/services", icon: "bi-tools" },
];

function initials(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function BrandLogo() {
  return (
    <Link className="logo logo-img" href="/" aria-label="Home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/site/header-logo.png" alt="Glitz Technology" />
    </Link>
  );
}

function isActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

// The prototype's dashboard.html/listings.html/listing-detail.html/leads.html/
// visits.html/profile.html all call App.init({ fluid: true }), which mounts
// the header's inner wrapper as .container-fluid (near full viewport width)
// instead of the capped .container every other page uses — the seller
// dashboard is meant to feel like a wider, denser app shell, not the
// marketing site's narrower centered layout.
const FLUID_HEADER_PREFIX = "/dashboard";

function isFluidHeader(pathname) {
  return pathname === FLUID_HEADER_PREFIX || pathname.startsWith(`${FLUID_HEADER_PREFIX}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const { mounted, savedIds, auth, logout, openAuthGate } = useSite();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!acctOpen) return;
    function onDocClick() {
      setAcctOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [acctOpen]);

  // Close the drawer on navigation without an effect (react-hooks/set-state-in-effect):
  // adjust state during render, guarded so it fires once per pathname change.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  const savedCount = mounted ? savedIds.length : 0;
  const user = mounted && auth.isAuthenticated ? auth.user : null;
  const fluid = isFluidHeader(pathname);

  function handleLogout() {
    logout();
    setAcctOpen(false);
  }

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className={`${fluid ? "container-fluid" : "container"} inner`}>
          <button className="icon-btn menu-toggle" aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <i className="bi bi-list" />
          </button>
          <BrandLogo />
          <nav className="main-nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={isActive(pathname, n.href) ? "is-active" : ""}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="btn btn-accent btn-post" href="/post-property">
              <i className="bi bi-plus-lg" />Post Property<span className="free-tag">FREE</span>
            </Link>
            {user ? (
              <div className={`dropdown ${acctOpen ? "is-open" : ""}`}>
                <button
                  className="avatar-btn"
                  aria-haspopup="menu"
                  aria-label="Account menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAcctOpen((v) => !v);
                  }}
                >
                  <span className="avatar">{initials(user.name)}</span>
                  <span className="avatar-meta hide-mobile">
                    <b>{user.name.split(" ")[0]}</b>
                    <small>My account</small>
                  </span>
                  <i className="bi bi-chevron-down avatar-caret hide-mobile" />
                </button>
                <div className="dropdown-menu" role="menu">
                  <div className="menu-head">
                    <span className="avatar">{initials(user.name)}</span>
                    <div>
                      <div className="strong">{user.name}</div>
                      <div className="xs muted">{user.phone} · {user.type}</div>
                    </div>
                  </div>
                  <Link href="/dashboard"><i className="bi bi-grid" />Seller dashboard</Link>
                  <Link href="/dashboard/listings"><i className="bi bi-card-list" />My listings</Link>
                  <Link href="/saved">
                    <i className="bi bi-heart" />Saved properties
                    {savedCount > 0 && <span className="badge badge-sm" style={{ marginLeft: "auto" }}>{savedCount}</span>}
                  </Link>
                  <Link href="/saved-searches"><i className="bi bi-bookmark" />My searches</Link>
                  <Link href="/compare"><i className="bi bi-layout-three-columns" />Compare</Link>
                  <Link href="/dashboard/profile"><i className="bi bi-person" />Profile</Link>
                  <hr />
                  <button onClick={handleLogout}><i className="bi bi-box-arrow-right" />Log out</button>
                </div>
              </div>
            ) : (
              <>
                <button className="btn btn-login" onClick={() => openAuthGate(null)}>
                  <i className="bi bi-person" />Login
                </button>
                <button className="icon-btn show-mobile" aria-label="Log in" onClick={() => openAuthGate(null)}>
                  <i className="bi bi-person-circle" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <aside className={`drawer ${drawerOpen ? "is-open" : ""}`} aria-label="Menu">
        <div className="drawer-head">
          <BrandLogo />
          <button className="modal-x" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="drawer-body">
          <div className="group-label">Explore</div>
          {NAV.map((n) => (
            <Link key={n.key} href={n.href}>
              <i className={`bi ${n.icon}`} />{n.label}
            </Link>
          ))}
          <div className="group-label">Discover</div>
          <Link href="/search"><i className="bi bi-pin-map" />Browse by city</Link>
          <Link href="/search"><i className="bi bi-geo-alt" />Locality guides</Link>
          <Link href="/compare"><i className="bi bi-layout-three-columns" />Compare</Link>
          <div className="group-label">For sellers</div>
          <Link href="/post-property"><i className="bi bi-plus-square" />Post Property — free</Link>
          <Link href="/dashboard"><i className="bi bi-grid" />Seller dashboard</Link>
        </div>
      </aside>
      <div className={`drawer-backdrop ${drawerOpen ? "is-open" : ""}`} onClick={() => setDrawerOpen(false)} />
    </>
  );
}
