import Image from "@/components/common/Image";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/context/StoreContext";

const POPULAR = ["Titanium", "Cat-Eye", "Aviator", "ARCADIO", "Rimless"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, setSelectedProduct } = useStore();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  const results = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    if (!term) return [];
    return PRODUCTS.filter((product) =>
      [
        product.name,
        product.brand,
        product.shape,
        product.frameType,
        product.material,
        product.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term),
    ).slice(0, 5);
  }, [deferredQuery]);

  return (
    <AnimatePresence>
      {searchOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] bg-ink/92 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <style>{`
            .search-noise {
              position: absolute;
              inset: 0;
              pointer-events: none;
              opacity: 0.055;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.9'/%3E%3C/svg%3E");
              mix-blend-mode: soft-light;
            }
          `}</style>
          <div className="search-noise" />
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="container-luxe mx-auto flex h-full max-w-5xl flex-col pb-8 pt-8 sm:pt-14"
          >
            <div className="flex items-center justify-between">
              <span className="eyebrow text-gold">Search the atelier</span>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="icon-button cursor-pointer"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 border-b border-white/15 pb-5 sm:mt-16">
              <Search className="size-5 shrink-0 text-gold sm:size-7" strokeWidth={1.4} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search frames, brands or shapes..."
                className="w-full bg-transparent font-serif text-[1.7rem] leading-tight text-cream placeholder:text-cream/55 focus:outline-none sm:text-[2.6rem]"
                aria-label="Search frames"
              />
              <span className="hidden text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-cream/55 sm:block">
                Esc to close
              </span>
            </div>

            <div className="mt-8 grid flex-1 gap-10 overflow-y-auto sm:grid-cols-[0.85fr_1.4fr]">
              <div>
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-cream/55">
                  Popular right now
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {POPULAR.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="rounded-full border border-white/12 px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-cream/70 transition hover:border-gold/50 hover:text-gold cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <p className="mt-10 hidden max-w-xs text-sm leading-7 text-cream/55 sm:block">
                  Search across our curated designer eyewear collection. Not sure where to begin?
                  Our team is one call away.
                </p>
              </div>

              <div>
                {query.trim() ? (
                  results.length > 0 ? (
                    <div className="space-y-2">
                      <p className="mb-4 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-cream/55">
                        {results.length} {results.length === 1 ? "match" : "matches"}
                      </p>
                      {results.map((product, index) => (
                        <motion.button
                          key={product.id}
                          type="button"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.045, duration: 0.3 }}
                          onClick={() => {
                            setSelectedProduct(product);
                            setSearchOpen(false);
                          }}
                          className="group flex w-full items-center gap-4 rounded-2xl border border-transparent p-2.5 text-left transition hover:border-white/10 hover:bg-white/[0.045] cursor-pointer"
                        >
                          <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-white/5">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="96px"
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-gold/80">
                              {product.brand}
                            </span>
                            <span className="mt-1 block truncate font-serif text-xl text-cream">
                              {product.name}
                            </span>
                            <span className="mt-0.5 block text-[0.62rem] font-medium tracking-wide text-cream/55">
                              {product.modelCode}
                            </span>
                          </span>
                          <ArrowRight className="size-4 shrink-0 -translate-x-1 text-cream/55 opacity-0 transition group-hover:translate-x-0 group-hover:text-gold group-hover:opacity-100" />
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                      <p className="font-serif text-2xl text-cream">No frames found.</p>
                      <p className="mt-2 text-sm leading-7 text-cream/55">
                        Try a brand, shape or material. Or call us on +91 93633 34042 and we will
                        find your fit.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {PRODUCTS.slice(0, 4).map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setSearchOpen(false);
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left cursor-pointer"
                      >
                        <span className="relative block aspect-[16/10] overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 45vw, 250px"
                            className="object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                        </span>
                        <span className="absolute inset-x-0 bottom-0 p-4">
                          <span className="block text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-gold/80">
                            {product.brand}
                          </span>
                          <span className="mt-1 block font-serif text-lg leading-tight text-cream">
                            {product.name}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

