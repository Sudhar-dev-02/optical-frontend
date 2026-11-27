import Image from "@/components/common/Image";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MessageCircle, X } from "lucide-react";
import { SITE } from "@/data/site";
import { useStore } from "@/context/StoreContext";

export function ProductQuickView() {
  const { selectedProduct, setSelectedProduct, setAppointmentOpen } = useStore();

  const product = selectedProduct;
  const image = product ? product.image : "";

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} details`}
        >
          <style>{`
            .quickview-pedestal-shadow {
              position: absolute;
              bottom: 12%;
              left: 50%;
              transform: translateX(-50%);
              width: 64%;
              height: 12px;
              border-radius: 50%;
              background: radial-gradient(ellipse at center, rgba(14, 165, 233, 0.16) 0%, rgba(15, 23, 42, 0.04) 55%, transparent 75%);
              pointer-events: none;
              z-index: 2;
            }
          `}</style>
          <button
            type="button"
            className="absolute inset-0 bg-[#070e1b]/80 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}
            aria-label="Close product details"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid w-full max-w-[700px] overflow-hidden rounded-2xl sm:rounded-3xl border border-sky-200/80 bg-[#f8fcff] shadow-[0_25px_70px_-15px_rgba(14,165,233,0.25)] md:grid-cols-[1.05fr_0.95fr]"
          >
            {/* Top Cyan Accent Strip */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 z-40" />

            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-3.5 top-3.5 z-30 grid size-8.5 place-items-center rounded-full border border-sky-200/80 bg-white/95 text-slate-700 backdrop-blur-md transition hover:bg-sky-500 hover:border-sky-500 hover:text-white cursor-pointer shadow-md"
              aria-label="Close product details"
            >
              <X className="size-4" />
            </button>

            {/* Left: Product Image on studio pedestal (Lite Blue Studio Gradient) */}
            <div className="relative flex min-h-[240px] items-center justify-center bg-gradient-to-b from-[#f0f7fd] via-[#e2f1fc] to-[#d6ecfb] sm:min-h-[280px] md:min-h-[320px]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.7),transparent_70%)]" />
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <div className="quickview-pedestal-shadow" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={image}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 flex items-center justify-center p-6 sm:p-8"
                  >
                    <Image
                      src={image}
                      alt={`${product.brand} ${product.name} optical frame`}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-contain object-center p-3 sm:p-5"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute left-3.5 top-3.5 z-20 flex gap-2">
                  <span className="rounded-full bg-[#0b1320]/85 px-2.5 py-1 text-[0.48rem] font-bold uppercase tracking-[0.16em] text-sky-200 backdrop-blur-md shadow-sm border border-white/15">
                    {product.badge ?? "Optics Atelier"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & CTAs */}
            <div className="relative flex flex-col justify-between p-5 sm:p-6 md:p-7 bg-white/90 sm:bg-white/75 backdrop-blur-md border-t md:border-t-0 md:border-l border-sky-100">
              <div>
                <div className="flex items-center justify-between gap-2 pr-9">
                  <p className="text-[0.56rem] font-bold uppercase tracking-[0.2em] text-sky-850">
                    {product.brand} · {product.modelCode}
                  </p>
                </div>

                <h3 className="display-serif mt-2.5 text-2xl sm:text-[1.75rem] font-normal leading-tight text-[#0b1320] pr-6">
                  {product.name}
                </h3>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
                    `Hello Ayn Care, I'm interested in the ${product.name} (${product.modelCode}). Could you help me with availability?`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#0b1320] px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all duration-200 hover:bg-[#128C7E] active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="size-3.5 text-[#25D366] transition-transform duration-200 group-hover:scale-110 shrink-0" />
                  <span className="text-white font-bold tracking-wider">Ask about this frame on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(null);
                    setAppointmentOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50/80 hover:bg-sky-100 hover:border-sky-300 px-4 py-2.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-sky-950 shadow-2xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <Calendar className="size-3.5 text-sky-600 shrink-0" />
                  <span className="text-sky-950 font-bold tracking-wider">Book Private In-Store Fitting</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

