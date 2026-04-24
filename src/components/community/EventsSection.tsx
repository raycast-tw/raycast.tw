import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionTag } from "../ui/SectionTag";
import { EventCard } from "../ui/EventCard";
import { taiwanEvents } from "../../data/events";
import { getEventTime, isPastEvent } from "../../utils/events";
import { carouselClasses, useCarousel } from "../../utils/useCarousel";

type EventFilter = "all" | "upcoming" | "past";

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

const filterOptions: Array<{ id: EventFilter; label: string }> = [
  { id: "all", label: "全部" },
  { id: "upcoming", label: "即將舉辦" },
  { id: "past", label: "過往精選" },
];

export function EventsSection() {
  const now = useMemo(() => new Date(), []);
  const [filter, setFilter] = useState<EventFilter>("all");

  const upcomingEvents = useMemo(
    () =>
      sortByNearestDate(
        taiwanEvents.filter((e) => !isPastEvent(e.date, now)),
        now,
      ),
    [now],
  );
  const pastEvents = useMemo(
    () =>
      sortByNearestDate(
        taiwanEvents.filter((e) => isPastEvent(e.date, now)),
        now,
      ),
    [now],
  );
  const allEvents = useMemo(() => sortByNearestDate(taiwanEvents, now), [now]);
  const visibleEvents = useMemo(
    () =>
      filter === "upcoming"
        ? upcomingEvents
        : filter === "past"
          ? pastEvents
          : allEvents,
    [filter, upcomingEvents, pastEvents, allEvents],
  );

  const { currentIndex, visibleCount, goToPrevious, goToNext, resetIndex } =
    useCarousel(visibleEvents.length, 1280, 960);

  return (
    <section id="events" className="scroll-mt-[110px] py-24 md:py-32">
      <div className="container">
        <SectionTag>EVENTS</SectionTag>
        <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[620px]">
            <h2 className="text-foreground mt-2">活動</h2>
            <p className="text-light-gray mt-5 max-w-[560px] text-[16px] leading-[1.7] font-medium tracking-[0.2px] md:text-[20px]">
              從即將舉辦到過往精選，一次掌握 Raycast Taiwan 活動資訊。
            </p>
          </div>

          <div className={carouselClasses.filterRail}>
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setFilter(option.id);
                  resetIndex();
                }}
                className={`${carouselClasses.filterChipBase} ${
                  filter === option.id
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.06)_100%)] text-white shadow-[0_18px_30px_-18px_rgba(255,255,255,0.22),inset_0_1px_0_rgba(255,255,255,0.16)]"
                    : "bg-transparent text-white/48 hover:text-white/85"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className={carouselClasses.shell}>
            <div className={carouselClasses.topBar}>
              <div className={carouselClasses.meta}>
                <span>{String(currentIndex + 1).padStart(2, "0")}</span>
                <span className="h-px w-12 bg-white/14" />
                <span>{String(visibleEvents.length).padStart(2, "0")}</span>
              </div>

              <div className="ml-auto inline-flex items-center gap-3 lg:mr-[-2rem]">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className={carouselClasses.navButton}
                  aria-label="上一個活動"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className={carouselClasses.navButton}
                  aria-label="下一個活動"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="-mt-2 w-full overflow-hidden pt-2 lg:mr-[-2rem] lg:w-[calc(100%+2rem)]">
              <div
                className="grid auto-cols-[calc((100%-(var(--events-visible-count)-1)*var(--events-gap))/var(--events-visible-count))] grid-flow-col items-stretch gap-(--events-gap) transition-transform duration-400 ease-[ease] [--events-gap:0.6rem] max-md:[--events-gap:0.5rem]"
                style={
                  {
                    "--events-visible-count": visibleCount,
                    "--events-active-index": currentIndex,
                    transform:
                      "translateX(calc(-1 * var(--events-active-index) * (((100% - (var(--events-visible-count) - 1) * var(--events-gap)) / var(--events-visible-count)) + var(--events-gap))))",
                  } as React.CSSProperties
                }
              >
                {visibleEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    variant={isPastEvent(event.date, now) ? "past" : "upcoming"}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
