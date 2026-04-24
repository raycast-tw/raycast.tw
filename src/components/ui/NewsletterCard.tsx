import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Newsletter } from "../../data/newsletters/index";
import { cn } from "../../utils/cn";

interface NewsletterCardProps {
  newsletter: Newsletter;
  index?: number;
}

const themeClasses: Record<NonNullable<Newsletter["theme"]>, string> = {
  crimson:
    "bg-[radial-gradient(circle_at_70%_30%,rgba(255,108,132,0.18)_0%,rgba(255,108,132,0)_40%),linear-gradient(180deg,#161822_0%,#0d1018_100%)] shadow-[0_36px_92px_-40px_rgba(0,0,0,0.98),0_0_96px_-64px_rgba(255,99,99,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]",
  indigo:
    "bg-[radial-gradient(circle_at_72%_28%,rgba(108,132,255,0.18)_0%,rgba(108,132,255,0)_38%),linear-gradient(180deg,#161c34_0%,#0d1324_100%)] shadow-[0_36px_92px_-40px_rgba(0,0,0,0.98),0_0_96px_-64px_rgba(86,122,255,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]",
  emerald:
    "bg-[radial-gradient(circle_at_52%_24%,rgba(92,214,149,0.16)_0%,rgba(92,214,149,0)_36%),linear-gradient(180deg,#13221f_0%,#0c1313_100%)] shadow-[0_36px_92px_-40px_rgba(0,0,0,0.98),0_0_96px_-64px_rgba(92,214,149,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]",
  violet:
    "bg-[radial-gradient(circle_at_58%_36%,rgba(154,122,255,0.16)_0%,rgba(154,122,255,0)_38%),linear-gradient(180deg,#171b31_0%,#0d101b_100%)] shadow-[0_36px_92px_-40px_rgba(0,0,0,0.98),0_0_96px_-66px_rgba(154,122,255,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]",
  amber:
    "bg-[radial-gradient(circle_at_54%_20%,rgba(255,191,96,0.16)_0%,rgba(255,191,96,0)_38%),linear-gradient(180deg,#201a14_0%,#11100e_100%)] shadow-[0_36px_92px_-40px_rgba(0,0,0,0.98),0_0_94px_-62px_rgba(255,191,96,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]",
};

export function NewsletterCard({ newsletter, index = 0 }: NewsletterCardProps) {
  const typeLabel = newsletter.type === "monthly" ? "月報" : "週報";
  const themeClass = themeClasses[newsletter.theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.5, delay: Math.min(index, 2) * 0.14 }}
    >
      <Link
        to={`/newsletter/${newsletter.id}`}
        className={cn(
          "group relative block h-full min-h-[440px] w-full overflow-hidden rounded-[30px] border border-white/10 p-7 no-underline transition hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_46px_100px_-46px_rgba(0,0,0,0.98),0_0_58px_-44px_rgba(255,255,255,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] max-md:min-h-[400px] max-md:p-5",
          themeClass,
        )}
      >
        <span className="pointer-events-none absolute inset-px rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.015)_100%)]" />
        <div className="relative z-10 flex h-full min-h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-h-[44px]">
              <div className="text-[15px] font-medium tracking-[0.2px] text-white">
                {newsletter.kicker}
              </div>
              <div className="mt-1 text-[13px] tracking-[0.2px] text-white/45">
                {typeLabel}
              </div>
            </div>

            <span className="inline-flex size-10 items-center justify-center rounded-[0.9rem] border border-white/12 bg-white/6 text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/10">
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          <div className="mt-10 flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            <span>{typeLabel}</span>
            {newsletter.episode && (
              <>
                <span className="text-white/20">•</span>
                <span>{newsletter.episode}</span>
              </>
            )}
          </div>

          <h4 className="mt-4 w-full text-[31px] leading-[1.08] font-medium tracking-[-0.02em] text-white">
            {newsletter.title}
          </h4>

          <p className="mt-4 max-w-[28ch] text-[15px] leading-[1.8] font-medium tracking-[0.2px] text-white/82">
            {newsletter.summary}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 pt-12 text-[11px] font-medium tracking-[0.08em] text-white/42 uppercase">
            <time className="whitespace-nowrap">{newsletter.date}</time>
            <span className="text-right whitespace-nowrap">
              {newsletter.author}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
