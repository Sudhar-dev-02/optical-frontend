import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import {
  BRAND_PILLS,
  PRODUCTS,
} from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/utils/cn";

export function ProductCatalog() {
  const [brand, setBrand] = useState("All Brands");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    if (brand === "All Brands") return PRODUCTS;
    return PRODUCTS.filter((product) => product.brand === brand);
  }, [brand]);

  useEffect(() => {
    setVisibleCount(8);
  }, [brand]);

  useEffect(() => {
    const handleFilterBrand = (e) => {
      if (e.detail) {
        setBrand(e.detail);
        const el = document.getElementById("collection");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("filter-brand", handleFilterBrand);
    return () => window.removeEventListener("filter-brand", handleFilterBrand);
  }, []);

  const hasFilters = brand !== "All Brands";

  const reset = () => {
    setBrand("All Brands");
  };

  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="collection" className="relative overflow-hidden bg-[#eaf4fa] py-20 sm:py-28 text-slate-900">
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#daf0fd]/50 via-[#eaf4fa]/20 to-transparent" />
      <div className="container-luxe relative">
        {/* 1. COLLECTION HEADER */}
        <div className="pb-2">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="max-w-4xl font-sans text-[clamp(2.7rem,5.4vw,5.2rem)] font-extrabold tracking-[-0.035em] text-[#0b1320] leading-[1.03]">
              Find the frame that
              <br />
              <span className="text-slate-700">feels like you.</span>
            </h2>
          </motion.div>
        </div>

        {/* 2. SEAMLESS BRAND FILTER PILLS (Clean, Content-Hugging, Zero Deadspace) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-wrap items-center gap-2 sm:gap-2.5"
        >
          {BRAND_PILLS.map((option) => (
            <FilterPill
              key={option}
              groupId="brand"
              active={brand === option}
              onClick={() => setBrand(option)}
              label={option}
            />
          ))}

          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/60 bg-white/90 px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-sky-50 hover:text-sky-900 shadow-2xs cursor-pointer"
            >
              <RotateCcw className="size-3 text-sky-600" />
              <span>Reset</span>
            </motion.button>
          )}
        </motion.div>

        {/* 3. PRODUCT CARDS GRID */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-10 rounded-[1.6rem] border border-dashed border-ink/20 bg-white/60 px-6 py-16 text-center shadow-sm backdrop-blur-md">
            <p className="font-serif text-3xl text-ink">No frames in this edit.</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-ink/60">
              Try a different filter combination, or visit our Anna Salai clinic and our opticians will calibrate the ideal frame for you.
            </p>
            <button type="button" onClick={reset} className="btn-dark mt-6">
              <span>Show all frames</span>
            </button>
          </div>
        )}

        {/* Load More Pagination */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4">
          {visibleCount < filtered.length ? (
            <button
              type="button"
              onClick={() => setVisibleCount(filtered.length)}
              className="btn-dark shine cursor-pointer"
            >
              <span>View all {filtered.length} frames</span>
              <ArrowRight className="size-4" />
            </button>
          ) : filtered.length > 8 ? (
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-ink/60">
              ✦ You have explored the full collection
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function FilterPill({ groupId, active, onClick, label }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1.5, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative z-10 shrink-0 rounded-full px-4 py-2 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-[0.13em] transition-all duration-200 border cursor-pointer",
        active
          ? "border-transparent text-white shadow-md"
          : "border-sky-200/90 bg-white/80 text-slate-700 hover:border-sky-400 hover:bg-white hover:text-slate-900 shadow-2xs",
      )}
    >
      {active && (
        <motion.span
          layoutId={`active-filter-pill-${groupId}`}
          className="absolute inset-0 -z-10 rounded-full bg-[#0b1320] shadow-md"
          transition={{ type: "spring", stiffness: 440, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">
        {active && <span className="size-1.5 rounded-full bg-sky-400" />}
        {label}
      </span>
    </motion.button>
  );
}

