import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { newsletterMeta, parseAuthor } from "../src/data/newsletters/meta";
import { taiwanEvents } from "../src/data/events";
import { SITE_URL } from "../src/utils/siteUrl";
import { ogNode, type OgInput } from "./og-template";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const distDir = path.join(repoRoot, "dist");
const cacheDir = path.join(repoRoot, "node_modules", ".cache", "og-fonts");

interface FontEntry {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
}

async function ensureFile(url: string, fileName: string): Promise<Buffer> {
  const cachePath = path.join(cacheDir, fileName);
  try {
    return await fs.readFile(cachePath);
  } catch {
    /* cache miss */
  }
  console.log(`[seo] downloading font ${fileName}`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch font ${url}: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(cachePath, buf);
  return buf;
}

async function loadLogoDataUri(): Promise<string> {
  const svgPath = path.join(repoRoot, "src", "assets", "raycast.svg");
  const svg = await fs.readFile(svgPath, "utf8");
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

async function loadFonts(): Promise<FontEntry[]> {
  // Noto Sans TC includes Latin glyphs, so a single CJK font covers everything.
  const regularUrl =
    "https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/TC/NotoSansTC-Regular.otf";
  const boldUrl =
    "https://github.com/notofonts/noto-cjk/raw/main/Sans/SubsetOTF/TC/NotoSansTC-Bold.otf";

  const [regular, bold] = await Promise.all([
    ensureFile(regularUrl, "NotoSansTC-Regular.otf"),
    ensureFile(boldUrl, "NotoSansTC-Bold.otf"),
  ]);

  return [
    { name: "Noto Sans TC", data: regular, weight: 400, style: "normal" },
    { name: "Noto Sans TC", data: bold, weight: 700, style: "normal" },
  ];
}

async function renderOg(
  fonts: FontEntry[],
  input: OgInput,
  outputPath: string,
) {
  // satori expects React-element-shaped objects but accepts plain {type, props}.
  // The library's TS types insist on proper React types, so cast through unknown.
  const svg = await satori(
    ogNode(input) as unknown as Parameters<typeof satori>[0],
    {
      width: 1200,
      height: 630,
      fonts,
    },
  );
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const png = resvg.render().asPng();
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, png);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function generateOgImages(fonts: FontEntry[], logoDataUri: string) {
  const ogDir = path.join(distDir, "og");
  await fs.mkdir(ogDir, { recursive: true });

  // Newsletter detail OG images
  for (const n of newsletterMeta) {
    const typeLabel = n.type === "monthly" ? "MONTHLY" : "WEEKLY";
    await renderOg(
      fonts,
      {
        kicker: n.kicker,
        badge: n.episode ? `${typeLabel} · ${n.episode}` : typeLabel,
        title: n.title,
        meta: `${n.date} · ${n.author}`,
        theme: n.theme,
        logoDataUri,
      },
      path.join(ogDir, "newsletter", `${n.id}.png`),
    );
  }

  // Newsletter index OG
  await renderOg(
    fonts,
    {
      kicker: "",
      badge: "NEWSLETTER",
      title: "電子報總覽：Raycast 月報與週報",
      meta: `${newsletterMeta.length} 期 · 中文整理`,
      theme: "crimson",
      logoDataUri,
    },
    path.join(ogDir, "newsletter", "index.png"),
  );

  // Event detail OG images
  for (const event of taiwanEvents) {
    await renderOg(
      fonts,
      {
        kicker: event.imageKicker,
        badge: "EVENT",
        title: event.title,
        meta: `${event.date} · ${event.location}`,
        theme: event.theme,
        logoDataUri,
      },
      path.join(ogDir, "events", `${event.id}.png`),
    );
  }

  // Events index OG
  await renderOg(
    fonts,
    {
      kicker: "",
      badge: "EVENTS",
      title: "活動總覽：Raycast Taiwan 線下聚會",
      meta: "Raycafé · Workshops · Meetups",
      theme: "emerald",
      logoDataUri,
    },
    path.join(ogDir, "events", "index.png"),
  );
}

interface RouteSeo {
  path: string;
  title: string;
  description: string;
  image: string;
  jsonLd: object[];
  type?: "article" | "website";
  publishedTime?: string;
  modifiedTime?: string;
  lastMod: string;
}

function buildRoutes(): RouteSeo[] {
  const routes: RouteSeo[] = [];

  // Home
  routes.push({
    path: "/",
    title: "Raycast Community Taiwan",
    description:
      "連結台灣的 Raycast 使用者，分享更有效率的用法。探索功能、參與活動，找到一起成長的夥伴。",
    image: `${SITE_URL}/og-image.png`,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Raycast Community Taiwan",
        url: SITE_URL,
        logo: `${SITE_URL}/og-image.png`,
        description:
          "連結台灣的 Raycast 使用者，分享更有效率的用法。探索功能、參與活動，找到一起成長的夥伴。",
        sameAs: ["https://www.threads.com/@raycast_taiwan"],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Raycast Community Taiwan",
        url: SITE_URL,
        inLanguage: "zh-TW",
        publisher: {
          "@type": "Organization",
          name: "Raycast Community Taiwan",
        },
      },
    ],
    lastMod: latestSiteDate(),
  });

  // Newsletter index
  const sortedNewsletters = [...newsletterMeta].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  routes.push({
    path: "/newsletter",
    title: "電子報總覽：Raycast 月報與週報",
    description:
      "Raycast Community Taiwan 整理的官方月報與週報，依時間倒序排列，快速掌握 Raycast 平台動態、社群活動與實用技巧。",
    image: `${SITE_URL}/og/newsletter/index.png`,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Raycast 電子報總覽",
        description:
          "Raycast Community Taiwan 整理的官方月報與週報，依時間倒序排列。",
        url: `${SITE_URL}/newsletter`,
        inLanguage: "zh-TW",
        isPartOf: {
          "@type": "WebSite",
          name: "Raycast Community Taiwan",
          url: SITE_URL,
        },
        hasPart: sortedNewsletters.map((n) => ({
          "@type": n.type === "weekly" ? "NewsletterArticle" : "Article",
          headline: n.title,
          description: n.summary,
          datePublished: n.date,
          url: `${SITE_URL}/newsletter/${n.id}`,
        })),
      },
      breadcrumb([
        { name: "首頁", url: `${SITE_URL}/` },
        { name: "電子報", url: `${SITE_URL}/newsletter` },
      ]),
    ],
    lastMod: latestNewsletterDate(),
  });

  // Newsletter detail pages
  for (const n of newsletterMeta) {
    const url = `${SITE_URL}/newsletter/${n.id}`;
    const image = `${SITE_URL}/og/newsletter/${n.id}.png`;
    const { name: authorName, publisher: authorPublisher } = parseAuthor(
      n.author,
    );
    routes.push({
      path: `/newsletter/${n.id}`,
      title: n.title,
      description: n.summary,
      image,
      type: "article",
      publishedTime: n.date,
      modifiedTime: n.date,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": n.type === "weekly" ? "NewsletterArticle" : "Article",
          headline: n.title,
          description: n.summary,
          datePublished: n.date,
          dateModified: n.date,
          inLanguage: "zh-TW",
          url,
          image,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          author: { "@type": "Person", name: authorName },
          publisher: {
            "@type": "Organization",
            name: authorPublisher ?? "Raycast Community Taiwan",
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/og-image.png`,
            },
          },
        },
        breadcrumb([
          { name: "首頁", url: `${SITE_URL}/` },
          { name: "電子報", url: `${SITE_URL}/newsletter` },
          { name: n.title, url },
        ]),
      ],
      lastMod: n.date,
    });
  }

  // Events index
  routes.push({
    path: "/events",
    title: "活動總覽：Raycast Taiwan 線下聚會",
    description:
      "Raycast Community Taiwan 在台灣舉辦的社群聚會、Raycafé 與工作坊。掌握即將舉辦的場次與過往精選紀錄。",
    image: `${SITE_URL}/og/events/index.png`,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Raycast Taiwan 活動總覽",
        description:
          "Raycast Community Taiwan 在台灣舉辦的社群聚會、Raycafé 與工作坊。",
        url: `${SITE_URL}/events`,
        inLanguage: "zh-TW",
        isPartOf: {
          "@type": "WebSite",
          name: "Raycast Community Taiwan",
          url: SITE_URL,
        },
        hasPart: taiwanEvents.map((event) => ({
          "@type": "Event",
          name: event.title,
          startDate: event.date,
          description: event.description,
          location: { "@type": "Place", name: event.location },
          url: `${SITE_URL}/events/${event.id}`,
        })),
      },
      breadcrumb([
        { name: "首頁", url: `${SITE_URL}/` },
        { name: "活動", url: `${SITE_URL}/events` },
      ]),
    ],
    lastMod: latestEventDate(),
  });

  // Event detail pages
  const todayIso = new Date().toISOString().slice(0, 10);
  for (const event of taiwanEvents) {
    const url = `${SITE_URL}/events/${event.id}`;
    const image = `${SITE_URL}/og/events/${event.id}.png`;
    const isPast = event.date < todayIso;
    routes.push({
      path: `/events/${event.id}`,
      title: `${event.title} 活動照片`,
      description: event.description,
      image,
      type: "article",
      publishedTime: event.date,
      modifiedTime: event.date,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          startDate: event.date,
          eventStatus: isPast
            ? "https://schema.org/EventCompleted"
            : "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          description: event.description,
          location: {
            "@type": "Place",
            name: event.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: event.location,
              addressCountry: "TW",
            },
          },
          url,
          image: event.imageUrl ? [event.imageUrl, image] : [image],
          inLanguage: "zh-TW",
          organizer: {
            "@type": "Organization",
            name: "Raycast Community Taiwan",
            url: SITE_URL,
          },
        },
        breadcrumb([
          { name: "首頁", url: `${SITE_URL}/` },
          { name: "活動", url: `${SITE_URL}/events` },
          { name: event.title, url },
        ]),
      ],
      lastMod: event.date,
    });
  }

  return routes;
}

function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function latestNewsletterDate(): string {
  return newsletterMeta
    .map((n) => n.date)
    .sort((a, b) => b.localeCompare(a))[0]!;
}

function latestEventDate(): string {
  return taiwanEvents.map((e) => e.date).sort((a, b) => b.localeCompare(a))[0]!;
}

function latestSiteDate(): string {
  return [latestNewsletterDate(), latestEventDate()].sort((a, b) =>
    b.localeCompare(a),
  )[0]!;
}

function buildHeadOverride(route: RouteSeo): string {
  const fullTitle =
    route.path === "/"
      ? route.title
      : `${route.title} — Raycast Community Taiwan`;
  const url = `${SITE_URL}${route.path === "/" ? "" : route.path}`;
  const ogType = route.type === "article" ? "article" : "website";
  const articleMeta =
    route.type === "article" && route.publishedTime
      ? `\n    <meta property="article:published_time" content="${escapeHtml(
          route.publishedTime,
        )}" />\n    <meta property="article:modified_time" content="${escapeHtml(
          route.modifiedTime ?? route.publishedTime,
        )}" />`
      : "";

  const jsonLdJson = JSON.stringify(route.jsonLd, null, 2)
    // Avoid </script> termination escapes
    .replace(/</g, "\\u003c");

  return `    <title>${escapeHtml(fullTitle)}</title>
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(route.image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="zh_TW" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@raycast_taiwan" />
    <meta name="twitter:creator" content="@raycast_taiwan" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${escapeHtml(route.image)}" />${articleMeta}
    <script id="seo-jsonld-dynamic" type="application/ld+json">${jsonLdJson}</script>`;
}

function rewriteHeadHtml(baseHtml: string, route: RouteSeo): string {
  // Strip the original meta block (between <meta name="viewport"> and the
  // closing of the JSON-LD script) and inject the route-specific block.
  // Simpler: we surgically replace specific tags by id-less attribute matching.
  let out = baseHtml;

  const headOverride = buildHeadOverride(route);

  // Remove original title, canonical, description, og:*, twitter:*, ld+json blocks
  const removalPatterns: RegExp[] = [
    /<title>[\s\S]*?<\/title>/,
    /<link\s+rel="canonical"[^>]*\/?>/,
    /<meta\s+name="description"[^>]*\/?>/g,
    /<meta\s+property="og:[^"]+"[^>]*\/?>/g,
    /<meta\s+name="twitter:[^"]+"[^>]*\/?>/g,
    /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,
  ];
  for (const pattern of removalPatterns) {
    out = out.replace(pattern, "");
  }

  // Inject before </head>
  out = out.replace(/<\/head>/, `${headOverride}\n  </head>`);
  // Collapse leftover blank lines in <head>
  out = out.replace(/\n\s*\n\s*\n/g, "\n\n");
  return out;
}

async function prerenderHtml(routes: RouteSeo[]) {
  const baseHtmlPath = path.join(distDir, "index.html");
  const baseHtml = await fs.readFile(baseHtmlPath, "utf8");

  for (const route of routes) {
    const updated = rewriteHeadHtml(baseHtml, route);
    if (route.path === "/") {
      await fs.writeFile(baseHtmlPath, updated);
      continue;
    }
    const targetDir = path.join(distDir, route.path.replace(/^\//, ""));
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(targetDir, "index.html"), updated);
  }
}

async function generateSitemap(routes: RouteSeo[]) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = routes.map((route) => {
    const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
    const lastmod = route.lastMod || today;
    const changefreq = route.path === "/" ? "weekly" : "monthly";
    const priority =
      route.path === "/"
        ? "1.0"
        : route.path === "/newsletter" || route.path === "/events"
          ? "0.9"
          : route.path.startsWith("/newsletter/")
            ? "0.8"
            : "0.7";
    const imageBlock = `\n    <image:image>\n      <image:loc>${escapeXml(route.image)}</image:loc>\n    </image:image>`;
    return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${imageBlock}\n  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries.join("\n")}\n</urlset>\n`;
  await fs.writeFile(path.join(distDir, "sitemap.xml"), xml);
}

async function generateFeed() {
  const sorted = [...newsletterMeta].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const updated = sorted[0]?.date ?? new Date().toISOString().slice(0, 10);

  const entries = sorted.map((n) => {
    const url = `${SITE_URL}/newsletter/${n.id}`;
    const image = `${SITE_URL}/og/newsletter/${n.id}.png`;
    return `  <entry>
    <title>${escapeXml(n.title)}</title>
    <link href="${escapeXml(url)}" />
    <id>${escapeXml(url)}</id>
    <updated>${n.date}T00:00:00+08:00</updated>
    <published>${n.date}T00:00:00+08:00</published>
    <author><name>${escapeXml(n.author)}</name></author>
    <summary>${escapeXml(n.summary)}</summary>
    <category term="${n.type}" />
    <link rel="enclosure" type="image/png" href="${escapeXml(image)}" />
  </entry>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-TW">
  <title>Raycast Community Taiwan</title>
  <subtitle>Raycast 月報與週報的中文整理</subtitle>
  <link href="${SITE_URL}/feed.xml" rel="self" />
  <link href="${SITE_URL}/" />
  <id>${SITE_URL}/</id>
  <updated>${updated}T00:00:00+08:00</updated>
  <author><name>Raycast Community Taiwan</name></author>
${entries.join("\n")}
</feed>
`;

  await fs.writeFile(path.join(distDir, "feed.xml"), xml);
}

async function main() {
  console.log("[seo] generating SEO assets…");

  const [fonts, logoDataUri] = await Promise.all([
    loadFonts(),
    loadLogoDataUri(),
  ]);
  await generateOgImages(fonts, logoDataUri);

  const routes = buildRoutes();
  await Promise.all([
    prerenderHtml(routes),
    generateSitemap(routes),
    generateFeed(),
  ]);

  console.log(
    `[seo] done · ${routes.length} routes · ${newsletterMeta.length} newsletters · ${taiwanEvents.length} events`,
  );
}

main().catch((err) => {
  console.error("[seo] failed", err);
  process.exit(1);
});
