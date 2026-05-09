import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { newsletters } from "../data/newsletters/index";
import { NewsletterCard } from "../components/ui/NewsletterCard";
import { SectionTag } from "../components/ui/SectionTag";
import { useSeo } from "../utils/useSeo";
import { SITE_URL } from "../utils/siteUrl";

type FilterMode = "all" | "monthly" | "weekly";

const filterOptions: Array<{ id: FilterMode; label: string }> = [
  { id: "all", label: "全部" },
  { id: "monthly", label: "月報" },
  { id: "weekly", label: "週報" },
];

export function NewsletterIndexPage() {
  const [filter, setFilter] = useState<FilterMode>("all");

  const sorted = useMemo(
    () =>
      [...newsletters].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [],
  );

  const visibleNewsletters = useMemo(
    () =>
      filter === "all" ? sorted : sorted.filter((item) => item.type === filter),
    [filter, sorted],
  );

  useSeo({
    title: "電子報總覽：Raycast 月報與週報",
    description:
      "Raycast Community Taiwan 整理的官方月報與週報，依時間倒序排列，快速掌握 Raycast 平台動態、社群活動與實用技巧。",
    path: "/newsletter",
    image: "/og/newsletter/index.png",
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
        hasPart: sorted.map((n) => ({
          "@type": n.type === "weekly" ? "NewsletterArticle" : "Article",
          headline: n.title,
          description: n.summary,
          datePublished: n.date,
          url: `${SITE_URL}/newsletter/${n.id}`,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "首頁",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "電子報",
            item: `${SITE_URL}/newsletter`,
          },
        ],
      },
    ],
  });

  return (
    <main className="relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[120px] left-[-40px] z-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,58,80,0.18)_0%,rgba(255,58,80,0.07)_38%,rgba(255,58,80,0)_72%)] blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="relative z-10 container py-12 md:py-20">
        <div className="mx-auto max-w-[1080px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SectionTag>NEWSLETTER</SectionTag>
            <h1 className="text-foreground mt-3 text-[clamp(34px,5vw,56px)] leading-[1.08] font-medium tracking-[-0.02em]">
              電子報總覽
            </h1>
            <p className="text-light-gray mt-5 max-w-[620px] text-[16px] leading-[1.7] font-medium tracking-[0.2px] md:text-[20px]">
              Raycast
              月報與週報全集，依時間倒序排列。掌握平台動態、社群活動與實用技巧。
            </p>
          </motion.div>

          <motion.div
            className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/8 bg-white/3 p-1"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => setFilter(option.id)}
                className={`rounded-full px-4 py-1.5 text-[14px] font-medium tracking-[0.2px] transition ${
                  filter === option.id
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.06)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                    : "text-white/55 hover:text-white/85"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>

          <h2 className="sr-only">電子報列表</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleNewsletters.map((newsletter, index) => (
              <NewsletterCard
                key={newsletter.id}
                newsletter={newsletter}
                index={index}
              />
            ))}
          </div>

          <div className="mt-16">
            <Link
              to="/"
              className="text-subtle inline-flex items-center gap-1 rounded-full text-[14px] font-semibold transition hover:text-white"
            >
              ← 返回首頁
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
