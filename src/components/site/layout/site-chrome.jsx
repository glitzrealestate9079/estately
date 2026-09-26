"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site/layout/site-header";
import { SiteFooter } from "@/components/site/layout/site-footer";
import { MobileBottomNav } from "@/components/site/layout/mobile-bottom-nav";
import { AuthModal } from "@/components/site/auth/auth-modal";
import { CompareTray } from "@/components/site/compare/compare-tray";

// The prototype's post-property.html and login.html both call
// App.init({ noBottomNav: true }) — post-property is a dedicated full-screen
// wizard shell with its own fixed .wz-footer action bar, which would
// otherwise visually collide with the site's normal bottom nav underneath it;
// login is a focused auth screen. Every other page keeps the bottom nav.
const NO_BOTTOM_NAV_PREFIXES = ["/post-property", "/login"];

// None of dashboard.html/listings.html/listing-detail.html/leads.html/
// visits.html/profile.html/login.html/post-property.html have a
// <div data-footer> placeholder at all in the prototype — footerHtml() only
// ever mounts into pages that declare one — so the seller dashboard shell and
// these two focused-task pages never show the marketing footer. Every other
// page keeps it.
const NO_FOOTER_PREFIXES = ["/dashboard", "/login", "/post-property"];

// Matches the prototype's per-page `noCompareTray: true` opt-outs (app.js
// pages/{compare,dashboard,leads,listing-detail,listings,login,post-property,
// profile,visits}.js) — everywhere else keeps the floating compare tray.
const NO_COMPARE_TRAY_PREFIXES = ["/compare", "/dashboard", "/login", "/post-property"];

function matchesPrefix(pathname, prefixes) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteChrome({ children }) {
  const pathname = usePathname();
  const noBottomNav = matchesPrefix(pathname, NO_BOTTOM_NAV_PREFIXES);
  const noFooter = matchesPrefix(pathname, NO_FOOTER_PREFIXES);
  const noCompareTray = matchesPrefix(pathname, NO_COMPARE_TRAY_PREFIXES);

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      {!noFooter && <SiteFooter />}
      {!noBottomNav && <MobileBottomNav />}
      {!noCompareTray && <CompareTray />}
      <AuthModal />
    </>
  );
}
