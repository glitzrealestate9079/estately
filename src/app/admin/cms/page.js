import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannersSection } from "@/components/cms/BannersSection";
import { BlogsSection } from "@/components/cms/BlogsSection";
import { FaqsSection } from "@/components/cms/FaqsSection";

export const metadata = { title: "CMS / Content" };

export default function CmsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="CMS / Content" subtitle="Manage homepage banners, blog posts and FAQs." />

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <BannersSection />
        </TabsContent>

        <TabsContent value="blogs">
          <BlogsSection />
        </TabsContent>

        <TabsContent value="faqs">
          <FaqsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
