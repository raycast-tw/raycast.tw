import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { taiwanEvents } from "../data/events";
import { loadEventGalleryImages } from "../utils/events";
import { useSeo } from "../utils/useSeo";

interface GalleryState {
  eventId: string;
  images: string[];
  isLoading: boolean;
}

export function EventGalleryPage() {
  const { id } = useParams<{ id: string }>();
  const event = taiwanEvents.find((item) => item.id === id);
  const [galleryState, setGalleryState] = useState<GalleryState>({
    eventId: "",
    images: [],
    isLoading: true,
  });

  useSeo(
    event
      ? {
          title: `${event.title} 活動照片`,
          description: event.description,
          path: `/events/${event.id}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            startDate: event.date,
            description: event.description,
            location: {
              "@type": "Place",
              name: event.location,
            },
            url: `https://raycast.tw/events/${event.id}`,
            organizer: {
              "@type": "Organization",
              name: "Raycast Community Taiwan",
              url: "https://raycast.tw",
            },
          },
        }
      : {},
  );

  useEffect(() => {
    if (!event) return;

    let isStale = false;

    loadEventGalleryImages(event.id).then((images) => {
      if (isStale) return;
      setGalleryState({
        eventId: event.id,
        images,
        isLoading: false,
      });
    });

    return () => {
      isStale = true;
    };
  }, [event]);

  if (!event) {
    return (
      <motion.div
        className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-foreground text-[24px] font-medium">
          找不到活動照片頁
        </h2>
        <Link
          to="/"
          className="text-foreground inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[16px] font-semibold tracking-[0.3px] shadow-[rgba(255,255,255,0.1)_0px_1px_0px_0px_inset] transition-opacity hover:opacity-60"
        >
          返回首頁
        </Link>
      </motion.div>
    );
  }

  const galleryImages =
    galleryState.eventId === event.id ? galleryState.images : [];
  const isGalleryLoading =
    galleryState.eventId !== event.id || galleryState.isLoading;

  return (
    <div className="relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-60px] left-[-60px] z-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,58,80,0.18)_0%,rgba(255,58,80,0.07)_38%,rgba(255,58,80,0)_72%)] blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="relative z-10 container py-12 md:py-20">
        <div className="mx-auto max-w-[1080px]">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Link
              to="/#events"
              className="text-subtle mb-4 inline-flex items-center gap-1 rounded-full text-[14px] font-semibold transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              返回活動
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <span className="text-foreground inline-block rounded-full border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] px-3 py-1 text-[14px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              EVENT GALLERY
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-[clamp(34px,5vw,62px)]"
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {event.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            className="mt-4 flex flex-wrap items-center gap-4 text-[15px] text-white/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" />
              {event.date} · {event.time}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              {event.location}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="mt-5 max-w-[720px] text-white/82"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.38 }}
          >
            {event.description}
          </motion.p>

          {/* Gallery grid */}
          <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isGalleryLoading ? (
              <motion.div
                className="rounded-[22px] border border-dashed border-white/18 bg-white/3 p-8 text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.48 }}
              >
                照片載入中
              </motion.div>
            ) : galleryImages.length > 0 ? (
              galleryImages.map((image, index) => (
                <motion.figure
                  key={`${event.id}-gallery-${index}`}
                  className="group relative overflow-hidden border border-white/10 bg-black/45"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.48 + index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <img
                    src={image}
                    alt={`${event.title} 照片 ${index + 1}`}
                    className="h-full min-h-[280px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </motion.figure>
              ))
            ) : (
              <motion.div
                className="rounded-[22px] border border-dashed border-white/18 bg-white/3 p-8 text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.48 }}
              >
                尚未上傳活動照片
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
