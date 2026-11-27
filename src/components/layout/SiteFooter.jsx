import Link from "@/components/common/Link";
import {
  ArrowUp,
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS, SITE } from "@/data/site";
import { assetUrl } from "@/utils/assetUrl";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M14.5 8.5V6.8c0-.8.5-1.3 1.4-1.3H18V2.5h-2.8c-2.7 0-4.2 1.6-4.2 4.2v1.8H8v3h3V21h3.5v-9.5h2.6l.4-3h-3Z" />
    </svg>
  );
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

/**
 * Real Photographic Floating Luxury Eyewear Image
 * High-resolution angled crystal clear frame with sky-blue lenses, transparent alpha cutout, and smooth bobbing animation.
 */
function FloatingEyewearGraphic() {
  return (
    <div className="relative inline-flex items-center justify-center mx-6 sm:mx-12 shrink-0 select-none">
      <div className="animate-eyewear-bob relative">
        {/* Soft Ambient Sky-Cyan Light Aura */}
        <div className="absolute -inset-6 rounded-full bg-sky-400/20 blur-2xl pointer-events-none" />

        {/* Real Designer Glasses Photographic Asset */}
        <img
          src={assetUrl("/assets/images/ayn_crystal_blue_glasses.png")}
          alt="AYN Crystal Sky-Blue Designer Optical Frame"
          className="w-24 sm:w-36 md:w-44 lg:w-48 h-auto object-contain select-none pointer-events-none drop-shadow-[0_16px_35px_rgba(14,165,233,0.45)] transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
}

/**
 * Single repeating marquee chunk: "AYN Care" (no dot) + Real Eyewear Image
 */
function MarqueeUnit() {
  return (
    <div className="inline-flex items-center shrink-0">
      <span className="font-sans font-black tracking-[-0.035em] text-[#14233c] transition-colors duration-300 hover:text-sky-900/70 select-none text-[clamp(4.5rem,13vw,11.5rem)] leading-none">
        AYN Care
      </span>
      <FloatingEyewearGraphic />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#060b14] text-slate-200 border-t border-sky-900/50">
      {/* Ambient Lighting & Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_100%,rgba(56,189,248,0.06),transparent_60%)]" />
      <div className="noise-overlay" />

      {/* =====================================================================
          1. TOP HERO BANNER & 4-COLUMN MAIN DIRECTORY
         ===================================================================== */}
      <div className="container-luxe max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Editorial Headline & Collection CTA */}
        <div className="flex flex-col gap-5 sm:gap-6 border-b border-white/10 py-8 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="display-serif text-[clamp(2.1rem,3.8vw,3.2rem)] font-normal tracking-[-0.025em] text-white leading-[1.06]">
              See clearly.
              <br />
              <span className="italic text-sky-300">Live beautifully.</span>
            </h2>
            <p className="hidden sm:block mt-2.5 max-w-md text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
              A considered optical atelier on Anna Salai — bringing together independent eyewear
              houses, precision lens craft, and personal optical care.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="#collection"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 px-7 py-3.5 text-xs sm:text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#060b14] shadow-[0_10px_25px_-5px_rgba(56,189,248,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_16px_35px_-5px_rgba(56,189,248,0.6)] active:scale-95 cursor-pointer"
            >
              <span>Explore the collection</span>
              <ArrowUpRight className="size-4 text-[#060b14] stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Four-Column Seamless Directory (2 Columns on mobile, 4 on desktop) */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 py-8 sm:py-10 sm:gap-8 lg:grid-cols-12 lg:gap-8 lg:py-14">
          {/* Column 1: Brand & Social Handles (Span 2 on mobile, Span 4 on desktop) */}
          <div className="col-span-2 lg:col-span-4 lg:pr-4 flex flex-col justify-between order-1">
            <div>
              <Logo variant="light" />
              <p className="hidden sm:block mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
                Dedicated to clinical excellence and artisanal optical styling in Tiruvannamalai. Discover precision lens calibrations and curated frames shaped for real lives.
              </p>
            </div>

            <div className="mt-4 sm:mt-8">
              {/* Social Icon Pills */}
              <div className="flex items-center gap-2.5">
                {SITE.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label} — ${social.handle}`}
                    title={`${social.label}: ${social.handle}`}
                    className="grid size-9 place-items-center rounded-xl border border-white/12 bg-white/5 text-slate-300 shadow-sm transition-all duration-200 hover:scale-105 hover:border-sky-400/50 hover:bg-sky-500/20 hover:text-white cursor-pointer"
                  >
                    {social.label === "Facebook" && <FacebookIcon className="size-4 text-sky-400" />}
                    {social.label === "Google" && <GoogleIcon className="size-4 text-amber-300" />}
                    {social.label === "Instagram" && <InstagramIcon className="size-4" />}
                    {social.label === "WhatsApp" && <WhatsAppIcon className="size-4 text-emerald-400" />}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Span 1 on mobile, Span 2 on desktop) */}
          <div className="col-span-1 lg:col-span-2 order-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 transition-all duration-200 hover:text-white hover:translate-x-1"
                  >
                    <span className="size-1 rounded-full bg-sky-400/50 transition-colors group-hover:bg-sky-400 group-hover:scale-125" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Concierge & Direct Contact (Span 1 on mobile, Span 3 on desktop) */}
          <div className="col-span-1 lg:col-span-3 order-3 lg:order-4 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400 pb-1">
                Talk to Us
              </p>

              <div className="mt-4 space-y-2.5">
                {SITE.phones.map((phone, idx) => (
                  <a
                    key={phone.raw}
                    href={idx === 1 ? SITE.whatsappUrl : `tel:${phone.raw}`}
                    target={idx === 1 ? "_blank" : undefined}
                    rel={idx === 1 ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between gap-1.5 sm:gap-2 text-[0.72rem] sm:text-sm font-semibold text-slate-200 transition-colors duration-200 hover:text-sky-300"
                    title={idx === 1 ? "Chat on WhatsApp" : "Call Store"}
                  >
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      {idx === 1 ? (
                        <WhatsAppIcon className="size-3 sm:size-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Phone className="size-3 sm:size-3.5 text-sky-400 shrink-0" />
                      )}
                      <span className="whitespace-nowrap">{phone.display}</span>
                    </span>
                    {idx === 1 && (
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[0.55rem] font-bold text-emerald-300">
                        WhatsApp
                      </span>
                    )}
                  </a>
                ))}
              </div>

              <a
                href={`mailto:${SITE.email}`}
                className="mt-3 flex items-center gap-1.5 sm:gap-2 text-[0.72rem] sm:text-[0.82rem] text-slate-300 transition-colors hover:text-white group"
                title={`Email: ${SITE.email}`}
              >
                <Mail className="size-3 sm:size-3.5 text-sky-400 shrink-0 group-hover:text-sky-300 transition-colors" />
                <span className="truncate">{SITE.email}</span>
              </a>
            </div>

            <div className="pt-4 mt-3 sm:pt-5 sm:mt-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-white/10 border border-white/20 py-2 sm:py-2.5 px-3 sm:px-5 text-[0.62rem] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-sky-500 hover:border-sky-500 hover:text-white cursor-pointer active:scale-95"
              >
                <span>Book Exam</span>
                <ArrowUpRight className="size-3 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Column 3: Atelier Location (Span 2 on mobile with 2-column internal split, Span 3 on desktop) */}
          <div className="col-span-2 lg:col-span-3 order-4 lg:order-3 pt-6 sm:pt-0 border-t border-white/8 lg:border-t-0 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-col sm:gap-0">
              {/* Left Sub-Column on Mobile: Address & Directions */}
              <div>
                <div className="flex items-center gap-2 pb-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">
                    Visit Atelier
                  </p>
                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300 border border-emerald-500/30">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open Today
                  </span>
                </div>

                <div className="mt-3.5 space-y-3 text-xs sm:text-[0.82rem] text-slate-300 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold text-xs leading-snug">
                        {SITE.address.line1}
                      </p>
                      <p className="text-slate-400 text-[0.70rem] sm:text-xs mt-0.5 leading-snug">
                        {SITE.address.line2}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={SITE.mapShareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/15 px-3 py-1.5 text-[0.66rem] sm:text-xs font-bold uppercase tracking-wider text-sky-300 transition-all duration-200 hover:bg-sky-500 hover:text-white cursor-pointer"
                    >
                      <span>Get Directions</span>
                      <ArrowUpRight className="size-3 stroke-[2.5]" />
                    </a>
                    <a
                      href={SITE.googleShareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[0.66rem] sm:text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-300 cursor-pointer"
                      title="Open Google Profile & Maps"
                    >
                      <GoogleIcon className="size-3 text-amber-300" />
                      <span>Google Map</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Sub-Column on Mobile: Operating Hours */}
              <div className="sm:pt-5 sm:mt-4 text-xs">
                <div className="flex items-center gap-2 pb-1 sm:hidden">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-400">
                    Atelier Hours
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[0.55rem] font-bold text-emerald-300 border border-emerald-500/30">
                    <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
                    Open
                  </span>
                </div>

                <div className="mt-3.5 sm:mt-0 space-y-1">
                  <p className="flex items-start gap-1.5 font-medium text-slate-200 text-xs leading-snug">
                    <Clock3 className="size-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span>Mon–Sat: 10AM–9:15PM</span>
                  </p>
                  <p className="pl-5 text-[0.70rem] sm:text-[0.72rem] text-slate-400">Sun: 11AM–8PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. LUXURY AUTOMATIC SCROLLING BRAND MARQUEE (AYN CARE)
             Edge-to-edge cinematic banner with real photographic angled eyewear & no border
         ===================================================================== */}
      <div className="relative w-full overflow-hidden bg-black/20 py-6 sm:py-9 my-2 select-none">
        {/* Vignette Gradients for Smooth In/Out Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-44 z-10 bg-gradient-to-r from-[#060b14] via-[#060b14]/85 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-44 z-10 bg-gradient-to-l from-[#060b14] via-[#060b14]/85 to-transparent" />

        {/* Marquee Track (Infinite Seamless Auto-Scrolling Loop) */}
        <div className="flex w-fit items-center footer-marquee-track whitespace-nowrap cursor-default">
          {/* Set 1 */}
          <div className="flex items-center shrink-0">
            <MarqueeUnit />
            <MarqueeUnit />
            <MarqueeUnit />
            <MarqueeUnit />
          </div>

          {/* Set 2 (Duplicate for 100% seamless infinite continuity) */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            <MarqueeUnit />
            <MarqueeUnit />
            <MarqueeUnit />
            <MarqueeUnit />
          </div>
        </div>
      </div>

      {/* =====================================================================
          3. SUB-FOOTER: COPYRIGHT, CRAFT & BACK TO TOP
         ===================================================================== */}
      <div className="container-luxe max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 flex-wrap">
            <span>©</span>
            <span className="font-bold tracking-wide text-white bg-sky-500/15 border border-sky-400/30 px-2 py-0.5 rounded-md text-[0.72rem]">
              AynCare@2026
            </span>
            <span className="text-slate-600">·</span>
            <span>Eye Clinic &amp; Specs Store. All rights reserved.</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>Crafted with care in Tiruvannamalai</span>
            <span className="hidden size-1 rounded-full bg-sky-400/50 sm:block" />
            <a
              href="#home"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-sky-400/50 hover:bg-sky-500/15 hover:text-white cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="size-3 stroke-[2.5]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
