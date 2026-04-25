import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { newsletters } from "../data/newsletters/index";
import { useSeo } from "../utils/useSeo";

export function NewsletterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const newsletter = newsletters.find((n) => n.id === id);
  const typeLabel = newsletter?.type === "monthly" ? "月報" : "週報";
  const progressBarRef = useRef<HTMLDivElement>(null);

  useSeo(
    newsletter
      ? {
          title: newsletter.title,
          description: newsletter.summary,
          path: `/newsletter/${newsletter.id}`,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: newsletter.title,
            description: newsletter.summary,
            datePublished: newsletter.date,
            url: `https://raycast.tw/newsletter/${newsletter.id}`,
            author: {
              "@type": "Organization",
              name: newsletter.author,
            },
            publisher: {
              "@type": "Organization",
              name: "Raycast Community Taiwan",
              url: "https://raycast.tw",
            },
          },
        }
      : {},
  );

  useEffect(() => {
    const bar = progressBarRef.current;
    if (!bar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      const viewportHeight = window.innerHeight;
      const maxScrollable = documentHeight - viewportHeight;

      if (maxScrollable <= 0) {
        bar.style.transform = "scaleX(0)";
        return;
      }

      const distanceToBottom = documentHeight - (scrollTop + viewportHeight);
      const progress =
        distanceToBottom <= 1
          ? 1
          : Math.min(1, Math.max(0, scrollTop / maxScrollable));
      bar.style.transform = `scaleX(${progress})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  if (!newsletter) {
    return (
      <motion.div
        className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-foreground text-[24px] font-medium">
          找不到這篇文章
        </h2>
        <Link
          to="/"
          className="text-foreground inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[16px] font-semibold tracking-[0.3px] shadow-[rgba(255,255,255,0.1)_0px_1px_0px_0px_inset] transition-opacity hover:opacity-60"
        >
          ← 返回首頁
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Scroll progress bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-[linear-gradient(90deg,#FF6363_0%,#FF6363_100%)] shadow-[0_0_18px_rgba(255,99,99,0.58)] will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Background glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[140px] left-[-20px] z-0 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,58,80,0.18)_0%,rgba(255,58,80,0.07)_38%,rgba(255,58,80,0)_72%)] blur-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      <div className="relative z-10 container py-12 md:py-20">
        <div className="mx-auto max-w-[680px]">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Link
              to="/"
              className="text-subtle mb-6 inline-flex items-center gap-1 rounded-full text-[14px] font-semibold transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              返回
            </Link>
          </motion.div>

          {/* Type badge + episode */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            <span className="text-foreground inline-block rounded-full border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] px-3 py-1 text-[14px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              {typeLabel}
            </span>
            {newsletter.episode && (
              <span className="text-subtle ml-2 text-[12px] font-semibold tracking-normal">
                {newsletter.episode}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {newsletter.title}
          </motion.h1>

          {/* Meta: date + author */}
          <motion.div
            className="text-muted mt-4 flex items-center gap-3 text-[14px] font-medium tracking-[0.2px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <time dateTime={newsletter.date}>{newsletter.date}</time>
            <span>·</span>
            <span>{newsletter.author}</span>
          </motion.div>

          {/* Article body */}
          <motion.div
            className="mt-8 border-t border-white/6 pt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
          >
            <div
              className="[&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-light-gray [&_a]:text-red-accent [&_li]:text-light-gray [&_code]:bg-surface-200 [&_code]:text-foreground [&_pre]:bg-surface-100 [&_blockquote]:border-red-accent [&_blockquote]:bg-red-accent/6 [&_strong]:text-foreground [&_em]:text-silver leading-[1.7] [&_a]:no-underline [&_blockquote]:my-6 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-[3px] [&_blockquote]:px-5 [&_blockquote]:py-3 [&_code]:rounded-[3px] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[14px] [&_code]:font-medium [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-[24px] [&_h2]:leading-[1.2] [&_h2]:font-medium [&_h2]:tracking-[0.2px] [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[20px] [&_h3]:leading-[1.4] [&_h3]:font-medium [&_h3]:tracking-[0.2px] [&_hr]:my-8 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-white/6 [&_img]:my-6 [&_img]:rounded-xl [&_img]:border [&_img]:border-white/6 [&_li]:mb-1.5 [&_li]:text-[16px] [&_li]:leading-[1.7] [&_li]:font-normal [&_li]:tracking-[0.2px] [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:font-normal [&_p]:tracking-[0.2px] [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-white/6 [&_pre]:px-5 [&_pre]:py-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: newsletter.content }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
