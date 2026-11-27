import Link from "@/components/common/Link";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  LogIn,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/context/StoreContext";
import { NAV_LINKS, SITE } from "@/data/site";
import { cn } from "@/utils/cn";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const {
    setAppointmentOpen,
    setSearchOpen,
    menuOpen,
    setMenuOpen,
  } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --nav-height: 4.5rem;
        }
        .header-scrolled-blur {
          backdrop-filter: blur(24px) saturate(135%);
          -webkit-backdrop-filter: blur(24px) saturate(135%);
        }
      `}</style>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-all duration-400",
          scrolled
            ? "header-scrolled-blur border-b border-sky-300/30 bg-white/85 text-slate-900 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.08)]"
            : "border-b border-sky-200/30 bg-white/40 text-slate-800 backdrop-blur-md",
        )}
      >
        <div className="container-luxe flex h-[var(--nav-height)] items-center justify-between gap-5">
          <Logo variant="dark" />

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="link-underline text-[0.62rem] font-bold uppercase tracking-[0.2em] text-slate-700 hover:text-slate-950 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="icon-button border-slate-900/10 text-slate-800 hover:bg-slate-900/5 hover:text-slate-950 cursor-pointer"
              aria-label="Search"
            >
              <Search className="size-[17px]" strokeWidth={1.8} />
            </button>

            <button
              type="button"
              onClick={() => setAppointmentOpen(true)}
              className="ml-1 hidden items-center gap-2 rounded-full border border-slate-900/15 bg-[#0d1522] px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-all duration-300 hover:bg-slate-800 active:scale-95 cursor-pointer xl:flex"
              title="Reserve your private seat at the atelier"
            >
              <CalendarCheck className="size-3.5 text-sky-400" />
              <span>Book a Visit</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-900/15 bg-white/85 px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-slate-900 shadow-sm transition-all duration-300 hover:bg-slate-900 hover:text-white active:scale-95 cursor-pointer"
              title="Staff & Admin Software Login"
            >
              <LogIn className="size-3.5 text-sky-600" />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={cn(
                "icon-button cursor-pointer lg:hidden",
                !scrolled && "border-slate-900/10 text-slate-800 hover:bg-slate-900/5 hover:text-slate-950",
              )}
              aria-label="Open menu"
            >
              <Menu className="size-[18px]" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col justify-between bg-[#070e1b] text-slate-100 overflow-y-auto overscroll-contain"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="noise-overlay" />

            {/* Top Bar: Perfectly Aligned Logo & Close Button */}
            <div className="container-luxe relative flex h-[var(--nav-height)] items-center justify-between border-b border-white/10 shrink-0">
              <Logo variant="light" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-200 shadow-sm transition-all hover:bg-white/15 hover:border-white/30 active:scale-90 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Middle Nav: Vertically Balanced & Centered List */}
            <nav className="container-luxe relative flex flex-1 flex-col justify-center py-4 sm:py-6">
              <div className="space-y-0.5">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/[0.08]"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between py-3.5 sm:py-4 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-[0.62rem] font-semibold tracking-widest text-sky-400/80 group-hover:text-sky-300">
                          0{index + 1}
                        </span>
                        <span className="display-serif text-[1.85rem] sm:text-[2.2rem] leading-none tracking-[-0.02em] text-white transition-all group-hover:text-sky-200 group-hover:translate-x-1">
                          {link.label}
                        </span>
                      </span>
                      <div className="grid size-7 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-all group-hover:border-sky-400/40 group-hover:bg-sky-500/15 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight className="size-3.5 stroke-[2.2]" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Bottom Section: Balanced Contact Grid & 50/50 Actions */}
            <div className="container-luxe relative flex flex-col gap-3 border-t border-white/10 pt-4 pb-6 sm:pb-8 shrink-0">
              {/* Dual Contact Strip (Store Call + WhatsApp) */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${SITE.phones[0].raw}`}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-sky-400/40 hover:bg-sky-500/10"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-sky-500/20 text-sky-300">
                    <Phone className="size-3" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[0.52rem] uppercase font-bold tracking-wider text-slate-400">Call Store</span>
                    <span className="block text-[0.72rem] font-bold text-white truncate">{SITE.phones[0].display}</span>
                  </div>
                </a>

                <a
                  href={SITE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 transition-colors hover:bg-emerald-500/20"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-emerald-500/30 text-emerald-300">
                    <MessageCircle className="size-3" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[0.52rem] uppercase font-bold tracking-wider text-emerald-400">WhatsApp</span>
                    <span className="block text-[0.72rem] font-bold text-white truncate">{SITE.phones[1]?.display || "+91 97892 29107"}</span>
                  </div>
                </a>
              </div>

              {/* Atelier Address */}
              <div className="flex items-start gap-2 text-slate-400 text-[0.72rem] leading-snug px-0.5">
                <MapPin className="size-3.5 text-sky-400 shrink-0 mt-0.5" />
                <p className="line-clamp-2">
                  No 10 ALC Complex, Opposite Periyar Statue, Anna Salai, Tiruvannamalai
                </p>
              </div>

              {/* 50/50 Primary Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setAppointmentOpen(true);
                  }}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 px-3 text-[0.72rem] font-bold uppercase tracking-wider text-[#060b14] shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <CalendarDays className="size-3.5 text-[#060b14]" />
                  <span>Book Visit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 text-[0.72rem] font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
                >
                  <Search className="size-3.5 text-sky-300" />
                  <span>Search</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-sky-400/35 bg-sky-500/15 px-3 text-[0.72rem] font-bold uppercase tracking-wider text-white transition-all hover:bg-sky-500/25 active:scale-95 cursor-pointer"
              >
                <LogIn className="size-3.5 text-sky-300" />
                <span>Staff Login</span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
