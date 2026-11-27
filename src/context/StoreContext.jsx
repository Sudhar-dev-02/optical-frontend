import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const anyOpen = appointmentOpen || searchOpen || menuOpen || !!selectedProduct;
    document.body.classList.toggle("drawer-open", anyOpen);
    return () => document.body.classList.remove("drawer-open");
  }, [appointmentOpen, searchOpen, menuOpen, selectedProduct]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setAppointmentOpen(false);
      setSearchOpen(false);
      setMenuOpen(false);
      setSelectedProduct(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = useCallback((message) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 3600);
  }, []);

  const value = useMemo(
    () => ({
      appointmentOpen,
      setAppointmentOpen,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      selectedProduct,
      setSelectedProduct,
      notify,
    }),
    [appointmentOpen, searchOpen, menuOpen, selectedProduct, notify],
  );

  return (
    <StoreContext.Provider value={value}>
      <style>{`
        body.drawer-open {
          overflow: hidden;
        }
        .toast-pill {
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }
      `}</style>
      {children}
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="toast-pill fixed bottom-5 left-1/2 z-[120] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[#111611]/95 px-4 py-3 text-cream backdrop-blur-xl sm:bottom-8"
            role="status"
            aria-live="polite"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold text-ink">
              <Check className="size-3.5" strokeWidth={2.4} />
            </span>
            <span className="min-w-0 flex-1 text-[0.72rem] font-medium tracking-wide text-cream/85">
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold/80 transition hover:text-gold"
            >
              Close
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}

