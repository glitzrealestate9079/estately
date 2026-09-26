import { DM_Sans, Manrope } from "next/font/google";
import { SiteProvider } from "@/components/site/providers/site-provider";
import { SiteChrome } from "@/components/site/layout/site-chrome";
import { SplashScreen } from "@/components/site/layout/splash-screen";
import "@/styles/site-template.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

// Ported design's own fonts (DM Sans body / Manrope headings) — separate
// from the admin panel's Inter/Jakarta/Playfair, scoped to this layout only.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

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
      {/* Rendered outside .hp-app: it uses Tailwind classes, which the
          site-template reset (higher cascade-layer priority) would zero out
          if nested inside .hp-app. */}
      <SplashScreen />
      <div className={`hp-app ${dmSans.variable} ${manrope.variable}`}>
        <SiteChrome>{children}</SiteChrome>
      </div>
    </SiteProvider>
  );
}
