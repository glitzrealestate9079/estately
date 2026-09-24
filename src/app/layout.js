import { Inter, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Estately",
    template: "%s · Estately",
  },
  description:
    "Estately is a trusted real estate marketplace for buying, renting, PG/co-living, commercial and plotted properties across India.",
  metadataBase: new URL("https://www.estately.example"),
};

export const viewport = {
  themeColor: "#102a43",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('estately-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}var c=localStorage.getItem('estately-color-theme');if(c){document.documentElement.setAttribute('data-color-theme',c)}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
