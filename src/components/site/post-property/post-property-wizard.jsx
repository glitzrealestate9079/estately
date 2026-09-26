"use client";

import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PostPropertyStepper } from "@/components/site/post-property/stepper";
import { WizardNavProvider } from "@/components/site/post-property/wizard-nav-context";
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
import { buildListingFromWizard, buildProjectFromWizard } from "@/lib/site/build-listing";
import { postPropertySchema, POST_PROPERTY_DEFAULT_VALUES, POST_PROPERTY_STEPS, kindFor, stepTitleFor } from "@/schemas/site/postPropertySchema";

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

const DRAFT_KEY = "estately_site_post_property_draft";

function readDraft() {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(values) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...values, updatedAt: new Date().toISOString() }));
  } catch {
    /* ignore quota/availability errors */
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

const START_PERKS = [
  ["bi-ui-checks", "Guided, one step at a time", "Only the fields that apply to your property."],
  ["bi-shield-check", "Specific trust badges", "Each verification you complete is shown separately to buyers."],
  ["bi-people", "Leads in one place", "Track enquiries and site visits from your dashboard."],
];

function StartScreen({ onStart, onContinueDraft, draft, isAuthenticated }) {
  return (
    <>
      <div className="container wizard" style={{ gridTemplateColumns: "1fr", maxWidth: 1000, margin: "auto" }}>
        <div className="wz-panel">
          {draft?.sellerType && (
            <div className="banner banner-info mb-16">
              <i className="bi bi-clock-history" />
              <div>
                You have a draft from {new Date(draft.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.{" "}
                <button type="button" className="btn-link" onClick={onContinueDraft}>Continue draft</button> ·{" "}
                <button type="button" className="btn-link" onClick={() => { clearDraft(); onStart(); }}>Start over</button>
              </div>
            </div>
          )}
          <div className="grid-2" style={{ gap: 32, alignItems: "center" }}>
            <div>
              <h1>Post your property — free</h1>
              <p className="lead">Reach buyers and tenants across India. It takes about 5 minutes; we save your progress as you go.</p>
              <div className="stack mt-24" style={{ "--stack": "14px" }}>
                {START_PERKS.map(([icon, title, desc]) => (
                  <div key={title} className="row" style={{ gap: 14, alignItems: "flex-start" }}>
                    <span className="ac-ico" style={{ background: "var(--primary-50)", color: "var(--primary)" }}><i className={`bi ${icon}`} /></span>
                    <div><div className="strong">{title}</div><div className="small muted">{desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-soft card-pad-lg">
              <div className="strong mb-8">Keep these handy</div>
              <ul className="stack small" style={{ "--stack": "10px" }}>
                <li><i className="bi bi-image text-primary" /> 5–15 clear photos (daylight, all rooms)</li>
                <li><i className="bi bi-rulers text-primary" /> Area in your preferred unit — sq.ft, sq.yd, bigha…</li>
                <li><i className="bi bi-file-earmark text-primary" /> Optional: ID and ownership document for extra badges</li>
                <li><i className="bi bi-building text-primary" /> Builders: RERA registration number</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="wz-footer">
        <div className="container inner">
          <Link className="btn btn-ghost" href="/">Cancel</Link>
          <span className="grow" />
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            {isAuthenticated ? "Start posting" : "Log in & start"}<i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </>
  );
}

function PublishedScreen({ listingId, onPostAnother }) {
  return (
    <div className="wizard" style={{ gridTemplateColumns: "1fr" }}>
      <div className="wz-panel" style={{ maxWidth: 560, margin: "24px auto", textAlign: "center" }}>
        <div className="state">
          <div className="state-ico success"><i className="bi bi-check-lg" /></div>
          <h3>Property submitted</h3>
          <p>
            Your listing is under review. We usually finish within 24 hours and will notify you when it&apos;s live.
            <br /><br />
            <span className="badge">Listing ID: <b className="ink" style={{ marginLeft: 4 }}>{listingId}</b></span>
          </p>
          <div className="row-wrap" style={{ justifyContent: "center" }}>
            <Link className="btn btn-primary btn-lg" href="/dashboard/listings">View listing</Link>
            <Link className="btn btn-outline btn-lg" href="/dashboard">Go to dashboard</Link>
          </div>
        </div>
        <div className="surface-soft card-pad small mt-24" style={{ textAlign: "left" }}>
          <div className="strong mb-8">What happens next</div>
          <ol className="stack" style={{ "--stack": "6px", listStyle: "decimal", paddingLeft: 18 }}>
            <li>We review photos and details (usually within 24 hours).</li>
            <li>Your listing goes live — you&apos;ll see views and enquiries in the dashboard.</li>
            <li>Confirm availability every 30 days to keep it visible in search.</li>
          </ol>
        </div>
        <button className="btn btn-link mt-16" onClick={onPostAnother}><i className="bi bi-plus-circle" />Post another property</button>
      </div>
    </div>
  );
}

export function PostPropertyWizard() {
  const { requireAuth, addListing, addProject, auth } = useSite();
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestIndex, setFurthestIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(null);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    setDraft(readDraft());
  }, []);

  const methods = useForm({
    resolver: yupResolver(postPropertySchema),
    defaultValues: POST_PROPERTY_DEFAULT_VALUES,
    mode: "onBlur",
  });

  const { trigger, handleSubmit, watch, reset } = methods;
  const step = POST_PROPERTY_STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[step.key];
  const isLastStep = stepIndex === POST_PROPERTY_STEPS.length - 1;
  const isFirstStep = stepIndex === 0;
  const pct = Math.round(((stepIndex + 1) / POST_PROPERTY_STEPS.length) * 100);

  // Autosave the draft (debounced) once the wizard has actually started.
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!started) return undefined;
    const subscription = watch((values) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => writeDraft(values), 500);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(saveTimer.current);
    };
  }, [started, watch]);

  function handleStart() {
    requireAuth(() => setStarted(true), { title: "Log in to post a property", description: "Sign in so buyers can reach you about this listing." });
  }

  function handleContinueDraft() {
    requireAuth(
      () => {
        if (draft) reset({ ...POST_PROPERTY_DEFAULT_VALUES, ...draft });
        setStarted(true);
      },
      { title: "Log in to post a property", description: "Sign in so buyers can reach you about this listing." }
    );
  }

  function goToStep(index) {
    setStepIndex(index);
    setFurthestIndex((prev) => Math.max(prev, index));
  }

  async function handleContinue() {
    const valid = step.fields.length === 0 || (await trigger(step.fields));
    if (!valid) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    const next = Math.min(stepIndex + 1, POST_PROPERTY_STEPS.length - 1);
    goToStep(next);
  }

  function handleBack() {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }

  function onPublish(values) {
    requireAuth(
      async (user) => {
        setSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 900));
        const kind = kindFor(values);
        const created = kind === "project" ? addProject(buildProjectFromWizard(values, user)) : addListing(buildListingFromWizard(values, user));
        clearDraft();
        setSubmitting(false);
        setPublished(created);
      },
      { title: "Verify your number to publish", description: "We'll use this number for buyer enquiries and listing alerts." }
    );
  }

  function postAnother() {
    setPublished(null);
    setStepIndex(0);
    setFurthestIndex(0);
    methods.reset(POST_PROPERTY_DEFAULT_VALUES);
  }

  if (!started) return <StartScreen onStart={handleStart} onContinueDraft={handleContinueDraft} draft={draft} isAuthenticated={auth.isAuthenticated} />;
  if (published) return <PublishedScreen listingId={published.id} onPostAnother={postAnother} />;

  return (
    <FormProvider {...methods}>
      <WizardNavProvider goToStep={goToStep}>
        <div className="container wizard">
          <PostPropertyStepper currentIndex={stepIndex} furthestIndex={furthestIndex} pct={pct} onStepClick={goToStep} kind={kindFor(watch())} />
          <div>
            <div className="wz-mobile-progress">
              <div className="between small">
                <span className="strong">Step {stepIndex + 1} of {POST_PROPERTY_STEPS.length}</span>
                <span className="muted">{stepTitleFor(step.key, kindFor(watch())) ?? step.label}</span>
              </div>
              <div className="wz-progress" style={{ margin: "8px 0 0" }}><span style={{ width: `${pct}%` }} /></div>
            </div>
            <div className="wz-panel">
              <StepComponent />
            </div>
          </div>
        </div>
        <div className="wz-footer">
          <div className="container inner">
            <button className="btn btn-outline btn-lg" onClick={handleBack} disabled={isFirstStep}>
              <i className="bi bi-arrow-left" /><span className="hide-mobile">Back</span>
            </button>
            <span className="grow draft-note small muted"><i className="bi bi-cloud-check" /> Draft saved</span>
            {isLastStep ? (
              <button className={`btn btn-primary btn-lg ${submitting ? "is-loading" : ""}`} onClick={handleSubmit(onPublish)}>
                <i className="bi bi-send" />Publish
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleContinue}>
                Continue<i className="bi bi-arrow-right" />
              </button>
            )}
          </div>
        </div>
      </WizardNavProvider>
    </FormProvider>
  );
}
