import Image from "@/components/common/Image";
import Link from "@/components/common/Link";
import { cn } from "@/utils/cn";

export function Logo({ variant = "light", className, compact = false }) {
  const isLight = variant === "light";

  return (
    <Link
      href="#home"
      className={cn(
        "group inline-flex items-center transition-transform duration-300 hover:scale-[1.02]",
        className
      )}
      aria-label="AYN – Eye Clinic & Specs Store"
    >
      <div className="relative aspect-[983/196] w-[148px] sm:w-[175px] lg:w-[205px]">
        {/* Dark Royal Navy Logo with Antique Gold rules for light backgrounds (Header / light theme) */}
        <Image
          src="/assets/images/ayn-logo-dark.png"
          alt="AYN – Eye Clinic & Specs Store"
          fill
          priority
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 175px, 205px"
          className={cn(
            "object-contain object-left transition-opacity duration-300",
            isLight ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Crisp White Logo with Radiant Gold rules for dark backgrounds (Footer / mobile menu) */}
        <Image
          src="/assets/images/ayn-logo-light.png"
          alt="AYN – Eye Clinic & Specs Store"
          fill
          priority
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 175px, 205px"
          className={cn(
            "object-contain object-left transition-opacity duration-300",
            isLight ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </Link>
  );
}
