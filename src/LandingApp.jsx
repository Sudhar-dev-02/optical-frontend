import React, { useEffect } from "react";
import { StoreProvider } from "@/context/StoreContext";
import { SitePreloader } from "@/components/common/SitePreloader";
import { SparkleCursor } from "@/components/common/SparkleCursor";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { HeroAboutSection } from "@/components/sections/HeroAboutSection";
import { BrandLoop } from "@/components/sections/BrandLoop";
import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { ContactSection } from "@/components/sections/ContactSection";
import { SearchOverlay } from "@/components/modals/SearchOverlay";
import { ProductQuickView } from "@/components/catalog/ProductQuickView";
import { AppointmentModal } from "@/components/modals/AppointmentModal";
import { SITE } from "@/data/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Optician",
  name: SITE.name,
  description:
    "Premium eyewear atelier in Tiruvannamalai offering curated designer frames, precision lenses, eye testing and personal optical styling.",
  founder: { "@type": "Person", name: SITE.owner },
  telephone: SITE.phones.map((phone) => phone.display),
  email: SITE.email,
  sameAs: [
    "https://www.facebook.com/share/1GAbA91z2i/",
    "https://share.google/wBMoi0mSCfJYdN9cE",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
    addressLocality: SITE.address.city,
    postalCode: SITE.address.pincode,
    addressRegion: SITE.address.state,
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "21:15",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "11:00",
      closes: "20:00",
    },
  ],
  priceRange: "₹₹",
};

export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const prevTitle = document.title;
    root.classList.add("landing-active");
    document.title = "Ayn Care — Clear Vision. Unmatched Style.";
    return () => {
      root.classList.remove("landing-active");
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="landing-root">
      <StoreProvider>
      <SitePreloader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <a
        href="#collection"
        className="sr-only z-[200] rounded-full bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the collection
      </a>
      <SiteHeader />
      <main>
        <HeroAboutSection />
        <BrandLoop />
        <ProductCatalog />
        <ContactSection />
      </main>
      <SiteFooter />
      <SearchOverlay />
      <ProductQuickView />
      <AppointmentModal />
      <SparkleCursor />
      <WhatsAppFloat />
      </StoreProvider>
    </div>
  );
}

