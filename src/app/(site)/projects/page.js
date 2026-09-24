"use client";

import { useMemo, useState } from "react";
import { FolderKanban } from "lucide-react";
import { ProjectCard } from "@/components/site/project/project-card";
import { RevealGroup, RevealItem } from "@/components/site/ui/reveal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { PROJECTS } from "@/data/projects";
import { applyProjectFilters, PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS, PUBLIC_CITIES } from "@/lib/site/site-data";

export default function ProjectsPage() {
  const [city, setCity] = useState("any");
  const [status, setStatus] = useState("any");
  const [propertyType, setPropertyType] = useState("any");
  const [sortKey, setSortKey] = useState("newest");

  const filtered = useMemo(() => {
    const results = applyProjectFilters(PROJECTS, { city: city === "any" ? "" : city, status, propertyType });
    const sorted = [...results];
    if (sortKey === "price-asc") sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    else if (sortKey === "price-desc") sorted.sort((a, b) => b.startingPrice - a.startingPrice);
    else if (sortKey === "possession") sorted.sort((a, b) => new Date(a.possessionDate) - new Date(b.possessionDate));
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
  }, [city, status, propertyType, sortKey]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground sm:text-2xl">
        <FolderKanban className="h-5 w-5 text-primary-600" /> New &amp; Upcoming Projects
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">{filtered.length} projects from verified developers across India.</p>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any city</SelectItem>
            {PUBLIC_CITIES.filter((c) => c.projectCount > 0).map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Project status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any status</SelectItem>
            {PROJECT_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any type</SelectItem>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={setSortKey}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="possession">Possession: Soonest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <EmptyState icon={FolderKanban} title="No projects match these filters" description="Try a different city or project status." />
        ) : (
          <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <RevealItem key={project.id}>
                <ProjectCard project={project} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </div>
  );
}
