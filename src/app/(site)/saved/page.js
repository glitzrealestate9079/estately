"use client";

import { useState } from "react";
import Link from "next/link";
import { PropertyCard } from "@/components/site/property/property-card";
import { ProjectCard } from "@/components/site/project/project-card";
import { useSite } from "@/components/site/providers/site-provider";
import { PROPERTIES } from "@/data/properties";
import { PROJECTS } from "@/data/projects";
import { getCategoryKeyForProperty } from "@/lib/site/categories";
import { toTemplateProperty } from "@/lib/site/template/property-mapper";
import { toTemplateProject } from "@/lib/site/template/project-mapper";

const TABS = [
  ["all", "All"], ["buy", "Buy"], ["rent", "Rent"], ["pg", "PG"], ["commercial", "Commercial"], ["plot", "Plots"], ["project", "Projects"],
];

export default function SavedPage() {
  const { savedIds, mounted, auth, openAuthGate } = useSite();
  const [tab, setTab] = useState("all");

  if (!mounted) return null;

  if (!auth.isAuthenticated) {
    return (
      <main className="container-narrow">
        <h1>My Saved Properties</h1>
        <div className="card mt-16">
          <div className="state">
            <i className="bi bi-heart state-ico info" />
            <h3>Log in to see your shortlist</h3>
            <p className="muted">Tap the heart on any property to save it. Your saved properties stay in sync on every device.</p>
            <div className="row-wrap" style={{ justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={() => openAuthGate(null, { title: "Log in to see your shortlist" })}>Log in with OTP</button>
              <Link className="btn btn-outline" href="/buy">Browse properties</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const properties = savedIds
    .map((id) => PROPERTIES.find((p) => p.id === id))
    .filter(Boolean)
    .map((raw) => toTemplateProperty(raw, getCategoryKeyForProperty(raw)));
  const projects = savedIds
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter(Boolean)
    .map((raw) => ({ ...toTemplateProject(raw), cat: "project" }));
  const all = [...properties, ...projects];
  const list = all.filter((p) => tab === "all" || p.cat === tab);

  return (
    <main className="container">
      <div className="page-head between" style={{ flexWrap: "wrap" }}>
        <div>
          <h1>My Saved Properties</h1>
          <p>{all.length ? `${all.length} saved · tick “Compare” on up to 4 to compare them` : "Your shortlist"}</p>
        </div>
        {all.length > 0 && <Link className="btn btn-outline" href="/compare"><i className="bi bi-layout-three-columns" />Compare</Link>}
      </div>

      {all.length > 0 && (
        <div className="tabs mt-16 mb-24">
          {TABS.filter(([k]) => k === "all" || all.some((p) => p.cat === k)).map(([k, l]) => (
            <button key={k} type="button" className={`tab ${tab === k ? "is-active" : ""}`} onClick={() => setTab(k)}>
              {l}<span className="count">{k === "all" ? all.length : all.filter((p) => p.cat === k).length}</span>
            </button>
          ))}
        </div>
      )}

      {all.length === 0 ? (
        <div className="card mt-16">
          <div className="state">
            <i className="bi bi-heart state-ico" />
            <h3>No saved properties yet</h3>
            <p className="muted">Tap the ♡ on any listing to add it here. Saving is instant, and you can remove it anytime.</p>
            <Link className="btn btn-primary" href="/buy">Start searching</Link>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {list.map((p) => (
            p.cat === "project" ? <ProjectCard key={p.id} project={p} /> : <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      <p className="xs muted mt-24"><i className="bi bi-folder2" /> Shortlist folders (e.g. &ldquo;Weekend visits&rdquo;) are planned for a later release.</p>
    </main>
  );
}
