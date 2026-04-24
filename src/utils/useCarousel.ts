import { useCallback, useEffect, useState } from "react";

export const carouselClasses = {
  filterRail:
    "inline-flex flex-wrap gap-2 self-start rounded-full border border-white/8 bg-[rgba(11,12,15,0.82)] p-1.5 shadow-[0_28px_70px_-42px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[20px] max-md:justify-start max-md:overflow-x-auto",
  filterChipBase:
    "rounded-full px-[1.15rem] py-3 text-[15px] font-medium tracking-[0.02em] transition",
  shell:
    "grid w-full max-w-[1120px] gap-6 rounded-[30px] shadow-[0_46px_120px_-86px_rgba(0,0,0,0.98),0_0_90px_-78px_rgba(85,179,255,0.16)]",
  topBar:
    "flex items-center justify-between gap-4 max-md:flex-col max-md:items-start",
  meta: "inline-flex items-center gap-3 text-[12px] font-semibold tracking-[0.24em] text-white/42 uppercase",
  navButton:
    "inline-flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/82 shadow-[0_20px_36px_-24px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/9",
};

/**
 * Manages carousel state (active index, visible count, navigation).
 *
 * @param itemCount     Total number of items currently in the carousel.
 * @param lgBreakpoint  Min-width (px) at which 3 items are visible.
 * @param mdBreakpoint  Min-width (px) at which 2 items are visible.
 */
export function useCarousel(
  itemCount: number,
  lgBreakpoint: number,
  mdBreakpoint: number,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  const maxIndex = Math.max(0, itemCount - visibleCount);
  const currentIndex = Math.min(activeIndex, maxIndex);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= lgBreakpoint) setVisibleCount(3);
      else if (window.innerWidth >= mdBreakpoint) setVisibleCount(2);
      else setVisibleCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [lgBreakpoint, mdBreakpoint]);

  const goToPrevious = useCallback(() => {
    setActiveIndex((current) => {
      const normalized = Math.min(current, maxIndex);
      return normalized === 0 ? maxIndex : normalized - 1;
    });
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    setActiveIndex((current) => {
      const normalized = Math.min(current, maxIndex);
      return normalized >= maxIndex ? 0 : normalized + 1;
    });
  }, [maxIndex]);

  const resetIndex = useCallback(() => setActiveIndex(0), []);

  return { currentIndex, visibleCount, goToPrevious, goToNext, resetIndex };
}
