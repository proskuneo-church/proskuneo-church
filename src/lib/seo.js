export const SEO_TARGET_KEYWORDS = [
  "Gereja JKI Surabaya",
  "Gereja Surabaya",
  "JKI Proskuneo",
  "Gereja Proskuneo",
];

export function getSiteUrl() {
  const envUrl = (import.meta.env.VITE_SITE_URL || "").trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return "";
}

export function getAbsoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return path;

  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export function buildSeoDescription(text, fallback) {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) return fallback;
  if (raw.length <= 160) return raw;
  return `${raw.slice(0, 157)}...`;
}
