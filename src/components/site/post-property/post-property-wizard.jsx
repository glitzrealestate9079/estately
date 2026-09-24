"use client";

import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostPropertyStepper } from "@/components/site/post-property/stepper";
import { RoleStep } from "@/components/site/post-property/steps/role-step";
import { TransactionStep } from "@/components/site/post-property/steps/transaction-step";
import { TypeStep } from "@/components/site/post-property/steps/type-step";
import { LocationStep } from "@/components/site/post-property/steps/location-step";
import { DetailsStep } from "@/components/site/post-property/steps/details-step";
import { PricingStep } from "@/components/site/post-property/steps/pricing-step";
import { AmenitiesStep } from "@/components/site/post-property/steps/amenities-step";
import { MediaStep } from "@/components/site/post-property/steps/media-step";
import { DescriptionStep } from "@/components/site/post-property/steps/description-step";
import { VerificationStep } from "@/components/site/post-property/steps/verification-step";
import { PreviewStep } from "@/components/site/post-property/steps/preview-step";
import { useSite } from "@/components/site/providers/site-provider";
import { buildListingFromWizard } from "@/lib/site/build-listing";
import { postPropertySchema, POST_PROPERTY_DEFAULT_VALUES, POST_PROPERTY_STEPS } from "@/schemas/site/postPropertySchema";

const STEP_COMPONENTS = {
  role: RoleStep,
  transaction: TransactionStep,
  type: TypeStep,
  location: LocationStep,
  details: DetailsStep,
  pricing: PricingStep,
  amenities: AmenitiesStep,
  media: MediaStep,
  description: DescriptionStep,
  verification: VerificationStep,
  preview: PreviewStep,
};

export function PostPropertyWizard() {
  const router = useRouter();
  const { requireAuth, addListing } = useSite();
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(null);

  const methods = useForm({
    resolver: yupResolver(postPropertySchema),
    defaultValues: POST_PROPERTY_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const { trigger, handleSubmit } = methods;
  const step = POST_PROPERTY_STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[step.key];
  const isLastStep = stepIndex === POST_PROPERTY_STEPS.length - 1;
  const isFirstStep = stepIndex === 0;

  function goToStep(index) {
    setStepIndex(index);
  }

  async function handleContinue() {
    const valid = step.fields.length === 0 || (await trigger(step.fields));
    if (!valid) {
      toast.error("Please fix the errors before continuing");
      return;
    }
    const next = Math.min(stepIndex + 1, POST_PROPERTY_STEPS.length - 1);
    setStepIndex(next);
    setFurthestIndex((prev) => Math.max(prev, next));
  }

  function handleBack() {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }

  function onPublish(values) {
    requireAuth(
      async (user) => {
        setSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 900));
        const listing = addListing(buildListingFromWizard(values, user));
        setSubmitting(false);
        setPublished(listing);
        toast.success("Listing published!");
      },
      { title: "Verify your number to publish", description: "We'll use this number for buyer enquiries and listing alerts." }
    );
  }

  if (published) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Your listing is live!</h2>
            <p className="mt-1.5 max-w-md text-sm text-foreground-muted">
              &quot;{published.title}&quot; is now visible to buyers. Track views, enquiries and manage it anytime from your dashboard.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
            <Button onClick={() => router.push("/dashboard")}>Go to My Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FormProvider {...methods}>
      <PostPropertyStepper currentIndex={stepIndex} furthestIndex={furthestIndex} onStepClick={goToStep} />

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

          {isLastStep ? (
            <Button type="button" onClick={handleSubmit(onPublish)} loading={submitting}>
              <Rocket className="h-4 w-4" />
              Publish Listing
            </Button>
          ) : (
            <Button type="button" onClick={handleContinue}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </FormProvider>
  );
}
