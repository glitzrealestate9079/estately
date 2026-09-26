"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSite } from "@/components/site/providers/site-provider";
import { MobileSearchOverlay } from "@/components/site/home/mobile-search-overlay";

// Ported from the prototype's mountBottomNav() in app.js — same 5 items the
// product spec calls for (Home, Search, Saved, Post, Account). "Search"
// opens the same quick-search overlay as the prototype's openSearchOverlay().
function activeKeyFor(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/search")) return "search";
  if (pathname.startsWith("/saved")) return "saved";
  if (pathname.startsWith("/post-property")) return "post";
  if (pathname.startsWith("/dashboard")) return "account";
  return null;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { mounted, savedIds, auth, openAuthGate } = useSite();
  const [searchOpen, setSearchOpen] = useState(false);
  const active = activeKeyFor(pathname);
  const savedCount = mounted ? savedIds.length : 0;
  const user = mounted && auth.isAuthenticated ? auth.user : null;

  return (
    <>
      <nav className="bottom-nav" aria-label="Mobile">
        <Link href="/" className={active === "home" ? "is-active" : ""}>
          <i className={`bi bi-house${active === "home" ? "-fill" : ""}`} />Home
        </Link>
        <button className={active === "search" ? "is-active" : ""} onClick={() => setSearchOpen(true)}>
          <i className="bi bi-search" />Search
        </button>
        <Link href="/saved" className={active === "saved" ? "is-active" : ""}>
          <i className={`bi bi-heart${active === "saved" ? "-fill" : ""}`} />Saved
          {savedCount > 0 && <span className="count">{savedCount}</span>}
        </Link>
        <Link href="/post-property" className={active === "post" ? "is-active" : ""}>
          <span className="post-ico"><i className="bi bi-plus-lg" /></span>Post
        </Link>
        {user ? (
          <Link href="/dashboard" className={active === "account" ? "is-active" : ""}>
            <i className={`bi bi-person${active === "account" ? "-fill" : ""}`} />Account
          </Link>
        ) : (
          <button onClick={() => openAuthGate(null)}>
            <i className="bi bi-person" />Account
          </button>
        )}
      </nav>
      {searchOpen && <MobileSearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
