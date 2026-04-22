import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SEO_TARGET_KEYWORDS, getAbsoluteUrl } from "../../lib/seo";

const MANAGED_ATTR = "data-seo-managed";

function appendMeta(head, attrs) {
  const meta = document.createElement("meta");
  Object.entries(attrs).forEach(([key, value]) => {
    meta.setAttribute(key, value);
  });
  meta.setAttribute(MANAGED_ATTR, "true");
  head.appendChild(meta);
}

function appendLink(head, attrs) {
  const link = document.createElement("link");
  Object.entries(attrs).forEach(([key, value]) => {
    link.setAttribute(key, value);
  });
  link.setAttribute(MANAGED_ATTR, "true");
  head.appendChild(link);
}

function appendJsonLd(head, payload) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute(MANAGED_ATTR, "true");
  script.text = JSON.stringify(payload);
  head.appendChild(script);
}

export default function SeoHead({
  title,
  description,
  path,
  image = "/images/hero.jpg",
  type = "website",
  robots = "index,follow",
  keywords = [],
  jsonLd = [],
}) {
  const location = useLocation();
  const currentPath = path || location.pathname;

  const canonicalUrl = useMemo(() => getAbsoluteUrl(currentPath), [currentPath]);
  const imageUrl = useMemo(() => getAbsoluteUrl(image), [image]);
  const finalKeywords = useMemo(
    () => Array.from(new Set([...SEO_TARGET_KEYWORDS, ...keywords])),
    [keywords],
  );
  const jsonLdItems = useMemo(() => {
    if (!jsonLd) return [];
    return Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  }, [jsonLd]);

  useEffect(() => {
    const head = document.head;
    if (!head) return;

    document.title = title;
    document.documentElement.lang = "id";

    head.querySelectorAll(`[${MANAGED_ATTR}="true"]`).forEach((node) => node.remove());

    appendMeta(head, { name: "description", content: description });
    appendMeta(head, { name: "robots", content: robots });
    appendMeta(head, { name: "googlebot", content: robots });
    appendMeta(head, { name: "keywords", content: finalKeywords.join(", ") });

    appendMeta(head, { property: "og:type", content: type });
    appendMeta(head, { property: "og:title", content: title });
    appendMeta(head, { property: "og:description", content: description });
    appendMeta(head, { property: "og:url", content: canonicalUrl });
    appendMeta(head, { property: "og:image", content: imageUrl });
    appendMeta(head, { property: "og:locale", content: "id_ID" });
    appendMeta(head, { property: "og:site_name", content: "Proskuneo Church" });

    appendMeta(head, { name: "twitter:card", content: "summary_large_image" });
    appendMeta(head, { name: "twitter:title", content: title });
    appendMeta(head, { name: "twitter:description", content: description });
    appendMeta(head, { name: "twitter:image", content: imageUrl });

    appendLink(head, { rel: "canonical", href: canonicalUrl });

    jsonLdItems.forEach((item) => {
      if (item && typeof item === "object") {
        appendJsonLd(head, item);
      }
    });
  }, [canonicalUrl, description, finalKeywords, imageUrl, jsonLdItems, robots, title, type]);

  return null;
}
