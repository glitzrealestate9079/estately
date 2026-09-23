"use client";

import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Rocket, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyStepper } from "@/components/properties/form/property-stepper";
import { BasicInfoStep } from "@/components/properties/form/steps/basic-info-step";
import { LocationStep } from "@/components/properties/form/steps/location-step";
import { DetailsStep } from "@/components/properties/form/steps/details-step";
import { PricingStep } from "@/components/properties/form/steps/pricing-step";
import { AmenitiesStep } from "@/components/properties/form/steps/amenities-step";
import { MediaStep } from "@/components/properties/form/steps/media-step";
import { OwnerStep } from "@/components/properties/form/steps/owner-step";
import { VerificationStep } from "@/components/properties/form/steps/verification-step";
import { PreviewStep } from "@/components/properties/form/steps/preview-step";
import { propertySchema, PROPERTY_DEFAULT_VALUES, PROPERTY_STEPS } from "@/schemas/propertySchema";

const STEP_COMPONENTS = {
  basic: BasicInfoStep,
  location: LocationStep,
  details: DetailsStep,
  pricing: PricingStep,
  amenities: AmenitiesStep,
  media: MediaStep,
  owner: OwnerStep,
  verification: VerificationStep,
  preview: PreviewStep,
};

export function PropertyWizard({ defaultValues = PROPERTY_DEFAULT_VALUES, mode = "add" }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues,
    mode: "onBlur",
  });

  const { trigger, handleSubmit } = methods;
  const step = PROPERTY_STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[step.key];
  const isLastStep = stepIndex === PROPERTY_STEPS.length - 1;
  const isFirstStep = stepIndex === 0;

  async function goToStep(index) {
    setStepIndex(index);
  }

  async function handleContinue() {
    const valid = step.fields.length === 0 || (await trigger(step.fields));
    if (!valid) {
      toast.error("Please fix the errors before continuing");
      return;
    }
    const next = Math.min(stepIndex + 1, PROPERTY_STEPS.length - 1);
    setStepIndex(next);
    setFurthestIndex((prev) => Math.max(prev, next));
  }

  function handleBack() {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleSaveDraft() {
    toast.success("Draft saved successfully");
    router.push("/properties");
  }

  async function onPublish() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSubmitting(false);
    toast.success(mode === "edit" ? "Property updated successfully" : "Property published successfully");
    router.push("/properties");
  }

  return (
    <FormProvider {...methods}>
      <PropertyStepper currentIndex={stepIndex} furthestIndex={furthestIndex} onStepClick={goToStep} />

      <Card>
        <CardContent className="animate-fade-in">
          <h2 className="mb-5 font-display text-lg font-semibold text-foreground">{step.label}</h2>
          <StepComponent />
        </CardContent>

        <div className="flex flex-col-reverse gap-3 border-t border-border-subtle p-5 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={handleBack} disabled={isFirstStep}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="ghost" onClick={handleSaveDraft}>
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            {isLastStep ? (
              <Button type="button" onClick={handleSubmit(onPublish)} loading={submitting}>
                <Rocket className="h-4 w-4" />
                Publish
              </Button>
            ) : (
              <Button type="button" onClick={handleContinue}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </FormProvider>
  );
}
