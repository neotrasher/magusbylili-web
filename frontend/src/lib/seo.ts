import { useEffect } from "react";

const DEFAULT_TITLE = "Magus By Lili";
const DEFAULT_DESCRIPTION = "Joyeria artesanal en Colombia: aretes, collares, pulseras y sets hechos a mano.";
const DEFAULT_IMAGE = "/logo-magus.png";

function upsertMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (el) {
    el.setAttribute(attr, value);
    return;
  }
  const meta = document.createElement("meta");
  const [key, keyValue] = selector.replace(/\[|\]|\"/g, "").split("=");
  if (key && keyValue) meta.setAttribute(key, keyValue);
  meta.setAttribute(attr, value);
  document.head.appendChild(meta);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSeo({
  title,
  description,
  image,
  canonical,
}: {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
}) {
  useEffect(() => {
    document.title = title ? `${title} · ${DEFAULT_TITLE}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const img = image || DEFAULT_IMAGE;
    const base = import.meta.env.VITE_SITE_URL || window.location.origin;
    const canon = canonical || `${base}${window.location.pathname}`;

    upsertMeta('meta[name="description"]', "content", desc);
    upsertMeta('meta[property="og:title"]', "content", title || DEFAULT_TITLE);
    upsertMeta('meta[property="og:description"]', "content", desc);
    upsertMeta('meta[property="og:image"]', "content", img);
    upsertMeta('meta[property="og:url"]', "content", canon);
    upsertMeta('meta[name="twitter:title"]', "content", title || DEFAULT_TITLE);
    upsertMeta('meta[name="twitter:description"]', "content", desc);
    upsertMeta('meta[name="twitter:image"]', "content", img);
    upsertMeta('meta[name="robots"]', "content", "index,follow");
    upsertLink("canonical", canon);
  }, [title, description, image, canonical]);
}
