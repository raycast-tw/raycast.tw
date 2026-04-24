import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionTag } from "../ui/SectionTag";
import { NewsletterCard } from "../ui/NewsletterCard";
import { newsletters } from "../../data/newsletters/index";
import { carouselClasses, useCarousel } from "../../utils/useCarousel";

type FilterMode = "all" | "monthly" | "weekly";

const filterOptions: Array<{ id: FilterMode; label: string }> = [
  { id: "all", label: "全部" },
  { id: "monthly", label: "月報" },
  { id: "weekly", label: "週報" },
];

export function NewsletterSection() {
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
      filter === "monthly"
        ? sorted.filter((item) => item.type === "monthly")
        : filter === "weekly"
          ? sorted.filter((item) => item.type === "weekly")
          : sorted,
    [filter, sorted],
  );

  const { currentIndex, visibleCount, goToPrevious, goToNext, resetIndex } =
    useCarousel(visibleNewsletters.length, 1024, 720);

  const progressTotal = Math.max(1, visibleNewsletters.length);

  return (
    <section
      id="newsletter"
      className="relative scroll-mt-[110px] py-24 md:py-32"
    >
      <div className="container">
        <div className="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[620px]">
            <SectionTag>NEWSLETTER</SectionTag>
            <h2 className="text-foreground mt-3 max-w-[11ch]">精選電子報</h2>
            <p className="text-light-gray mt-5 max-w-[560px] text-[16px] leading-[1.7] font-medium tracking-[0.2px] md:text-[20px]">
              精選月報與週報，快速掌握社群動態與實用技巧。
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
                <span>{String(progressTotal).padStart(2, "0")}</span>
              </div>

              <div className="inline-flex items-center gap-3 lg:mr-[-2rem]">
                <button
                  type="button"
                  onClick={goToPrevious}
                  className={carouselClasses.navButton}
                  aria-label="上一封電子報"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className={carouselClasses.navButton}
                  aria-label="下一封電子報"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="-mt-2 w-full overflow-hidden pt-2 lg:mr-[-2rem] lg:w-[calc(100%+2rem)]">
              <div
                className="grid auto-cols-[calc((100%-(var(--newsletter-visible-count)-1)*var(--newsletter-gap))/var(--newsletter-visible-count))] grid-flow-col items-stretch gap-(--newsletter-gap) transition-transform duration-400 ease-[ease] [--newsletter-gap:1.5rem] max-md:[--newsletter-gap:1rem]"
                style={
                  {
                    "--newsletter-visible-count": visibleCount,
                    "--newsletter-active-index": currentIndex,
                    transform:
                      "translateX(calc(-1 * var(--newsletter-active-index) * (((100% - (var(--newsletter-visible-count) - 1) * var(--newsletter-gap)) / var(--newsletter-visible-count)) + var(--newsletter-gap))))",
                  } as React.CSSProperties
                }
              >
                {visibleNewsletters.map((newsletter, index) => (
                  <NewsletterCard
                    key={newsletter.id}
                    newsletter={newsletter}
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
