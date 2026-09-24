"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FACING_OPTIONS, FURNISHING_OPTIONS } from "@/lib/constants";

const PLOT_TYPES = new Set(["Plot"]);
const COMMERCIAL_TYPES = new Set(["Commercial", "Office Space"]);
const PG_TYPES = new Set(["PG / Co-living"]);

export function DetailsStep() {
  const { register, control, watch, formState: { errors } } = useFormContext();
  const type = watch("type");
  const isPlot = PLOT_TYPES.has(type);
  const isCommercial = COMMERCIAL_TYPES.has(type);
  const isPg = PG_TYPES.has(type);
  const isResidential = !isPlot && !isCommercial && !isPg;

  return (
    <div className="space-y-5">
      <FormField label="Listing Title" required error={errors.title?.message} htmlFor="title" hint="Keep it clear and specific — it's the first thing buyers see.">
        <Input id="title" placeholder="e.g. Spacious 3 BHK Apartment near Metro" error={!!errors.title} {...register("title")} />
      </FormField>

      {(isResidential || isPg) && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
          <FormField label={isPg ? "Rooms Available" : "Bedrooms"} error={errors.bedrooms?.message} htmlFor="bedrooms">
            <Input id="bedrooms" type="number" min={0} error={!!errors.bedrooms} {...register("bedrooms")} />
          </FormField>
          <FormField label="Bathrooms" error={errors.bathrooms?.message} htmlFor="bathrooms">
            <Input id="bathrooms" type="number" min={0} error={!!errors.bathrooms} {...register("bathrooms")} />
          </FormField>
          {isResidential && (
            <FormField label="Balconies" error={errors.balconies?.message} htmlFor="balconies">
              <Input id="balconies" type="number" min={0} error={!!errors.balconies} {...register("balconies")} />
            </FormField>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <FormField label={isPlot ? "Plot Area (sq.ft)" : "Carpet Area (sq.ft)"} required error={errors.carpetArea?.message} htmlFor="carpetArea">
          <Input id="carpetArea" type="number" min={0} error={!!errors.carpetArea} {...register("carpetArea")} />
        </FormField>
        {!isPlot && !isPg && (
          <FormField label="Built-up Area (sq.ft)" error={errors.builtUpArea?.message} htmlFor="builtUpArea">
            <Input id="builtUpArea" type="number" min={0} error={!!errors.builtUpArea} {...register("builtUpArea")} />
          </FormField>
        )}
      </div>

      {!isPlot && (
        <div className="grid grid-cols-2 gap-5">
          <FormField label="Floor" error={errors.floor?.message} htmlFor="floor">
            <Input id="floor" type="number" min={0} error={!!errors.floor} {...register("floor")} />
          </FormField>
          <FormField label="Total Floors" error={errors.totalFloors?.message} htmlFor="totalFloors">
            <Input id="totalFloors" type="number" min={0} error={!!errors.totalFloors} {...register("totalFloors")} />
          </FormField>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <FormField label="Facing" error={errors.facing?.message}>
          <Controller
            control={control}
            name="facing"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facing" />
                </SelectTrigger>
                <SelectContent>
                  {FACING_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        {!isPlot && (
          <FormField label="Furnishing" error={errors.furnishing?.message}>
            <Controller
              control={control}
              name="furnishing"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    {FURNISHING_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        )}
      </div>

      {!isPlot && (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
          <Controller control={control} name="parking" render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />} />
          Parking available
        </label>
      )}
    </div>
  );
}
