export function assetUrl(path) {
  if (!path || typeof path !== "string") return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const base = import.meta.env.BASE_URL || "/";
  if (base !== "/" && path.startsWith(base)) {
    return path;
  }
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${clean}`;
}

