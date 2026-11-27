import React, { forwardRef } from "react";

/**
 * Navigation and smooth scrolling Link component
 * Pure React drop-in replacement for next/link
 * Automatically handles anchor links (#section) with smooth scroll animation.
 */
export const Link = forwardRef(function Link(
  {
    href = "#",
    children,
    className = "",
    onClick,
    target,
    rel,
    ...rest
  },
  ref
) {
  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }

    if (
      !event.defaultPrevented &&
      typeof href === "string" &&
      href.startsWith("#")
    ) {
      const targetId = href.slice(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const computedRel =
    target === "_blank" ? rel || "noopener noreferrer" : rel;

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onClick={handleClick}
      target={target}
      rel={computedRel}
      {...rest}
    >
      {children}
    </a>
  );
});

export default Link;

