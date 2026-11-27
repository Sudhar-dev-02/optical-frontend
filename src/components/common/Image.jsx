import React, { forwardRef } from "react";

/**
 * High-performance responsive Image component
 * Pure React drop-in replacement for next/image
 * Handles fill layout, high-priority loading, aspect ratios, responsive sizing,
 * and automatic resolution to /assets/images/ folder.
 */
export const Image = forwardRef(function Image(
  {
    src,
    alt = "",
    fill = false,
    priority = false,
    sizes,
    width,
    height,
    className = "",
    style = {},
    loading,
    decoding = "async",
    unoptimized,
    quality,
    placeholder,
    blurDataURL,
    ...rest
  },
  ref
) {
  let imageSrc = typeof src === "object" && src !== null ? src.src || "" : src;

  if (
    typeof imageSrc === "string" &&
    imageSrc.length > 0 &&
    !imageSrc.startsWith("http://") &&
    !imageSrc.startsWith("https://") &&
    !imageSrc.startsWith("data:") &&
    !imageSrc.startsWith("blob:")
  ) {
    const base = import.meta.env.BASE_URL || "/";
    if (imageSrc.startsWith("/assets/images/")) {
      imageSrc = `${base}${imageSrc.slice(1)}`;
    } else {
      const clean = imageSrc.startsWith("/") ? imageSrc.slice(1) : imageSrc;
      if (!clean.startsWith("fonts/")) {
        imageSrc = `${base}assets/images/${clean}`;
      }
    }
  }

  const computedStyle = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        ...style,
      }
    : style;

  return (
    <img
      ref={ref}
      src={imageSrc}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      loading={loading || (priority ? "eager" : "lazy")}
      fetchPriority={priority ? "high" : "auto"}
      decoding={decoding}
      className={className}
      style={computedStyle}
      {...rest}
    />
  );
});

export default Image;
