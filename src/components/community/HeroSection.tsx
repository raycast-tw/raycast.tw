import { motion } from "framer-motion";
import raycastWhiteLogo from "../../assets/raycast-white.svg";
import { taiwanEvents } from "../../data/events";

export function HeroSection() {
  const heroGalleryPhotos = taiwanEvents
    .flatMap((event) => {
      if (event.galleryImages && event.galleryImages.length > 0) {
        return event.galleryImages;
      }
      return event.imageUrl ? [event.imageUrl] : [];
    })
    .slice(0, 6);
  const marqueePhotos =
    heroGalleryPhotos.length > 0
      ? [...heroGalleryPhotos, ...heroGalleryPhotos]
      : [];

  return (
    <section className="bg-background relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[15%] h-[44%] blur-2xl"
        style={{ background: "var(--hero-glow-primary)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%]"
        style={{ background: "var(--hero-glow-soft)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.34)_72%,rgba(0,0,0,0.62)_100%)]"
      />
      <motion.div
        className="relative container flex flex-col items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <motion.div
          className="mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 shadow-[0_14px_34px_-22px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <img
            src={raycastWhiteLogo}
            alt="Raycast"
            className="size-3.5 rounded-[3px] object-cover"
          />
          <span className="text-light-gray text-[14px] font-medium tracking-[0.2px]">
            台灣在地社群
          </span>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-2 top-1/2 h-[52%] -translate-y-1/2 rounded-[40px] opacity-45 blur-[44px]"
            style={{ background: "var(--hero-glow-focus)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-24 top-1/2 h-[22%] -translate-y-1/2 rounded-full opacity-35 blur-xl"
            style={{ background: "var(--hero-glow-core)" }}
          />
          <h1
            className="font-feature-settings-[calt,kern,liga_0,ss02,ss08] text-foreground relative z-10 max-w-[920px]"
            style={{
              fontSize: "clamp(44px, 8vw, 72px)",
              lineHeight: 1.06,
              fontWeight: 600,
            }}
          >
            Raycast Community
            <br />
            <span className="text-red-accent">Taiwan</span>
          </h1>
        </motion.div>

        <motion.p
          className="text-light-gray mt-8 max-w-[660px] text-[14px] leading-[1.7] font-medium tracking-[0.2px] md:text-[18px]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
        >
          連結台灣的 Raycast 使用者，分享更有效率的用法。
          <br />
          在這裡探索功能、參與活動，找到一起成長的夥伴。
        </motion.p>

        <motion.div
          className="mt-14 flex items-center justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.46 }}
        >
          <motion.a
            href="https://www.threads.com/@raycast_taiwan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-[170px] items-center justify-center rounded-full border border-white/35 bg-[linear-gradient(180deg,#f4f7fb_0%,#dbe2ea_100%)] px-5 text-[15px] font-semibold tracking-[0.2px] text-[#1a1f27] shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:bg-[linear-gradient(180deg,#ffffff_0%,#e8edf4_100%)] hover:opacity-90"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            追蹤臺灣社群
          </motion.a>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="bg-red-accent/10 pointer-events-none mt-10 h-9 w-full max-w-[300px] rounded-full blur-[52px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.56 }}
        />
      </motion.div>

      <motion.div
        className="absolute right-0 bottom-5 left-0 w-full px-0"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <div
          aria-hidden="true"
          className="overflow-hidden bg-[rgba(6,8,12,0.58)] px-1.5 py-1.5 shadow-[0_22px_38px_-30px_rgba(0,0,0,0.95)]"
        >
          <motion.div
            className="flex w-max items-center gap-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 26, ease: "linear", repeat: Infinity }}
          >
            {marqueePhotos.map((photo, index) => (
              <img
                key={`hero-gallery-marquee-${index}`}
                src={photo}
                alt=""
                loading={index < 6 ? "eager" : "lazy"}
                className="h-28 w-48 shrink-0 object-cover opacity-86 shadow-[0_16px_28px_-18px_rgba(0,0,0,0.95)] transition duration-300 hover:opacity-100"
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
