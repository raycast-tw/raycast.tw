import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  Calculator,
  CalendarDays,
  ClipboardList,
  ExternalLink,
  Gamepad2,
  Globe,
  Newspaper,
  Search,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import { Keycap } from "../ui/Keycap";

interface CommandPaletteItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  group: "Suggestions" | "Commands";
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const allItems: CommandPaletteItem[] = [
  {
    id: "store",
    title: "Store",
    subtitle: "Raycast",
    icon: <Store className="size-4" />,
    group: "Suggestions",
  },
  {
    id: "clipboard",
    title: "Clipboard History",
    subtitle: "Raycast",
    icon: <ClipboardList className="size-4" />,
    group: "Suggestions",
  },
  {
    id: "search-files",
    title: "Search Files",
    subtitle: "Raycast",
    icon: <Search className="size-4" />,
    group: "Suggestions",
  },
  {
    id: "schedule",
    title: "My Schedule",
    subtitle: "Calendar",
    icon: <CalendarDays className="size-4" />,
    group: "Suggestions",
  },
  {
    id: "define-word",
    title: "Define Word",
    subtitle: "Dictionary",
    icon: <BookOpenText className="size-4" />,
    group: "Suggestions",
  },
  {
    id: "features",
    title: "Maze Showcase",
    subtitle: "Raycast Community",
    icon: <Gamepad2 className="size-4" />,
    group: "Commands",
  },
  {
    id: "globe",
    title: "Global Events",
    subtitle: "Raycast Community",
    icon: <Globe className="size-4" />,
    group: "Commands",
  },
  {
    id: "newsletter",
    title: "Newsletter",
    subtitle: "Raycast Community",
    icon: <Newspaper className="size-4" />,
    group: "Commands",
  },
  {
    id: "ambassadors",
    title: "Ambassadors",
    subtitle: "Raycast Community",
    icon: <Users className="size-4" />,
    group: "Commands",
  },
  {
    id: "calculator",
    title: "Calculator History",
    subtitle: "Calculator",
    icon: <Calculator className="size-4" />,
    group: "Commands",
  },
  {
    id: "ask-ai",
    title: "Ask AI",
    subtitle: "Raycast AI",
    icon: <Sparkles className="size-4" />,
    group: "Commands",
  },
  {
    id: "slack",
    title: "Join Slack Community",
    subtitle: "Raycast Community",
    icon: <ExternalLink className="size-4" />,
    group: "Commands",
  },
];

function CommandPaletteInner({ onClose }: { onClose: () => void }) {
  const surfaceClass =
    "relative z-10 w-full max-w-[760px] overflow-hidden rounded-[14px] border border-[rgba(51,160,255,0.62)] bg-[linear-gradient(180deg,rgba(6,14,25,0.98)_0%,rgba(4,9,17,0.98)_32%,rgba(4,8,15,0.98)_100%)] shadow-[0_56px_140px_-56px_rgba(0,0,0,1),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl";
  const itemBaseClass =
    "flex min-h-[39px] w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-white transition";

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()),
  );

  const grouped = filtered.reduce<Record<string, CommandPaletteItem[]>>(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {},
  );

  const doScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const executeItem = (item: CommandPaletteItem) => {
    if (item.id === "features") doScroll("features");
    else if (item.id === "globe") doScroll("globe");
    else if (item.id === "newsletter") doScroll("newsletter");
    else if (item.id === "ambassadors") doScroll("ambassadors");
    else if (item.id === "slack")
      window.open("https://raycast.com/community", "_blank");
    else if (item.id === "ask-ai")
      window.open("https://www.raycast.com/ai", "_blank");
    else if (
      item.id === "store" ||
      item.id === "clipboard" ||
      item.id === "search-files"
    )
      window.open("https://www.raycast.com/extensions", "_blank");
    else if (item.id === "schedule")
      window.open("https://calendar.google.com", "_blank");
    else if (item.id === "define-word")
      window.open("https://dictionary.cambridge.org", "_blank");
    else if (item.id === "calculator")
      window.open("https://www.raycast.com", "_blank");
    onClose();
  };

  const handleSetQuery = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      executeItem(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  let flatIndex = 0;

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[8vh]"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/74 backdrop-blur-md" />
      <div
        className={surfaceClass}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div
          className="pointer-events-none absolute inset-x-[10%] top-[6.4rem] bottom-[2.8rem] rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(182,32,36,0.7)_0%,rgba(132,20,24,0.5)_33%,rgba(72,10,12,0.14)_66%,rgba(0,0,0,0)_82%)] blur-[34px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-14 items-center justify-between gap-4 border-b border-[rgba(95,143,184,0.22)] bg-[linear-gradient(180deg,rgba(11,24,38,0.9)_0%,rgba(8,18,30,0.44)_100%)] px-4">
          <div className="flex flex-1 items-center gap-3.5">
            <span className="h-[22px] w-px bg-white/76" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSetQuery(e.target.value)}
              placeholder="Search for apps and commands..."
              className="flex-1 border-none bg-transparent text-[16px] font-medium tracking-[0.01em] text-white/88 outline-none placeholder:text-white/34"
            />
          </div>

          <div className="inline-flex items-center gap-2.5 text-[rgba(198,221,245,0.52)]">
            <span className="text-[14px] font-medium">Ask AI</span>
            <Keycap>Tab</Keycap>
          </div>
        </div>

        <div className="relative z-10 max-h-[440px] overflow-y-auto px-2 pt-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {Object.entries(grouped).map(([group, groupItems]) => (
            <div key={group} className="mt-1">
              <div className="px-3 py-2 text-[12px] font-semibold tracking-normal text-[rgba(207,227,248,0.72)]">
                {group}
              </div>
              <div className="grid gap-0.5">
                {groupItems.map((item) => {
                  const isCurrent = flatIndex === selectedIndex;
                  flatIndex++;

                  return (
                    <button
                      key={item.id}
                      onClick={() => executeItem(item)}
                      onMouseEnter={() => setSelectedIndex(flatIndex - 1)}
                      className={`${itemBaseClass} ${
                        isCurrent
                          ? "bg-[linear-gradient(90deg,rgba(255,255,255,0.34)_0%,rgba(216,233,255,0.17)_52%,rgba(214,230,255,0.04)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                          : "bg-transparent"
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#ff7373_0%,#ff5757_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                          {item.icon}
                        </span>
                        <span className="text-[15px] font-medium whitespace-nowrap text-[rgba(242,247,255,0.95)]">
                          {item.title}
                        </span>
                        <span className="text-[15px] whitespace-nowrap text-[rgba(207,221,240,0.72)]">
                          {item.subtitle}
                        </span>
                      </div>

                      <span className="text-[14px] text-[rgba(194,213,236,0.62)]">
                        {group === "Suggestions" ? "Suggested" : "Command"}
                      </span>

                      {isCurrent && (
                        <ArrowRight className="size-[14px] text-white/52" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-subtle py-8 text-center text-[14px]">
              找不到符合「{query}」的結果
            </div>
          )}
        </div>

        <div className="relative z-10 flex min-h-10 items-center justify-between gap-4 border-t border-[rgba(95,143,184,0.22)] bg-[linear-gradient(180deg,rgba(18,8,10,0.72)_0%,rgba(28,10,13,0.84)_100%)] px-4">
          <div className="inline-flex items-center">
            <span className="inline-flex size-[1.35rem] items-center justify-center rounded-[0.45rem] bg-white/8 text-white/84">
              <Sparkles className="size-3.5" />
            </span>
          </div>

          <div className="inline-flex items-center gap-2.5 text-[14px] font-medium text-white/88">
            <span>Open Command</span>
            <div className="inline-flex items-center gap-2 text-white/48">
              <Keycap>↵</Keycap>
              <span>|</span>
              <span>Actions</span>
              <Keycap>⌘</Keycap>
              <Keycap>K</Keycap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;
  return <CommandPaletteInner key="palette" onClose={onClose} />;
}
