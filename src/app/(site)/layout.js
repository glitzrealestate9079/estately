import { SiteProvider } from "@/components/site/providers/site-provider";
import { AuthGateModal } from "@/components/site/auth/auth-gate-modal";
import { SiteHeader } from "@/components/site/layout/site-header";
import { SiteFooter } from "@/components/site/layout/site-footer";
import { MobileBottomNav } from "@/components/site/layout/mobile-bottom-nav";
import { SplashScreen } from "@/components/site/layout/splash-screen";

export const metadata = {
  title: {
    template: "%s · Estately",
    default: "Estately — Buy, Rent, PG & Commercial Properties in India",
  },
  description:
    "Discover verified properties for sale, rent, PG/co-living, commercial and plots across India. Search smarter, compare confidently, and connect directly with owners, agents and builders.",
};

export default function SiteLayout({ children }) {
  return (
    <SiteProvider>
      <SplashScreen />
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <SiteFooter />
        <MobileBottomNav />
      </div>
      <AuthGateModal />
    </SiteProvider>
  );
}
