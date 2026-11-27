import { MessageCircle } from "lucide-react";
import { SITE } from "@/data/site";

const DEFAULT_WHATSAPP_MESSAGE =
  "Hello AYN Care, I would like to inquire about designer eyewear frames and eye testing appointments at your studio.";

export function WhatsAppFloat() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    DEFAULT_WHATSAPP_MESSAGE
  )}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[80] group flex items-center">
      {/* Tooltip Label on Hover (Desktop) */}
      <div className="pointer-events-none absolute right-full mr-3.5 hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/25 bg-slate-950/90 px-3.5 py-1.5 text-xs text-white shadow-xl backdrop-blur-md opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-100">Chat with us</span>
        <span className="text-[0.65rem] text-slate-400">· +91 97892 29107</span>
      </div>

      {/* Outer Pulsing Halo Rings (Matching user image) */}
      <span
        aria-hidden="true"
        className="absolute -inset-2.5 sm:-inset-3 rounded-full bg-[#25D366]/20 animate-ping opacity-60 pointer-events-none"
      />
      <span
        aria-hidden="true"
        className="absolute -inset-1.5 sm:-inset-2 rounded-full border border-[#25D366]/40 animate-pulse pointer-events-none"
      />

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with AYN Care (+91 97892 29107)"
        className="relative flex size-14 sm:size-15 items-center justify-center rounded-full bg-gradient-to-tr from-[#1eb853] via-[#25D366] to-[#34e375] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] active:scale-95 cursor-pointer"
      >
        {/* Official WhatsApp Silhouette SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-7 sm:size-8 text-white drop-shadow-sm"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}

