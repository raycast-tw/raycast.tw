import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import type { TaiwanEvent } from "../../data/events";
import { cn } from "../../utils/cn";
import {
  getEventDetailPath,
  getEventImages,
  hasEventGallery,
} from "../../utils/events";

interface EventCardProps {
  event: TaiwanEvent;
  variant?: "upcoming" | "past";
  index?: number;
}

export function EventCard({
  event,
  variant = "upcoming",
  index = 0,
}: EventCardProps) {
  const mediaImages = useMemo(() => getEventImages(event), [event]);
  const hasImage = mediaImages.length > 0;
  const hasMultipleImages = mediaImages.length > 1;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const detailPath = getEventDetailPath(event.id);
  const useGalleryLink = variant === "past" && hasEventGallery(event);
  const useRegistrationLink = !useGalleryLink && Boolean(event.url);
  const themeClass = useMemo(
    () =>
      ({
        ruby: "bg-[radial-gradient(circle_at_78%_18%,rgba(255,104,131,0.18)_0%,rgba(255,104,131,0)_38%),linear-gradient(180deg,#181823_0%,#0f1119_100%)]",
        emerald:
          "bg-[radial-gradient(circle_at_50%_16%,rgba(75,229,140,0.16)_0%,rgba(75,229,140,0)_38%),linear-gradient(180deg,#151f20_0%,#0f1214_100%)]",
        amber:
          "bg-[radial-gradient(circle_at_50%_12%,rgba(255,190,88,0.16)_0%,rgba(255,190,88,0)_38%),linear-gradient(180deg,#1e1a16_0%,#121111_100%)]",
        violet:
          "bg-[radial-gradient(circle_at_70%_16%,rgba(149,120,255,0.16)_0%,rgba(149,120,255,0)_38%),linear-gradient(180deg,#16192a_0%,#0e1118_100%)]",
        slate:
          "bg-[radial-gradient(circle_at_50%_20%,rgba(203,214,255,0.12)_0%,rgba(203,214,255,0)_40%),linear-gradient(180deg,#171b23_0%,#0f1115_100%)]",
        copper:
          "bg-[radial-gradient(circle_at_70%_18%,rgba(255,153,113,0.16)_0%,rgba(255,153,113,0)_40%),linear-gradient(180deg,#1f1916_0%,#111010_100%)]",
      })[event.theme],
    [event.theme],
  );

  const cardClassName = cn(
    "group flex h-full min-h-[520px] flex-col overflow-hidden rounded-[30px] border border-white/10 p-6 no-underline shadow-[0_34px_84px_-44px_rgba(0,0,0,0.94),0_0_46px_-38px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_46px_100px_-46px_rgba(0,0,0,0.98),0_0_54px_-42px_rgba(255,255,255,0.16),inset_0_1px_0_rgba(255,255,255,0.1)] max-md:p-5",
    themeClass,
    variant === "past" && "opacity-[0.84]",
  );

  const cardContent = (
    <>
      <div
        className={cn(
          "relative min-h-[184px] overflow-hidden rounded-[24px] border border-white/8 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_42%),linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_44px_-30px_rgba(0,0,0,0.85)]",
          hasImage &&
            "[&_.event-media-card]:border-white/20 [&_.event-media-card]:bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_100%)]",
        )}
      >
        {hasImage ? (
          <img
            src={mediaImages[activeImageIndex]}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover contrast-104 saturate-105"
            loading="lazy"
          />
        ) : null}
        {hasImage ? (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,12,0.08)_0%,rgba(8,9,12,0.4)_62%,rgba(8,9,12,0.58)_100%)]" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(8,9,12,0.08)_0%,rgba(8,9,12,0.4)_62%,rgba(8,9,12,0.58)_100%)]">
            <div className="event-media-card flex h-[136px] w-[min(72%,240px)] flex-col justify-end rounded-[22px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.06)_100%)] p-4 shadow-[0_26px_56px_-32px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md">
              <span className="text-[11px] font-semibold tracking-[0.18em] text-white/58 uppercase">
                {event.imageKicker}
              </span>
              <span className="mt-2 text-[24px] leading-[1.05] font-semibold tracking-[-0.03em] text-white">
                {event.imageLabel}
              </span>
            </div>
            <div className="absolute inset-x-[18%] bottom-[-22px] h-[52px] rounded-full bg-white/16 blur-xl" />
          </div>
        )}
        {hasMultipleImages ? (
          <>
            <div className="absolute inset-x-3 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between">
              <button
                type="button"
                aria-label="上一張圖片"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/90 backdrop-blur-sm transition hover:bg-black/55"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex((current) =>
                    current === 0 ? mediaImages.length - 1 : current - 1,
                  );
                }}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="下一張圖片"
                className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white/90 backdrop-blur-sm transition hover:bg-black/55"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveImageIndex((current) =>
                    current >= mediaImages.length - 1 ? 0 : current + 1,
                  );
                }}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center">
              {mediaImages.map((_, imageIndex) => (
                <button
                  key={`${event.id}-img-dot-${imageIndex}`}
                  type="button"
                  aria-label={`切換到第 ${imageIndex + 1} 張圖片`}
                  className="inline-flex min-h-[44px] min-w-[20px] items-center justify-center px-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImageIndex(imageIndex);
                  }}
                >
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition",
                      activeImageIndex === imageIndex
                        ? "w-4 bg-white/95"
                        : "w-1.5 bg-white/48 hover:bg-white/75",
                    )}
                  />
                </button>
              ))}
            </div>
          </>
        ) : null}
        {variant === "past" && (
          <span className="absolute top-3.5 right-3.5 inline-flex items-center rounded-full border border-white/12 bg-[rgba(8,9,12,0.58)] px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white/72 uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            已結束
          </span>
        )}
      </div>

      <h4 className="mt-6 text-[28px] leading-[1.08] font-medium tracking-[-0.02em] text-white">
        {event.title}
      </h4>

      <div className="mt-4 flex flex-col gap-2 text-[14px] font-medium tracking-[0.2px] text-white/55">
        <span className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {event.date} · {event.time}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          {event.location}
        </span>
      </div>

      <p className="mt-4 text-[15px] leading-[1.8] font-medium tracking-[0.2px] text-white/82">
        {event.description}
      </p>

      <div className="mt-8 flex items-center justify-between pt-4 text-[12px] font-medium tracking-[0.16em] text-white/42 uppercase">
        <span>{variant === "upcoming" ? "Upcoming" : "Archive"}</span>
        {useGalleryLink ? (
          <span className="inline-flex items-center gap-1.5 text-white/72 transition-opacity group-hover:opacity-70">
            查看照片
            <ExternalLink className="size-3.5" />
          </span>
        ) : useRegistrationLink ? (
          <span className="inline-flex items-center gap-1.5 text-white/72 transition-opacity group-hover:opacity-70">
            立即報名
            <ExternalLink className="size-3.5" />
          </span>
        ) : (
          <span>{event.location}</span>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.5, delay: Math.min(index, 2) * 0.14 }}
    >
      {useGalleryLink ? (
        <Link to={detailPath} className={cardClassName}>
          {cardContent}
        </Link>
      ) : useRegistrationLink ? (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClassName}
        >
          {cardContent}
        </a>
      ) : (
        <div className={cardClassName}>{cardContent}</div>
      )}
    </motion.div>
  );
}
