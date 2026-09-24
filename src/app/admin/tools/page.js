import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmiCalculator } from "@/components/tools/EmiCalculator";
import { StampDutyEstimator } from "@/components/tools/StampDutyEstimator";
import { RentVsBuyCalculator } from "@/components/tools/RentVsBuyCalculator";

export const metadata = { title: "Tools" };

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tools"
        subtitle="Quick estimators to help you guide buyers through pricing and financing decisions."
      />

      <Tabs defaultValue="emi">
        <TabsList>
          <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
          <TabsTrigger value="stamp-duty">Stamp Duty Estimator</TabsTrigger>
          <TabsTrigger value="rent-vs-buy">Rent vs Buy</TabsTrigger>
        </TabsList>

        <TabsContent value="emi">
          <EmiCalculator />
        </TabsContent>

        <TabsContent value="stamp-duty">
          <StampDutyEstimator />
        </TabsContent>

        <TabsContent value="rent-vs-buy">
          <RentVsBuyCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
