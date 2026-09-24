import { PostPropertyWizard } from "@/components/site/post-property/post-property-wizard";

export const metadata = {
  title: "Post Your Property — FREE",
  description: "List your property for sale, rent or PG in a few guided steps — completely free for individual owners.",
};

export default function PostPropertyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Post Your Property</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Reach thousands of active buyers and tenants — free for individual owners.
        </p>
      </div>
      <PostPropertyWizard />
    </div>
  );
}
