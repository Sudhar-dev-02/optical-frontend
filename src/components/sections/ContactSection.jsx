import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Layers,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
} from "lucide-react";
import { SITE } from "@/data/site";
import { useStore } from "@/context/StoreContext";

const frameOptions = [
  "Not sure yet — let stylist guide me",
  "Full Rim Acetate",
  "Rimless Titanium",
  "Cat-Eye Geometric",
  "Aviator / Navigator",
  "Polarized Sunglasses",
];

const serviceOptions = [
  "Complimentary 12-Step Eye Test",
  "Haute Frame Styling Session",
  "Zero-Distortion Lens Fitting",
  "Frame Adjustment & Maintenance",
  "General Optical Consultation",
];

export function ContactSection() {
  const reduceMotion = useReducedMotion();
  const { notify } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [mapMode, setMapMode] = useState("satellite");

  const activeMapUrl =
    mapMode === "satellite" ? SITE.mapEmbedSatelliteUrl : SITE.mapEmbedStandardUrl;

  const handleSubmit = (event) => {
    event.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      notify("Visit request received — our clinic concierge will call you shortly");
    }, 850);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[#eaf4fa] py-20 sm:py-28 text-slate-900">
      <style>{`
        .contact-map-frame {
          transition: opacity 0.3s ease;
        }
      `}</style>

      {/* Ambient Radial Sky Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_15%,rgba(162,222,252,0.4),transparent_40%),radial-gradient(circle_at_10%_85%,rgba(219,242,253,0.5),transparent_45%)]" />

      <div className="container-luxe relative z-10 mx-auto">
        {/* ===================================================================
            1. SECTION HEADER
           =================================================================== */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="display-serif text-[clamp(2.2rem,4vw,3.4rem)] font-normal tracking-[-0.025em] text-[#0b1320] leading-[1.06]">
              Come see us.
              <br />
              <span className="italic text-sky-900">Try things on.</span>
            </h2>
          </div>

          {/* Store Info & Quick Contact Card */}
          <div className="w-full sm:max-w-md lg:max-w-lg rounded-2xl sm:rounded-3xl border border-sky-200/90 bg-white/95 p-4.5 sm:p-5 shadow-[0_12px_32px_-8px_rgba(14,165,233,0.12)] backdrop-blur-xl">
            {/* Hours Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-sky-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-800">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Shop Open: 10:00 AM – 9:15 PM</span>
              </div>
              <span className="text-[0.68rem] font-medium text-slate-400">
                Mon – Sat
              </span>
            </div>

            {/* Address Line */}
            <div className="mt-3 flex items-start gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100 mt-0.5">
                <MapPin className="size-3.5 text-sky-600" />
              </span>
              <div className="text-xs sm:text-[0.82rem] leading-relaxed text-slate-700">
                <p className="font-semibold text-slate-900">
                  No 10 ALC Complex, Opposite Periyar Statue
                </p>
                <p className="text-slate-500 text-[0.76rem] sm:text-[0.8rem]">
                  Anna Salai, Tiruvannamalai – 606601, Tamil Nadu
                </p>
              </div>
            </div>

            {/* Phone & Contact CTA Bar (Increased size & width with high visual prominence) */}
            <div className="mt-3.5 pt-3 border-t border-sky-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href={`tel:${SITE.phones[0].raw}`}
                className="flex-1 flex items-center justify-between gap-3 rounded-xl bg-[#0b1320] px-4 py-2.5 text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid size-7 place-items-center rounded-lg bg-white/10 text-sky-300 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Phone className="size-3.5" />
                  </span>
                  <div>
                    <span className="block text-[0.54rem] uppercase font-bold tracking-wider text-slate-400">
                      Direct Store Line
                    </span>
                    <span className="block text-sm sm:text-[0.95rem] font-bold tracking-wide text-white">
                      {SITE.phones[0].display}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-sky-300 group-hover:text-white transition-colors">
                  Call Now
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>

              <a
                href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Ayn%20Care%2C%20I%20have%20an%20inquiry%20regarding%20store%20timings%20and%20frames.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] cursor-pointer"
                title="Chat with Store on WhatsApp"
              >
                <MessageCircle className="size-4" />
                <span className="sm:hidden lg:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. CLEAN CENTERED APPOINTMENT BOOKING HUB
           =================================================================== */}
        <div className="mt-10 max-w-xl sm:max-w-2xl mx-auto">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-sky-200/80 bg-white/95 p-5 sm:p-7 md:p-8 shadow-xl backdrop-blur-xl"
          >
            {/* Subtle glow orb inside card */}
            <div className="pointer-events-none absolute right-0 top-0 size-56 rounded-full bg-sky-200/35 blur-3xl" />

            {submitted ? (
              <div className="relative flex min-h-[20rem] flex-col items-center justify-center text-center">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="grid size-16 place-items-center rounded-full border border-sky-400 bg-sky-100 text-sky-900 shadow-md"
                >
                  <CheckCircle2 className="size-8" strokeWidth={1.5} />
                </motion.span>
                <p className="mt-4 text-[0.52rem] font-bold uppercase tracking-[0.22em] text-sky-900">
                  Request Confirmed
                </p>
                <h3 className="display-serif mt-1.5 text-2xl font-normal text-[#0b1320] sm:text-3xl">
                  We will see you soon.
                </h3>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-600">
                  Thank you for choosing AYN. Our optometrist Farook L will call you shortly to
                  confirm your visit and prepare a curated selection in your preferred style.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0d1522] px-6 py-2.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-white shadow-md transition hover:bg-slate-800 active:scale-95 cursor-pointer"
                >
                  <span>Book Another Visit</span>
                  <ArrowUpRight className="size-3" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="display-serif text-[clamp(1.5rem,3vw,2.1rem)] font-normal tracking-tight text-[#0b1320] leading-[1.08]">
                      Reserve your visit{" "}
                      <span className="italic text-sky-850">at the studio.</span>
                    </h3>
                  </div>
                  <span className="hidden size-10 shrink-0 place-items-center rounded-full border border-sky-200 bg-sky-50 text-sky-900 shadow-2xs sm:grid">
                    <CalendarCheck className="size-4" strokeWidth={1.6} />
                  </span>
                </div>

                {/* Form Inputs Grid: Compact 3-Row Symmetrical Layout */}
                <div className="mt-5 space-y-2.5">
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <Field label="Your Name" htmlFor="name">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="light-field !min-h-[2.45rem] !py-1.5 !px-3 !text-[0.74rem] !rounded-lg"
                      />
                    </Field>
                    <Field label="Phone Number" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="light-field !min-h-[2.45rem] !py-1.5 !px-3 !text-[0.74rem] !rounded-lg"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <Field label="Email Address" htmlFor="email">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="light-field !min-h-[2.45rem] !py-1.5 !px-3 !text-[0.74rem] !rounded-lg"
                      />
                    </Field>
                    <Field label="Preferred Date" htmlFor="date">
                      <input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="light-field !min-h-[2.45rem] !py-1.5 !px-3 !text-[0.74rem] !rounded-lg cursor-pointer"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <Field label="Preferred Frame" htmlFor="frame">
                      <select
                        id="frame"
                        name="frame"
                        className="light-field !min-h-[2.45rem] !py-1.5 !px-3 !text-[0.74rem] !rounded-lg cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a silhouette
                        </option>
                        {frameOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Appointment Request" htmlFor="service">
                      <select
                        id="service"
                        name="service"
                        className="light-field !min-h-[2.45rem] !py-1.5 !px-3 !text-[0.74rem] !rounded-lg cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          How can we help?
                        </option>
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="mt-4 pt-1">
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary shine w-full !min-h-10 sm:!min-h-11 !rounded-xl !text-[0.68rem] font-bold uppercase tracking-[0.14em] cursor-pointer"
                  >
                    <span>{sending ? "Securing your appointment..." : "Request Appointment"}</span>
                    {sending ? (
                      <span className="size-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    ) : (
                      <Send className="size-3" />
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Contact Ribbon under form */}
            <div className="mt-5 border-t border-sky-100 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-[0.8rem] text-slate-600 font-medium">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="size-3.5 text-sky-600 shrink-0" />
                  <span className="truncate max-w-[280px] sm:max-w-none">{SITE.address.full}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`tel:${SITE.phones[0].raw}`}
                    className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-sky-600 transition"
                  >
                    <Phone className="size-3.5 text-sky-600" />
                    <span>{SITE.phones[0].display}</span>
                  </a>
                  <a
                    href={`https://wa.me/${SITE.whatsapp}?text=Hello%20Ayn%20Care%2C%20I%20would%20like%20to%20reserve%20an%20appointment.`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-2xs"
                  >
                    <MessageCircle className="size-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================================================================
            3. LUXURY SATELLITE MAP ATELIER LOCATION
           =================================================================== */}
        <div className="mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-sky-300/40 bg-[#0d1522] shadow-[0_20px_45px_-12px_rgba(14,165,233,0.18)]">
          <div className="relative">
            <iframe
              key={mapMode}
              src={activeMapUrl}
              className="contact-map-frame h-72 w-full border-0 sm:h-80 md:h-[22rem]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ayn Care store location on Google Maps satellite view"
            />

            {/* Map Top Floating Glass Bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-4">
              {/* Store Identity Pill */}
              <div className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/20 bg-[#0b1320]/85 px-3 py-1.5 shadow-xl backdrop-blur-md">
                <span className="grid size-7 place-items-center rounded-full bg-sky-500 text-white shadow-sm shadow-sky-500/40">
                  <Navigation className="size-3.5" />
                </span>
                <div className="pr-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white sm:text-[0.62rem]">
                      AYN – Eye Clinic & Specs Store
                    </p>
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" title="Open Today" />
                  </div>
                  <p className="text-[0.48rem] font-medium text-slate-300 sm:text-[0.52rem]">
                    Anna Salai · 12.2346° N, 79.0753° E
                  </p>
                </div>
              </div>

              {/* Actions: View Toggle + Directions CTA */}
              <div className="pointer-events-auto flex items-center gap-2">
                {/* Map Mode Switcher */}
                <div className="flex items-center rounded-full border border-white/20 bg-[#0b1320]/85 p-0.5 shadow-xl backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setMapMode("satellite")}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.5rem] sm:text-[0.52rem] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer ${
                      mapMode === "satellite"
                        ? "bg-sky-500 text-white shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Layers className="size-3" />
                    <span>Satellite</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapMode("standard")}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.5rem] sm:text-[0.52rem] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer ${
                      mapMode === "standard"
                        ? "bg-sky-500 text-white shadow-sm"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <MapPin className="size-3" />
                    <span>Map</span>
                  </button>
                </div>

                {/* Get Directions Button */}
                <a
                  href={SITE.mapShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500 px-3.5 py-1.5 text-[0.54rem] sm:text-[0.58rem] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:bg-sky-400 hover:scale-[1.03] active:scale-[0.98] cursor-pointer backdrop-blur-md"
                >
                  <span>Directions</span>
                  <ArrowUpRight className="size-3 stroke-[2.5]" />
                </a>
              </div>
            </div>
          </div>

          {/* Sub-bar Address & Quick Info */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-white/10 bg-[#0d1522] px-4 py-2.5 text-[0.56rem] text-slate-300 sm:px-5">
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-sky-400 shrink-0" />
              <span className="font-semibold text-white">{SITE.address.full}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="font-medium text-slate-300">Opposite Periyar Statue · ALC Complex</span>
              <span className="text-slate-600">|</span>
              <a
                href={SITE.mapShareUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 hover:underline"
              >
                Open Google Maps
                <ArrowUpRight className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-[0.52rem] font-bold uppercase tracking-[0.14em] text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}
