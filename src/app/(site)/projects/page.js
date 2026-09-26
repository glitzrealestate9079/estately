import { Suspense } from "react";
import { ProjectSearchExperience } from "@/components/site/search/project-search-experience";

export const metadata = {
  title: "New Projects",
  description: "Explore new and upcoming residential and commercial projects from verified developers across India.",
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={null}>
      <ProjectSearchExperience />
    </Suspense>
  );
}
