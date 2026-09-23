"use client";

import Link from "next/link";
import { Eye, MessageSquare, Bookmark, Pencil, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/common/row-actions";
import { PropertyImage } from "@/components/common/property-image";
import { Button } from "@/components/ui/button";
import { TOP_PERFORMING_PROPERTIES } from "@/data/properties";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function TopPropertiesTable() {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <div>
          <CardTitle>Top Performing Properties</CardTitle>
          <CardDescription>Ranked by views over the selected period</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/properties">View all</Link>
        </Button>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>
              <Eye className="h-3.5 w-3.5" />
            </TableHead>
            <TableHead>
              <MessageSquare className="h-3.5 w-3.5" />
            </TableHead>
            <TableHead>
              <Bookmark className="h-3.5 w-3.5" />
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TOP_PERFORMING_PROPERTIES.map((property) => (
            <TableRow key={property.id}>
              <TableCell>
                <Link href={`/properties/${property.id}`} className="flex items-center gap-3">
                  <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg">
                    <PropertyImage src={property.images[0]} alt={property.title} />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                      {property.title}
                      {property.featured && <Badge variant="featured">Featured</Badge>}
                    </p>
                    <p className="truncate text-xs text-foreground-muted">
                      {property.location.locality}, {property.location.city}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="text-sm text-foreground-muted">{property.type}</TableCell>
              <TableCell className="text-sm font-semibold">{formatCurrency(property.price)}</TableCell>
              <TableCell className="text-sm">{formatNumber(property.views)}</TableCell>
              <TableCell className="text-sm">{formatNumber(property.enquiries)}</TableCell>
              <TableCell className="text-sm">{formatNumber(property.saves)}</TableCell>
              <TableCell>
                <StatusBadge status={property.status} />
              </TableCell>
              <TableCell className="text-right">
                <RowActions
                  actions={[
                    { label: "View", icon: Eye, onClick: () => toast.info(`Opening ${property.title}`) },
                    { label: "Edit", icon: Pencil, onClick: () => toast.info(`Editing ${property.title}`) },
                    {
                      label: "Approve",
                      icon: CheckCircle2,
                      onClick: () => toast.success(`${property.title} approved successfully`),
                    },
                    {
                      label: "Reject",
                      icon: XCircle,
                      onClick: () => toast.warning(`${property.title} rejected`),
                    },
                    {
                      label: "Delete",
                      icon: Trash2,
                      destructive: true,
                      onClick: () => toast.success(`${property.title} deleted successfully`),
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
