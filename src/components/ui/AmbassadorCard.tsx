import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import {
  GitHubLight,
  LinkedIn,
  ThreadsLight,
  XLight,
} from "@ridemountainpig/svgl-react";
import type { Ambassador } from "../../data/ambassadors";

interface AmbassadorCardProps {
  ambassador: Ambassador;
  index?: number;
}

export function AmbassadorCard({ ambassador, index = 0 }: AmbassadorCardProps) {
  const socialLinks = [
    {
      href: ambassador.threads,
      label: `${ambassador.name} on Threads`,
      Icon: ThreadsLight,
      iconType: "svgl" as const,
    },
    {
      href: ambassador.twitter,
      label: `${ambassador.name} on X`,
      Icon: XLight,
      iconType: "svgl" as const,
    },
    {
      href: ambassador.linkedin,
      label: `${ambassador.name} on LinkedIn`,
      Icon: LinkedIn,
      iconType: "svgl" as const,
    },
    {
      href: ambassador.github,
      label: `${ambassador.name} on GitHub`,
      Icon: GitHubLight,
      iconType: "svgl" as const,
    },
    {
      href: ambassador.website,
      label: `${ambassador.name} website`,
      Icon: Globe,
      iconType: "lucide" as const,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <motion.div
      className="group flex items-center gap-5 rounded-lg border border-white/10 bg-[linear-gradient(180deg,rgba(16,18,23,0.9)_0%,rgba(10,11,15,0.94)_100%)] px-5 py-5 text-left shadow-[0_30px_74px_-46px_rgba(0,0,0,0.92),0_0_50px_-42px_rgba(85,179,255,0.12),inset_0_1px_0_rgba(255,255,255,0.07)] transition hover:-translate-y-1 hover:border-white/16 hover:shadow-[0_36px_90px_-42px_rgba(0,0,0,0.98),0_0_56px_-44px_rgba(255,255,255,0.14),0_0_54px_-28px_rgba(255,99,91,0.52),inset_0_1px_0_rgba(255,255,255,0.09)]"
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.46, delay: Math.min(index, 2) * 0.12 }}
    >
      {ambassador.avatar ? (
        <div className="size-20 shrink-0 overflow-hidden rounded-full border-[3px] border-white/18 bg-black/20">
          <img
            src={ambassador.avatar}
            alt={ambassador.name}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-black">
          <span className="text-[30px] font-semibold text-white">
            {ambassador.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <h4 className="text-foreground text-[18px] leading-[1.15] font-medium tracking-[0.2px]">
          {ambassador.name}
        </h4>
        <p className="mt-1 text-[12px] leading-[1.35] text-[rgba(208,214,224,0.62)]">
          {ambassador.role}
        </p>

        <div className="mt-2 -ml-2 flex flex-wrap items-center">
          {socialLinks.map(({ href, label, Icon, iconType }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`focus-visible:outline-blue-accent inline-flex size-8 items-center justify-center rounded-lg bg-transparent text-white transition hover:-translate-y-px hover:bg-[rgba(255,255,255,0.05)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 ${
                iconType === "svgl"
                  ? "[&_svg]:text-white [&_svg_*]:fill-white! [&_svg_*]:stroke-white!"
                  : "[&_svg]:stroke-white"
              }`}
              aria-label={label}
            >
              <Icon className="size-4" strokeWidth={1.85} />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
