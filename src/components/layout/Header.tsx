import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import raycastLogo from "../../assets/raycast.svg";
import threadsIcon from "../../assets/threads.svg";

const navLinks = [
  { label: "社群活動", href: "/#events", id: "events", desktopOnly: false },
  {
    label: "社群大使",
    href: "/#ambassadors",
    id: "ambassadors",
    desktopOnly: false,
  },
  {
    label: "全球活動",
    href: "/#globe",
    id: "globe",
    desktopOnly: false,
  },
  {
    label: "電子報",
    href: "/#newsletter",
    id: "newsletter",
    desktopOnly: false,
  },
  { label: "功能探索", href: "/#features", id: "features", desktopOnly: true },
];

export function Header() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("events");

  // Derive effective values so non-home-page state never bleeds into the UI
  // without needing synchronous setState calls inside effects.
  const effectiveMobileOpen = isHomePage && mobileOpen;

  useEffect(() => {
    if (!isHomePage) return;

    const sectionIds = navLinks.map((link) => link.id);
    if (!sectionIds.length) return;

    const updateActiveSection = () => {
      const marker = 140;
      let currentSection = sectionIds[0] ?? "";
      let latestReachedSection = sectionIds[0] ?? "";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        const sectionContainsMarker =
          rect.top <= marker && rect.bottom > marker;
        if (sectionContainsMarker) {
          currentSection = id;
          setActiveSection(currentSection);
          return;
        }

        if (rect.top <= marker) {
          latestReachedSection = id;
        }
      }

      currentSection = latestReachedSection;

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [isHomePage]);

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="overflow-hidden rounded-[20px] border border-white/8 bg-[#111214]/50 shadow-[0_34px_90px_-44px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
          <div className="relative flex h-[72px] items-center justify-between px-5 sm:px-7">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={raycastLogo}
                alt="Raycast"
                className="size-7 rounded-[8px] object-cover shadow-[0_14px_34px_-10px_rgba(255,89,117,0.8)]"
              />
              <span className="text-foreground text-[15px] font-semibold tracking-[0.1px]">
                Raycast Community Taiwan
              </span>
            </Link>

            {isHomePage && (
              <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`group relative text-[16px] font-medium tracking-[0.3px] transition-colors hover:text-white ${
                      activeSection === link.id
                        ? "is-active text-white"
                        : "text-white/58"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-[linear-gradient(90deg,rgba(255,99,99,0.9)_0%,rgba(255,154,154,0.86)_100%)] transition ${
                        activeSection === link.id
                          ? "scale-x-100 opacity-100"
                          : "scale-x-70 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                      }`}
                    />
                  </a>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-2.5">
              <a
                href="https://www.threads.com/@raycast_taiwan"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[14px] font-medium tracking-[0.2px] text-white/88 transition hover:border-white/24 hover:bg-white/10 hover:text-white md:inline-flex"
              >
                <img
                  src={threadsIcon}
                  alt="Threads"
                  className="size-4 object-contain"
                />
                臺灣社群的脆
              </a>
              {isHomePage && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="text-foreground md:hidden"
                  aria-label="選單"
                  aria-expanded={mobileOpen}
                >
                  {mobileOpen ? (
                    <X className="size-5" />
                  ) : (
                    <Menu className="size-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {effectiveMobileOpen && (
              <motion.div
                className="bg-background/94 border-t border-white/6 px-4 pb-6 md:hidden"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <nav className="flex flex-col gap-4 pt-4">
                  {navLinks
                    .filter((link) => !link.desktopOnly)
                    .map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-[16px] font-medium tracking-[0.3px] transition-colors hover:text-white ${
                          activeSection === link.id
                            ? "text-white"
                            : "text-white/62"
                        }`}
                      >
                        {link.label}
                      </a>
                    ))}
                  <a
                    href="https://www.threads.com/@raycast_taiwan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[14px] font-medium tracking-[0.2px] text-white/88 transition hover:border-white/24 hover:bg-white/10 hover:text-white"
                  >
                    <img
                      src={threadsIcon}
                      alt="Threads"
                      className="size-4 object-contain"
                    />
                    臺灣社群的脆
                  </a>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
