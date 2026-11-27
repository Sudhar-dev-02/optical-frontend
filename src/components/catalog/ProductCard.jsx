import Image from "@/components/common/Image";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/utils/cn";

const badgeStyles = {
  "Best Seller": "bg-ink text-cream",
  "New Arrival": "bg-moss text-cream",
  "Premium Titanium": "bg-gold-light text-ink",
  "Limited Edition": "bg-gold text-ink",
  Premium: "bg-gold-light text-ink",
  Trending: "bg-cream-deep text-ink",
};

export function ProductCard({ product, index }) {
  const { setSelectedProduct } = useStore();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="product-card group relative"
    >
      <style>{`
        .product-card-media {
          isolation: isolate;
          background: radial-gradient(circle at 50% 48%, #ffffff 0%, #f0f7fc 85%, #e1eff8 100%);
          box-shadow: inset 0 0 35px rgba(15, 23, 42, 0.025);
        }
        .product-card-primary-image {
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08));
          will-change: transform, filter;
        }
        .product-card-pedestal {
          position: absolute;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 64%;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(20, 20, 20, 0.16) 0%, rgba(20, 20, 20, 0.03) 55%, transparent 75%);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease;
          pointer-events: none;
          z-index: 2;
        }
        .product-card-reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 15%,
            rgba(255, 255, 255, 0) 38%,
            rgba(255, 255, 255, 0.7) 50%,
            rgba(200, 166, 106, 0.35) 56%,
            transparent 72%
          );
          opacity: 0;
          transform: translateX(-120%);
          pointer-events: none;
          z-index: 10;
        }
        .product-card-actions {
          transform: translateY(10px);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
        }
        @media (hover: hover) {
          .product-card:hover .product-card-primary-image {
            transform: translateY(-6px) scale(1.055);
            filter: drop-shadow(0 16px 26px rgba(0, 0, 0, 0.14));
          }
          .product-card:hover .product-card-pedestal {
            transform: translateX(-50%) scale(0.85);
            opacity: 0.55;
          }
          .product-card:hover .product-card-reflection {
            animation: cardLensGleam 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .product-card:hover .product-card-actions {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }
        }
        @keyframes cardLensGleam {
          0% { opacity: 0; transform: translateX(-120%); }
          40% { opacity: 1; }
          100% { opacity: 0; transform: translateX(120%); }
        }
      `}</style>

      {/* 1. Pure Eyeglasses Frame Media Stage */}
      <div className="product-card-media relative aspect-[4/3] overflow-hidden rounded-[1.2rem] bg-[#f0f7fc]">
        {/* Ambient Pedestal Shadow beneath eyeglasses */}
        <div className="product-card-pedestal" />

        {/* Optical Glass Reflection Gleam Animation on Hover */}
        <div className="product-card-reflection" />

        {/* Studio Eyeglasses Image */}
        <div className="relative size-full p-4 sm:p-5 flex items-center justify-center">
          <Image
            src={product.image}
            alt={`${product.brand} ${product.name} optical frame`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="product-card-primary-image object-contain object-center p-3 sm:p-4"
          />
        </div>

        {/* Click Stage to Open Details */}
        <button
          type="button"
          onClick={() => setSelectedProduct(product)}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`View details for ${product.name}`}
        />

        {/* Badge */}
        {product.badge && product.badge !== "Staff Pick" ? (
          <span
            className={cn(
              "pointer-events-none absolute left-3 top-3 z-20 rounded-full px-3 py-1.5 text-[0.46rem] font-bold uppercase tracking-[0.14em] shadow-sm sm:left-4 sm:top-4",
              badgeStyles[product.badge] ?? "bg-ink text-cream",
            )}
          >
            {product.badge}
          </span>
        ) : null}

        {/* 2. View Details Action */}
        <div className="product-card-actions absolute inset-x-2.5 bottom-2.5 z-20 flex items-center sm:inset-x-3 sm:bottom-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/25 bg-white/95 py-2 px-2.5 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-ink shadow-lg backdrop-blur-xl transition duration-300 hover:bg-ink hover:text-cream active:scale-95"
            title="View frame specifications and fit"
          >
            <Eye className="size-3.5" />
            <span className="truncate">View</span>
          </button>
        </div>
      </div>

      <div className="px-0.5 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-sky-900">
            {product.brand}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedProduct(product)}
          className="mt-1.5 block text-left font-sans text-[1.05rem] font-bold leading-snug text-[#0b1320] transition-colors hover:text-sky-700 sm:text-[1.15rem]"
        >
          {product.name}
        </button>
        <div className="mt-2.5 flex items-center gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color}
              className="size-2 rounded-full border border-ink/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

