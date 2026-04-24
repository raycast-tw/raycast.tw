import {
  CalendarDays,
  ClipboardList,
  Calculator,
  Search,
  Sparkles,
  Store,
  BookOpenText,
} from "lucide-react";
import { Keycap } from "../ui/Keycap";

const previewGroups = [
  {
    title: "Suggestions",
    items: [
      { label: "Store", app: "Raycast", icon: Store, active: true },
      { label: "Clipboard History", app: "Raycast", icon: ClipboardList },
      { label: "Search Files", app: "Raycast", icon: Search },
      { label: "My Schedule", app: "Calendar", icon: CalendarDays },
      { label: "Define Word", app: "Dictionary", icon: BookOpenText },
    ],
  },
  {
    title: "Commands",
    items: [
      { label: "Calculator History", app: "Calculator", icon: Calculator },
      { label: "My Schedule", app: "Calendar", icon: CalendarDays },
      { label: "Clipboard History", app: "Raycast", icon: ClipboardList },
    ],
  },
];

export function CommandPalettePreview() {
  const surfaceClass =
    "relative w-full max-w-[1080px] overflow-hidden rounded-[14px] border border-[rgba(51,160,255,0.62)] bg-[linear-gradient(180deg,rgba(6,14,25,0.98)_0%,rgba(4,9,17,0.98)_32%,rgba(4,8,15,0.98)_100%)] shadow-[0_36px_120px_-56px_rgba(0,0,0,0.95),0_0_0_1px_rgba(16,126,255,0.22),inset_0_1px_0_rgba(140,200,255,0.16)] backdrop-blur-[24px]";
  const itemBaseClass =
    "flex min-h-[39px] w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-white transition";

  return (
    <div className={surfaceClass}>
      <div
        className="pointer-events-none absolute inset-x-[10%] top-[6.4rem] bottom-[2.8rem] rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(182,32,36,0.7)_0%,rgba(132,20,24,0.5)_33%,rgba(72,10,12,0.14)_66%,rgba(0,0,0,0)_82%)] blur-[34px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-14 items-center justify-between gap-4 border-b border-[rgba(95,143,184,0.22)] bg-[linear-gradient(180deg,rgba(11,24,38,0.9)_0%,rgba(8,18,30,0.44)_100%)] px-4">
        <div className="flex flex-1 items-center gap-3.5">
          <span className="h-[22px] w-px bg-white/76" aria-hidden="true" />
          <span className="text-[16px] font-medium tracking-[0.01em] text-[rgba(220,236,255,0.34)]">
            Search for apps and commands...
          </span>
        </div>

        <div className="inline-flex items-center gap-2.5 text-[rgba(198,221,245,0.52)]">
          <span className="text-[14px] font-medium">Ask AI</span>
          <Keycap>Tab</Keycap>
        </div>
      </div>

      <div className="relative z-10 px-2 pt-3 pb-4">
        {previewGroups.map((group) => (
          <div key={group.title} className="mt-1">
            <div className="px-3 py-2 text-[12px] font-semibold tracking-normal text-[rgba(207,227,248,0.72)]">
              {group.title}
            </div>
            <div className="grid gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={`${group.title}-${item.label}`}
                    className={`${itemBaseClass} ${
                      item.active
                        ? "bg-[linear-gradient(90deg,rgba(255,255,255,0.34)_0%,rgba(216,233,255,0.17)_52%,rgba(214,230,255,0.04)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                        : "bg-transparent"
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(180deg,#ff7373_0%,#ff5757_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                        <Icon className="size-4" />
                      </span>
                      <span className="text-[15px] font-medium whitespace-nowrap text-[rgba(242,247,255,0.95)]">
                        {item.label}
                      </span>
                      <span className="text-[15px] whitespace-nowrap text-[rgba(207,221,240,0.72)]">
                        {item.app}
                      </span>
                    </div>
                    <span className="text-[14px] text-[rgba(194,213,236,0.62)]">
                      Command
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
  );
}
