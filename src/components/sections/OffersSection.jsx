import Image from "@/components/common/Image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  Sparkles,
  Tag,
} from "lucide-react";
import { OFFERS } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/utils/cn";

const pad = (value) => String(value).padStart(2, "0");

export function OffersSection() {
  const [active, setActive] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: "--",
    minutes: "--",
    seconds: "--",
  });
  const [claimed, setClaimed] = useState(null);
  const { notify } = useStore();

  useEffect(() => {
    const storageKey = "ayncare:sale-end";
    let end = Number(window.localStorage.getItem(storageKey));
    if (!end || Number.isNaN(end) || end < Date.now()) {
      end = Date.now() + 8 * 60 * 60 * 1000 + 24 * 60 * 1000 + 36 * 1000;
      window.localStorage.setItem(storageKey, String(end));
    }

    const tick = () => {
      const remaining = Math.max(0, end - Date.now());
      const hours = Math.floor(remaining / 3_600_000);
      const minutes = Math.floor((remaining % 3_600_000) / 60_000);
      const seconds = Math.floor((remaining % 60_000) / 1000);
      setTimeLeft({
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(
      () => setActive((current) => (current + 1) % OFFERS.length),
      6500,
    );
    return () => window.clearInterval(interval);
  }, []);

  const go = useCallback((direction) => {
    setActive((current) => (current + direction + OFFERS.length) % OFFERS.length);
  }, []);

  const claim = async (offer) => {
    try {
      await navigator.clipboard.writeText(offer.code);
    } catch {
      // Clipboard permissions fallback
    }
    setClaimed(offer.code);
    notify(`Offer claimed · ${offer.code} copied to clipboard`);
    window.setTimeout(() => setClaimed(null), 3200);
  };

  const offer = OFFERS[active];

  return (
    <section className="relative overflow-hidden bg-[#0a110d] py-20 text-cream sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(200,166,106,0.09),transparent_32%),radial-gradient(circle_at_8%_90%,rgba(35,74,60,0.38),transparent_36%)]" />
      <div className="noise-overlay" />

      <div className="container-luxe relative">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-gold">The Ayn Care edit</p>
            <h2 className="display-serif mt-4 text-[clamp(2.5rem,5vw,4.8rem)] text-cream">
              An invitation to
              <br />
              <span className="italic text-gold-light">see things differently.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <div className="hidden text-right sm:block">
              <p className="text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-cream/55">
                Flash sale ends in
              </p>
              <p className="mt-1 text-[0.62rem] text-cream/55">A little clarity goes a long way.</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-md">
              <Clock3 className="mr-1 size-4 text-gold" strokeWidth={1.5} />
              {[
                { value: timeLeft.hours, label: "HRS" },
                { value: timeLeft.minutes, label: "MIN" },
                { value: timeLeft.seconds, label: "SEC" },
              ].map((unit, index) => (
                <div key={unit.label} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span className="text-sm text-cream/55">:</span>
                  ) : null}
                  <div className="text-center">
                    <span className="block min-w-7 font-serif text-2xl leading-none tabular-nums text-cream">
                      {unit.value}
                    </span>
                    <span className="mt-1 block text-[0.42rem] font-semibold tracking-[0.16em] text-cream/55">
                      {unit.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.65fr_0.7fr]">
          <div className="group relative min-h-[32rem] overflow-hidden rounded-[1.7rem] border border-white/10 sm:min-h-[35rem]">
            <AnimatePresence initial={false}>
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, scale: 1.045 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={offer.image}
                  alt={offer.highlight}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
                <div className={cn("absolute inset-0 bg-gradient-to-r", offer.accent)} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-black/15" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-8">
              <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[0.53rem] font-semibold uppercase tracking-[0.17em] text-cream/70 backdrop-blur-md">
                <Sparkles className="size-3 text-gold" />
                {offer.detail}
              </span>
              <span className="font-serif text-sm italic text-cream/55">
                0{active + 1} <span className="text-cream/55">/ 0{OFFERS.length}</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${offer.id}-content`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-12"
              >
                <p className="eyebrow text-gold-light/80">{offer.kicker}</p>
                <h3 className="display-serif mt-4 max-w-2xl text-[clamp(2.6rem,6vw,5rem)] text-cream">
                  {offer.title}
                </h3>
                <p className="mt-4 max-w-md text-[0.82rem] leading-6 text-cream/55">
                  {offer.description}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => claim(offer)}
                    className="btn-primary shine !border-gold-light !bg-cream !text-ink cursor-pointer"
                  >
                    <span>Claim offer</span>
                    {claimed === offer.code ? (
                      <Check className="size-4" />
                    ) : (
                      <ArrowUpRight className="size-4" />
                    )}
                  </button>
                  <span className="flex items-center gap-2 rounded-full border border-dashed border-gold/40 bg-black/20 px-4 py-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-gold-light backdrop-blur-md">
                    <Tag className="size-3.5" />
                    {offer.code}
                  </span>
                  <span className="hidden items-center gap-1.5 text-[0.55rem] text-cream/55 sm:flex">
                    <Copy className="size-3" />
                    Tap to copy
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 right-6 hidden gap-2 sm:flex lg:right-10">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-11 place-items-center rounded-full border border-white/15 bg-black/25 text-cream backdrop-blur-md transition hover:border-gold/60 hover:bg-gold hover:text-ink cursor-pointer"
                aria-label="Previous offer"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-11 place-items-center rounded-full border border-white/15 bg-black/25 text-cream backdrop-blur-md transition hover:border-gold/60 hover:bg-gold hover:text-ink cursor-pointer"
                aria-label="Next offer"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {OFFERS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 lg:min-h-0 lg:flex-1 cursor-pointer",
                  index === active
                    ? "border-gold/45 bg-gold/[0.11]"
                    : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]",
                )}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-gold/70">
                    0{index + 1}
                  </span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      index === active ? "bg-gold" : "bg-cream/15",
                    )}
                  />
                </div>
                <div className="relative z-10 mt-5">
                  <p className="font-serif text-[1.3rem] leading-tight text-cream">{item.highlight}</p>
                  <p className="mt-1 text-[0.55rem] uppercase tracking-[0.13em] text-cream/55">
                    Code · {item.code}
                  </p>
                </div>
                <ArrowUpRight className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-cream/0 transition-all duration-500 group-hover:text-gold/50" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
          {OFFERS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                index === active ? "w-8 bg-gold" : "w-2 bg-cream/15",
              )}
              aria-label={`Show offer ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

