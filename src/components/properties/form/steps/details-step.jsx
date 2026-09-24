"use client";

import { Controller, useFormContext } from "react-hook-form";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  FACING_OPTIONS,
  FURNISHING_OPTIONS,
  SHARING_TYPE_OPTIONS,
  GENDER_PREFERENCE_OPTIONS,
  MEAL_PLAN_OPTIONS,
} from "@/lib/constants";
import { AREA_UNITS, AREA_UNIT_LABELS, convertAreaToSqft } from "@/lib/area-units";
import { formatNumber } from "@/lib/utils";
import { PLOT_PROPERTY_TYPES, COMMERCIAL_PROPERTY_TYPES, PG_PROPERTY_TYPES } from "@/schemas/propertySchema";

// Reusable select field, built from the same Select/FormField primitives used
// throughout this step, for the plain "pick one option" fields below.
function SelectField({ control, name, label, error, placeholder, options }) {
  return (
    <FormField label={label} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value || undefined} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
}

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
  const propertyType = watch("propertyType");

  const showAreaHelper = Boolean(areaUnit) && areaUnit !== "sqft" && plotArea;
  const plotAreaSqft = showAreaHelper ? convertAreaToSqft(plotArea, areaUnit, state) : null;

  // Field visibility is driven by the selected property type. Falls back to the
  // residential set (the original full field list) until a type is chosen.
  const isPlot = PLOT_PROPERTY_TYPES.includes(propertyType);
  const isCommercial = COMMERCIAL_PROPERTY_TYPES.includes(propertyType);
  const isPG = PG_PROPERTY_TYPES.includes(propertyType);
  const isResidential = !isPlot && !isCommercial && !isPG;

  const showBhk = isResidential;
  const showCarpetArea = isResidential;
  const showBuiltUpArea = isResidential || isCommercial;
  const showPlotArea = isPlot;
  const showAreaUnit = isPlot;
  const showFloors = isResidential || isCommercial;
  const showFacing = isResidential || isPlot || isCommercial;
  const showFurnishing = isResidential || isCommercial || isPG;
  const showCommercialFields = isCommercial;
  const showPgFields = isPG;

  return (
    <div className="space-y-5">
      {showBhk && (
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
      )}

      {(showCarpetArea || showBuiltUpArea || showPlotArea || showAreaUnit) && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {showCarpetArea && (
            <FormField label="Carpet Area" required error={errors.carpetArea?.message} htmlFor="carpetArea">
              <Input id="carpetArea" type="number" min="0" placeholder="1850" error={!!errors.carpetArea} {...register("carpetArea")} />
            </FormField>
          )}
          {showBuiltUpArea && (
            <FormField label="Built-up Area" error={errors.builtUpArea?.message} htmlFor="builtUpArea">
              <Input id="builtUpArea" type="number" min="0" placeholder="2100" {...register("builtUpArea")} />
            </FormField>
          )}
          {showPlotArea && (
            <FormField label="Plot Area" required error={errors.plotArea?.message} htmlFor="plotArea">
              <Input id="plotArea" type="number" min="0" placeholder="—" error={!!errors.plotArea} {...register("plotArea")} />
              {showAreaHelper && (
                <p className="mt-1.5 text-xs text-foreground-muted">
                  {plotAreaSqft !== null
                    ? `≈ ${formatNumber(Math.round(plotAreaSqft))} sq.ft`
                    : `Confirm manually — no standard ${AREA_UNIT_LABELS[areaUnit] ?? areaUnit} to sq.ft conversion for ${state || "this state"}.`}
                </p>
              )}
            </FormField>
          )}
          {showAreaUnit && (
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
          )}
        </div>
      )}

      {showFloors && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Floor" error={errors.floor?.message} htmlFor="floor">
            <Input id="floor" type="number" min="0" placeholder="4" {...register("floor")} />
          </FormField>
          <FormField label="Total Floors" error={errors.totalFloors?.message} htmlFor="totalFloors">
            <Input id="totalFloors" type="number" min="0" placeholder="14" {...register("totalFloors")} />
          </FormField>
        </div>
      )}

      {(showFacing || showFurnishing) && (
        <div className="grid gap-5 sm:grid-cols-2">
          {showFacing && (
            <SelectField
              control={control}
              name="facing"
              label="Facing"
              error={errors.facing?.message}
              placeholder="Select facing"
              options={FACING_OPTIONS}
            />
          )}
          {showFurnishing && (
            <SelectField
              control={control}
              name="furnishing"
              label="Furnishing"
              error={errors.furnishing?.message}
              placeholder="Select furnishing"
              options={FURNISHING_OPTIONS}
            />
          )}
        </div>
      )}

      {showCommercialFields && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Seating Capacity" error={errors.seatingCapacity?.message} htmlFor="seatingCapacity">
            <Input id="seatingCapacity" type="number" min="0" placeholder="50" {...register("seatingCapacity")} />
          </FormField>
          <FormField label="Washrooms" error={errors.washrooms?.message} htmlFor="washrooms">
            <Input id="washrooms" type="number" min="0" placeholder="2" {...register("washrooms")} />
          </FormField>
        </div>
      )}

      {showPgFields && (
        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField
            control={control}
            name="sharingType"
            label="Sharing Type"
            error={errors.sharingType?.message}
            placeholder="Select sharing type"
            options={SHARING_TYPE_OPTIONS}
          />
          <SelectField
            control={control}
            name="genderPreference"
            label="Gender Preference"
            error={errors.genderPreference?.message}
            placeholder="Select gender preference"
            options={GENDER_PREFERENCE_OPTIONS}
          />
          <SelectField
            control={control}
            name="mealPlan"
            label="Meal Plan"
            error={errors.mealPlan?.message}
            placeholder="Select meal plan"
            options={MEAL_PLAN_OPTIONS}
          />
        </div>
      )}

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
