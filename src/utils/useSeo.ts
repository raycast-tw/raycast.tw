import { useEffect } from "react";

const BASE_TITLE = "Raycast Community Taiwan";
const BASE_DESC =
  "連結台灣的 Raycast 使用者，分享更有效率的用法。探索功能、參與活動，找到一起成長的夥伴。";
const BASE_URL = "https://raycast.tw";
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

function applyMeta(title: string, desc: string, url: string) {
  document.title = title;
  setMetaContent('meta[name="description"]', desc);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', desc);
  setMetaContent('meta[property="og:url"]', url);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', desc);
  setCanonical(url);
}

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  jsonLd?: object;
}

export function useSeo({ title, description, path, jsonLd }: SeoProps) {
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const fullTitle = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
    const desc = description ?? BASE_DESC;
    const url = path ? `${BASE_URL}${path}` : BASE_URL;

    applyMeta(fullTitle, desc, url);

    const existing = document.getElementById(
      JSONLD_ID,
    ) as HTMLScriptElement | null;
    if (jsonLdStr) {
      const el =
        existing ??
        (() => {
          const s = document.createElement("script");
          s.id = JSONLD_ID;
          s.type = "application/ld+json";
          document.head.appendChild(s);
          return s;
        })();
      el.textContent = jsonLdStr;
    } else {
      existing?.remove();
    }

    return () => {
      applyMeta(BASE_TITLE, BASE_DESC, BASE_URL);
      document.getElementById(JSONLD_ID)?.remove();
    };
  }, [title, description, path, jsonLdStr]);
}
