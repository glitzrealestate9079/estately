"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FACING_OPTIONS, FURNISHING_OPTIONS } from "@/lib/constants";
import { AREA_UNITS, AREA_UNIT_LABELS, convertAreaToSqft } from "@/lib/area-units";
import { formatNumber } from "@/lib/utils";

export function DetailsStep() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const areaUnit = watch("areaUnit");
  const plotArea = watch("plotArea");
  const state = watch("state");

  const showAreaHelper = Boolean(areaUnit) && areaUnit !== "sqft" && plotArea;
  const plotAreaSqft = showAreaHelper ? convertAreaToSqft(plotArea, areaUnit, state) : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="BHK / Bedrooms" error={errors.bedrooms?.message} htmlFor="bedrooms">
          <Input id="bedrooms" type="number" min="0" placeholder="3" {...register("bedrooms")} />
        </FormField>
        <FormField label="Bathrooms" error={errors.bathrooms?.message} htmlFor="bathrooms">
          <Input id="bathrooms" type="number" min="0" placeholder="2" {...register("bathrooms")} />
        </FormField>
        <FormField label="Balconies" error={errors.balconies?.message} htmlFor="balconies">
          <Input id="balconies" type="number" min="0" placeholder="1" {...register("balconies")} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FormField label="Carpet Area" required error={errors.carpetArea?.message} htmlFor="carpetArea">
          <Input id="carpetArea" type="number" min="0" placeholder="1850" error={!!errors.carpetArea} {...register("carpetArea")} />
        </FormField>
        <FormField label="Built-up Area" error={errors.builtUpArea?.message} htmlFor="builtUpArea">
          <Input id="builtUpArea" type="number" min="0" placeholder="2100" {...register("builtUpArea")} />
        </FormField>
        <FormField label="Plot Area" error={errors.plotArea?.message} htmlFor="plotArea">
          <Input id="plotArea" type="number" min="0" placeholder="—" {...register("plotArea")} />
          {showAreaHelper && (
            <p className="mt-1.5 text-xs text-foreground-muted">
              {plotAreaSqft !== null
                ? `≈ ${formatNumber(Math.round(plotAreaSqft))} sq.ft`
                : `Confirm manually — no standard ${AREA_UNIT_LABELS[areaUnit] ?? areaUnit} to sq.ft conversion for ${state || "this state"}.`}
            </p>
          )}
        </FormField>
        <FormField label="Area Unit" error={errors.areaUnit?.message}>
          <Controller
            control={control}
            name="areaUnit"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {AREA_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {AREA_UNIT_LABELS[unit]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Floor" error={errors.floor?.message} htmlFor="floor">
          <Input id="floor" type="number" min="0" placeholder="4" {...register("floor")} />
        </FormField>
        <FormField label="Total Floors" error={errors.totalFloors?.message} htmlFor="totalFloors">
          <Input id="totalFloors" type="number" min="0" placeholder="14" {...register("totalFloors")} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Facing" error={errors.facing?.message}>
          <Controller
            control={control}
            name="facing"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
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
        <FormField label="Furnishing" error={errors.furnishing?.message}>
          <Controller
            control={control}
            name="furnishing"
            render={({ field }) => (
              <Select value={field.value || undefined} onValueChange={field.onChange}>
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
      </div>

      <label className="flex items-center justify-between rounded-lg border border-border-subtle px-4 py-3">
        <span className="text-sm font-medium text-foreground">Parking Available</span>
        <Controller
          control={control}
          name="parking"
          render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
        />
      </label>
    </div>
  );
}
