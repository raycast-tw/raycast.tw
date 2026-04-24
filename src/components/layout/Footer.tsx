import raycastLogo from "../../assets/raycast.svg";
import { motion } from "framer-motion";

const footerLinks = {
  communityTaiwan: {
    title: "Raycast 臺灣社群",
    links: [
      {
        label: "Raycast Taiwan Threads",
        href: "https://www.threads.com/@raycast_taiwan",
      },
    ],
  },
  raycast: {
    title: "Raycast",
    links: [
      { label: "Raycast 官網", href: "https://raycast.com" },
      { label: "Raycast 插件商店", href: "https://raycast.com/store" },
    ],
  },
  raycastCommunity: {
    title: "Raycast 社群",
    links: [
      { label: "X / Twitter", href: "https://twitter.com/raycast" },
      { label: "YouTube", href: "https://www.youtube.com/@raycastapp" },
      { label: "Slack", href: "https://www.raycast.com/community" },
      { label: "Luma", href: "https://luma.com/raycast" },
    ],
  },
};

export function Footer() {
  return (
    <motion.footer
      className="bg-background border-t border-white/6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container py-16">
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div className="max-w-[330px]">
            <div className="flex items-center gap-2">
              <img
                src={raycastLogo}
                alt="Raycast"
                className="size-7 rounded-[6px] object-cover"
              />
              <span className="text-foreground text-[15px] leading-[1.35] font-semibold tracking-[0.2px]">
                Raycast Community Taiwan
              </span>
            </div>
            <p className="text-light-gray/90 mt-4 text-[15px] leading-[1.65] font-medium tracking-[0.2px]">
              連結台灣 Raycast 使用者，一起交流實用技巧與工作流。
            </p>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h5 className="text-foreground text-[15px] font-semibold tracking-[0.12px]">
                {section.title}
              </h5>
              <ul className="mt-4 flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-subtle hover:text-foreground text-[14px] font-medium tracking-[0.2px] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/6 pt-6">
          <p className="text-subtle text-center text-[12px] font-normal tracking-[0.3px]">
            © {new Date().getFullYear()} Raycast Community Taiwan. 本站非
            Raycast 官方網站。
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
