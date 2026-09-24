import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DeveloperProfileTabs } from "@/components/developers/DeveloperProfileTabs";
import { DEVELOPERS, getDeveloperById } from "@/data/developers";

export function generateStaticParams() {
  return DEVELOPERS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const developer = getDeveloperById(id);
  return { title: developer ? developer.name : "Developer" };
}

export default async function DeveloperDetailPage({ params }) {
  const { id } = await params;
  const developer = getDeveloperById(id);
  if (!developer) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={developer.name}
        subtitle={`${developer.id} · ${developer.city}`}
        actions={
          <>
            <StatusBadge status={developer.status} />
            <Button variant="outline" asChild>
              <Link href="/admin/developers">
                <ArrowLeft className="h-4 w-4" />
                Back to Developers
              </Link>
            </Button>
          </>
        }
      />
      <DeveloperProfileTabs developer={developer} />
    </div>
  );
}
