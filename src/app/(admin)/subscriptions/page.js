"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionsTable } from "@/components/subscriptions/subscriptions-table";
import { CouponsTable } from "@/components/subscriptions/CouponsTable";
import { CouponFormModal } from "@/components/subscriptions/CouponFormModal";
import { COUPONS as INITIAL_COUPONS } from "@/data/subscriptions";

export default function SubscriptionsPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [addCouponOpen, setAddCouponOpen] = useState(false);

  function handleCreateCoupon(data) {
    const maxIdNumber = coupons.reduce((max, c) => Math.max(max, Number(c.id.split("-")[1]) || 0), 6999);
    const newCoupon = { id: `CPN-${maxIdNumber + 1}`, ...data, timesUsed: 0 };
    setCoupons((prev) => [newCoupon, ...prev]);
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Plans & Subscribers</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <PageHeader title="Subscriptions" subtitle="Manage developer and agent subscription plans." />
          <SubscriptionsTable />
        </TabsContent>

        <TabsContent value="coupons" className="space-y-6">
          <PageHeader
            title="Coupons"
            subtitle="Create and manage discount coupons for subscription plans."
            actions={
              <Button onClick={() => setAddCouponOpen(true)}>
                <Plus className="h-4 w-4" />
                New Coupon
              </Button>
            }
          />
          <CouponsTable coupons={coupons} onCouponsChange={setCoupons} />
        </TabsContent>
      </Tabs>

      <CouponFormModal open={addCouponOpen} onOpenChange={setAddCouponOpen} onSave={handleCreateCoupon} />
    </div>
  );
}
