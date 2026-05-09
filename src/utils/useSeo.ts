import { useEffect } from "react";
import { SITE_URL } from "./siteUrl";

const BASE_TITLE = "Raycast Community Taiwan";
const BASE_DESC =
  "連結台灣的 Raycast 使用者，分享更有效率的用法。探索功能、參與活動，找到一起成長的夥伴。";
const BASE_URL = SITE_URL;
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const JSONLD_ID = "seo-jsonld-dynamic";

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute("content", content);
}

function setCanonical(href: string) {
  const existing = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  const el =
    existing ??
    (() => {
      const link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
      return link;
    })();
  el.href = href;
}

function applyMeta(title: string, desc: string, url: string, image: string) {
  document.title = title;
  setMetaContent('meta[name="description"]', desc);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', desc);
  setMetaContent('meta[property="og:url"]', url);
  setMetaContent('meta[property="og:image"]', image);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', desc);
  setMetaContent('meta[name="twitter:image"]', image);
  setCanonical(url);
}

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  jsonLd?: object | object[];
}

export function useSeo({ title, description, path, image, jsonLd }: SeoProps) {
  const jsonLdStr = jsonLd
    ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])
    : undefined;

  useEffect(() => {
    const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
    const desc = description ?? BASE_DESC;
    const url = path ? `${BASE_URL}${path}` : BASE_URL;
    const img = image
      ? image.startsWith("http")
        ? image
        : `${BASE_URL}${image}`
      : DEFAULT_IMAGE;

    applyMeta(fullTitle, desc, url, img);

    // Replace whichever JSON-LD slot is in the head: either the prerendered
    // tag (no id) for the static-routed entry HTML, or the dynamic tag
    // injected by an earlier client navigation. Keeping a single slot prevents
    // duplicate or stale schema across SPA route changes.
    const slot =
      (document.getElementById(JSONLD_ID) as HTMLScriptElement | null) ??
      (document.querySelector(
        'script[type="application/ld+json"]',
      ) as HTMLScriptElement | null);
    if (jsonLdStr) {
      const el =
        slot ??
        (() => {
          const s = document.createElement("script");
          s.type = "application/ld+json";
          document.head.appendChild(s);
          return s;
        })();
      el.id = JSONLD_ID;
      el.textContent = jsonLdStr;
    } else if (slot && slot.id === JSONLD_ID) {
      slot.remove();
    }
  }, [title, description, path, image, jsonLdStr]);
}
