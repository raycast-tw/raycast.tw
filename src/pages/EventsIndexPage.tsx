import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { taiwanEvents } from "../data/events";
import { getEventTime, isPastEvent } from "../utils/events";
import { EventCard } from "../components/ui/EventCard";
import { SectionTag } from "../components/ui/SectionTag";
import { useSeo } from "../utils/useSeo";
import { SITE_URL } from "../utils/siteUrl";

type EventFilter = "all" | "upcoming" | "past";

const filterOptions: Array<{ id: EventFilter; label: string }> = [
  { id: "all", label: "全部" },
  { id: "upcoming", label: "即將舉辦" },
  { id: "past", label: "過往精選" },
];

function sortByNearestDate(
  events: typeof taiwanEvents,
  now: Date,
): typeof taiwanEvents {
  return [...events].sort((left, right) => {
    const leftTime = getEventTime(left.date);
    const rightTime = getEventTime(right.date);
    const leftDistance = Math.abs(leftTime - now.getTime());
    const rightDistance = Math.abs(rightTime - now.getTime());
    if (leftDistance !== rightDistance) return leftDistance - rightDistance;
    return rightTime - leftTime;
  });
}

export function EventsIndexPage() {
  const now = useMemo(() => new Date(), []);
  const [filter, setFilter] = useState<EventFilter>("all");

  const upcoming = useMemo(
    () =>
      sortByNearestDate(
        taiwanEvents.filter((e) => !isPastEvent(e.date, now)),
        now,
      ),
    [now],
  );
  const past = useMemo(
    () =>
      sortByNearestDate(
        taiwanEvents.filter((e) => isPastEvent(e.date, now)),
        now,
      ),
    [now],
  );
  const all = useMemo(() => sortByNearestDate(taiwanEvents, now), [now]);

  const visibleEvents =
    filter === "upcoming" ? upcoming : filter === "past" ? past : all;

  useSeo({
    title: "活動總覽：Raycast Taiwan 線下聚會",
    description:
      "Raycast Community Taiwan 在台灣舉辦的社群聚會、Raycafé 與工作坊。掌握即將舉辦的場次與過往精選紀錄。",
    path: "/events",
    image: "/og/events/index.png",
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
        hasPart: all.map((event) => ({
          "@type": "Event",
          name: event.title,
          startDate: event.date,
          description: event.description,
          location: { "@type": "Place", name: event.location },
          url: `${SITE_URL}/events/${event.id}`,
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
            name: "活動",
            item: `${SITE_URL}/events`,
          },
        ],
      },
    ],
  });

  return (
    <main className="relative overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[120px] right-[-40px] z-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(95,201,146,0.16)_0%,rgba(95,201,146,0.06)_38%,rgba(95,201,146,0)_72%)] blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="relative z-10 container py-12 md:py-20">
        <div className="mx-auto max-w-[1180px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SectionTag>EVENTS</SectionTag>
            <h1 className="text-foreground mt-3 text-[clamp(34px,5vw,56px)] leading-[1.08] font-medium tracking-[-0.02em]">
              活動總覽
            </h1>
            <p className="text-light-gray mt-5 max-w-[620px] text-[16px] leading-[1.7] font-medium tracking-[0.2px] md:text-[20px]">
              Raycast Taiwan 的線下聚會、Raycafé
              與工作坊。即將舉辦與過往精選一次掌握。
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

          <h2 className="sr-only">活動列表</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                variant={isPastEvent(event.date, now) ? "past" : "upcoming"}
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
