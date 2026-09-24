"use client";

import { Sparkles } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatIndianCurrency } from "@/lib/site/format";

export function DescriptionStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const values = watch();

  function generateDraft() {
    const bhkPart = values.bedrooms ? `${values.bedrooms} BHK ` : "";
    const parts = [
      `${bhkPart}${values.type} available for ${values.listingType === "Sale" ? "sale" : values.listingType === "Rent" ? "rent" : "PG accommodation"} in ${values.locality}, ${values.city}.`,
      values.carpetArea ? `Spread across ${values.carpetArea} sq.ft, this property offers a comfortable, well-planned layout.` : "",
      values.furnishing ? `Currently ${values.furnishing.toLowerCase()}.` : "",
      values.amenities?.length ? `Community amenities include ${values.amenities.slice(0, 4).join(", ")}.` : "",
      values.parking ? "Dedicated parking is available." : "",
      values.price ? `Priced at ${formatIndianCurrency(Number(values.price))}${values.listingType !== "Sale" ? "/month" : ""}.` : "",
      "Contact us to schedule a visit or ask any questions.",
    ];
    setValue("description", parts.filter(Boolean).join(" "), { shouldValidate: true });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["Property highlights", "Nearby landmark", "Special features", "Suitable for families"].map((prompt) => (
          <span key={prompt} className="rounded-full border border-border-subtle px-2.5 py-1 text-[11px] text-foreground-muted">
            {prompt}
          </span>
        ))}
      </div>

      <FormField label="Description" required error={errors.description?.message} htmlFor="description">
        <Textarea id="description" rows={7} placeholder="Describe your property's best features…" error={!!errors.description} {...register("description")} />
      </FormField>

      <Button type="button" variant="outline" size="sm" onClick={generateDraft} className="gap-1.5">
        <Sparkles className="h-3.5 w-3.5" /> Generate draft from my details
      </Button>
      <p className="text-xs text-foreground-muted">This creates a starting draft from the details you&apos;ve entered — always review and edit before publishing.</p>
    </div>
  );
}
