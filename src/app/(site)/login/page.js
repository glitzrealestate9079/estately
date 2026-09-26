"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthSide } from "@/components/site/auth/auth-side";
import { PhoneOtpFlow } from "@/components/site/auth/phone-otp-flow";
import { useSite } from "@/components/site/providers/site-provider";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mounted, auth } = useSite();

  if (mounted && auth.isAuthenticated) {
    return (
      <main className="auth-wrap">
        <AuthSide />
        <div className="auth-main">
          <div className="auth-card">
            <div className="state">
              <i className="bi bi-person-check state-ico success" />
              <h3>You&apos;re already logged in</h3>
              <p className="muted">Logged in as {auth.user.phone}.</p>
              <div className="row-wrap" style={{ justifyContent: "center" }}>
                <Link className="btn btn-primary" href="/dashboard">Go to dashboard</Link>
                <Link className="btn btn-outline" href="/">Home</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  function handleDone() {
    router.replace(searchParams.get("redirect") || "/dashboard");
  }

  return (
    <main className="auth-wrap">
      <AuthSide />
      <div className="auth-main">
        <div className="auth-card">
          <PhoneOtpFlow onDone={handleDone} />
        </div>
        <p className="auth-foot xs muted">Your number is shared with a seller only when you contact them.</p>
      </div>
    </main>
  );
}
