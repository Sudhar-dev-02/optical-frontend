import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { assetUrl } from "@/utils/assetUrl";

const frameOptions = [
  "Stylist Curation",
  "Full Rim Acetate",
  "Rimless Titanium",
  "Cat-Eye Geometric",
  "Aviator / Navigator",
  "Polarized Sun",
];

const serviceOptions = [
  "12-Step Eye Test",
  "Private Frame Styling",
  "Lens Fitting",
  "Frame Adjustment",
  "Consultation",
];

/**
 * Mobile-First Accessible Custom Dropdown
 * Solves OS/browser native select clipping, horizontal bleed, and awkward popover overlap.
 */
function CustomSelect({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
  id,
}) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="mb-1 block text-[0.62rem] sm:text-xs font-bold uppercase tracking-[0.09em] sm:tracking-[0.11em] text-slate-600 truncate"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={onToggle}
        className={`group flex h-10 sm:h-10.5 w-full items-center justify-between rounded-xl border bg-white px-3 text-left transition-all duration-200 cursor-pointer ${
          isOpen
            ? "border-sky-500 ring-2 ring-sky-400/20 shadow-sm"
            : "border-sky-200/90 hover:border-sky-400 hover:bg-sky-50/20 shadow-2xs"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-xs sm:text-[0.82rem] font-medium text-slate-800">
          {value}
        </span>
        <ChevronDown
          className={`size-3.5 shrink-0 text-sky-600 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-sky-700" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-48 overflow-y-auto rounded-xl border border-sky-200 bg-white p-1.5 shadow-[0_12px_32px_-5px_rgba(11,26,48,0.22)] backdrop-blur-md"
            role="listbox"
          >
            {options.map((opt) => {
              const isSelected = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onSelect(opt)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs sm:text-[0.82rem] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-sky-100/70 text-sky-950 font-semibold"
                      : "text-slate-700 hover:bg-sky-50 hover:text-slate-900"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <Check className="size-3.5 text-sky-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppointmentModal() {
  const { appointmentOpen, setAppointmentOpen, notify } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // "frame" | "service" | null
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    frame: frameOptions[0],
    service: serviceOptions[0],
    date: new Date().toISOString().split("T")[0],
  });

  // Auto-trigger: Shows automatically 4 seconds after site open
  useEffect(() => {
    try {
      sessionStorage.removeItem("optics_appointment_dismissed");
    } catch {}

    const timer = setTimeout(() => {
      setAppointmentOpen(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [setAppointmentOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setAppointmentOpen(false);
      }
    };
    if (appointmentOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appointmentOpen, setAppointmentOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown && !e.target.closest("[data-custom-select]")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeDropdown]);

  const handleClose = () => {
    setActiveDropdown(null);
    setAppointmentOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      notify("Private appointment requested — our clinic concierge will call you shortly");
    }, 800);
  };

  return (
    <>
      <style>{`
        .appointment-modal-shadow {
          box-shadow: 0 25px 60px -15px rgba(11, 26, 48, 0.45);
        }
      `}</style>
      <AnimatePresence>
        {appointmentOpen ? (
          <div
            className="fixed inset-0 z-[125] flex items-center justify-center p-3 sm:p-5 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Reserve your visit at the studio"
          >
            {/* Ambient Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleClose}
              className="absolute inset-0 bg-[#070e1b]/80 backdrop-blur-md cursor-pointer"
            />

            {/* POPUP MODAL CONTAINER - Mobile-first width, max-height scrolling to prevent any button clipping */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 8,
                transition: { duration: 0.16, ease: "easeIn" },
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 28,
              }}
              className="appointment-modal-shadow relative z-10 flex w-[calc(100%-1.75rem)] max-w-[420px] sm:max-w-[480px] lg:max-w-[860px] max-h-[92vh] flex-col overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-200/90 bg-[#f8fcff] text-slate-900 shadow-2xl"
            >
              {/* Close Button (Top-Right) - Sleek & Instant Tap */}
              <button
                type="button"
                onClick={handleClose}
                className="group absolute right-3 top-3 sm:right-4 sm:top-4 z-[100] flex size-8 sm:size-8.5 items-center justify-center rounded-full border border-sky-200/90 bg-white/95 text-slate-700 shadow-md backdrop-blur-md transition-all hover:border-sky-500 hover:bg-sky-500 hover:text-white active:scale-90 cursor-pointer touch-manipulation"
                aria-label="Close appointment popup"
                title="Close modal (Esc)"
              >
                <X className="size-4 transition-transform group-hover:scale-110" />
              </button>

              {/* Main Content Grid: Left Form (lg:col-span-7) + Right AYN Visual Card (lg:col-span-5) */}
              <div className="grid lg:grid-cols-12 flex-1 overflow-y-auto overscroll-contain">
                {/* ========================================================= */}
                {/* LEFT COLUMN: Clean, Mobile-First Booking Form              */}
                {/* ========================================================= */}
                <div className="w-full lg:col-span-7 flex flex-col justify-between p-4 sm:p-6 lg:p-7 text-slate-900 relative bg-[#f8fcff]">
                  <div className="pointer-events-none absolute right-0 top-0 size-36 rounded-full bg-sky-200/35 blur-3xl" />
                  <div className="pointer-events-none absolute -left-10 -bottom-10 size-36 rounded-full bg-blue-100/40 blur-2xl" />

                  {submitted ? (
                    <div className="relative flex flex-1 flex-col items-center justify-center py-6 text-center">
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                        className="grid size-12 place-items-center rounded-full border border-sky-300 bg-sky-100 text-sky-900 shadow-md"
                      >
                        <CheckCircle2 className="size-6" strokeWidth={1.4} />
                      </motion.span>
                      <p className="mt-2 text-[0.52rem] font-bold uppercase tracking-[0.2em] text-sky-700">
                        Request Confirmed
                      </p>
                      <h3 className="display-serif mt-0.5 text-xl text-[#0b1a30]">
                        We will see you soon.
                      </h3>
                      <p className="mt-1 max-w-xs text-[0.72rem] leading-4 text-slate-600">
                        Your private visit has been requested. Our optometrist concierge
                        will call you shortly to confirm your curated frame selection.
                      </p>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#0b1a30] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-slate-800 active:scale-95 cursor-pointer"
                      >
                        <span>Continue Exploring</span>
                        <ArrowUpRight className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="relative flex flex-1 flex-col justify-between">
                      <div>
                        {/* Title: Refined Heading with no overlap */}
                        <div className="pr-10 sm:pr-0">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100/80 px-2.5 py-0.5 text-[0.58rem] sm:text-[0.62rem] font-bold text-sky-800 tracking-wider uppercase mb-1.5 border border-sky-200/60">
                            <Sparkles className="size-3 text-sky-600" />
                            Private Studio Session
                          </span>
                          <h3 className="display-serif text-[1.18rem] sm:text-[1.4rem] font-normal leading-[1.12] tracking-tight text-[#0b1a30]">
                            Reserve your visit{" "}
                            <span className="italic font-normal text-sky-700">at the studio.</span>
                          </h3>
                        </div>

                        {/* Form Inputs Grid */}
                        <div className="mt-3 sm:mt-3.5 space-y-2.5 sm:space-y-3">
                          {/* Row 1: Name & Phone */}
                          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                            <div>
                              <label className="mb-1 block text-[0.62rem] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.11em] text-slate-600 truncate">
                                Your Name
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Rahul"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-10 sm:h-10.5 rounded-xl border border-sky-200/90 bg-white px-3 text-xs sm:text-sm text-slate-900 shadow-2xs transition-all focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[0.62rem] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.11em] text-slate-600 truncate">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="10-digit number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full h-10 sm:h-10.5 rounded-xl border border-sky-200/90 bg-white px-3 text-xs sm:text-sm text-slate-900 shadow-2xs transition-all focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                              />
                            </div>
                          </div>

                          {/* Row 2: Email */}
                          <div>
                            <label className="mb-1 block text-[0.62rem] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.11em] text-slate-600">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="you@domain.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full h-10 sm:h-10.5 rounded-xl border border-sky-200/90 bg-white px-3 text-xs sm:text-sm text-slate-900 shadow-2xs transition-all focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                            />
                          </div>

                          {/* Row 3: Preferred Frame & Request Type (Custom Select with 100% boundary containment) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                            <div data-custom-select>
                              <CustomSelect
                                id="modal-frame-select"
                                label="Preferred Frame"
                                value={formData.frame}
                                options={frameOptions}
                                isOpen={activeDropdown === "frame"}
                                onToggle={() =>
                                  setActiveDropdown(activeDropdown === "frame" ? null : "frame")
                                }
                                onSelect={(val) => {
                                  setFormData({ ...formData, frame: val });
                                  setActiveDropdown(null);
                                }}
                              />
                            </div>
                            <div data-custom-select>
                              <CustomSelect
                                id="modal-service-select"
                                label="Request Type"
                                value={formData.service}
                                options={serviceOptions}
                                isOpen={activeDropdown === "service"}
                                onToggle={() =>
                                  setActiveDropdown(activeDropdown === "service" ? null : "service")
                                }
                                onSelect={(val) => {
                                  setFormData({ ...formData, service: val });
                                  setActiveDropdown(null);
                                }}
                              />
                            </div>
                          </div>

                          {/* Row 4: Preferred Date */}
                          <div>
                            <label className="mb-1 block text-[0.62rem] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.11em] text-slate-600">
                              Preferred Date
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full h-10 sm:h-10.5 appearance-none rounded-xl border border-sky-200/90 bg-white px-3 text-xs sm:text-sm text-slate-900 shadow-2xs transition-all focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Section: Single-line button that NEVER breaks or gets cut off */}
                      <div className="mt-4 pt-1 pb-1">
                        <button
                          type="submit"
                          disabled={sending}
                          className="shine group relative flex h-11 sm:h-11.5 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0b1a30] via-[#0f274a] to-[#0284c7] px-4 text-xs sm:text-[0.78rem] font-bold uppercase tracking-[0.11em] text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-70 touch-manipulation whitespace-nowrap"
                        >
                          <span className="whitespace-nowrap">{sending ? "Securing appointment..." : "Request Appointment"}</span>
                          <Send className="size-3.5 shrink-0 text-sky-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* ========================================================= */}
                {/* RIGHT COLUMN: AYN Atelier Brand Visual                    */}
                {/* HIDE ON MOBILE (hidden lg:flex)                           */}
                {/* ========================================================= */}
                <div className="hidden lg:flex lg:col-span-5 h-full min-h-full relative flex-col items-center justify-center bg-gradient-to-b from-[#eaf6ff] via-[#d6effe] to-[#c2e4fc] p-5.5 border-l border-sky-200/70 select-none overflow-hidden">
                  <div className="pointer-events-none absolute -top-8 -right-8 size-44 rounded-full bg-white/80 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 size-48 rounded-full bg-sky-400/25 blur-3xl" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.7),transparent_70%)]" />

                  <div className="relative w-full max-w-[270px] sm:max-w-[290px] rounded-2xl overflow-hidden shadow-[0_16px_40px_-10px_rgba(14,165,233,0.32)] border-2 border-white/95 transition-all duration-300 hover:shadow-[0_22px_50px_-10px_rgba(14,165,233,0.42)] hover:scale-[1.015]">
                    <img
                      src={assetUrl("/assets/images/ayn_atelier_popup.jpg")}
                      alt="AYN Eye Clinic & Specs Store — See the World Differently"
                      className="w-full h-auto object-cover block"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
