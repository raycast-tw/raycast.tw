import * as React from "react";
import { cn } from "../../../utils/cn";
import { mazeDevLog } from "../maze-dev-log";
import { useGame } from "./game-context";
import { features } from "../data/feature-content";
import { TOTAL_FEATURES } from "../engine/constants";

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "rounded-[4px] px-2 py-0.5",
        "text-[12px] font-semibold text-[#f9f9f9]",
        "border border-[rgba(255,255,255,0.1)]",
        "whitespace-nowrap",
      )}
      style={{
        background: "linear-gradient(to bottom, #121212, #0d0d0d)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </span>
  );
}

function ShortcutRow({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1">
        {keys.map((key, i) => (
          <KeyCap key={i}>{key}</KeyCap>
        ))}
      </div>
      <span className="text-[12px] text-[#6a6b6c]">→</span>
      <span className="text-[14px] tracking-[0.2px] text-[#9c9c9d]">
        {description}
      </span>
    </div>
  );
}

export function FeatureCard() {
  const { state, dispatch } = useGame();
  const [visible, setVisible] = React.useState(false);

  const featureId = state.activeFeatureId;
  const feature = featureId ? features.get(featureId) : null;

  const handleDismiss = React.useCallback(() => {
    mazeDevLog("[FeatureCard:dismiss]", { featureId });
    dispatch({ type: "DISMISS_FEATURE" });
  }, [dispatch, featureId]);

  React.useEffect(() => {
    if (state.phase === "feature-card" && feature) {
      mazeDevLog("[FeatureCard:show]", { featureId });
      requestAnimationFrame(() => setVisible(true));
    } else {
      queueMicrotask(() => setVisible(false));
    }
  }, [state.phase, featureId, feature]);

  React.useEffect(() => {
    if (state.phase !== "feature-card") return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.phase, handleDismiss]);

  if (!feature || state.phase !== "feature-card") return null;

  const discovered = state.discoveredFeatures.length;

  return (
    <div
      className={cn(
        "absolute top-1/2 right-16 -translate-y-1/2",
        "w-[360px]",
        "rounded-[16px] p-6",
        "transition-transform duration-300 ease-out",
        visible ? "translate-x-0" : "translate-x-full",
      )}
      style={{
        background: "#101111",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "rgb(27,28,30) 0px 0px 0px 1px, rgba(0,0,0,0.4) 0px 8px 24px",
      }}
    >
      {/* Icon + name */}
      <div className="flex items-center gap-3">
        <img
          src={feature.iconUrl}
          width={32}
          height={32}
          style={{ objectFit: "contain" }}
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[22px] leading-tight font-semibold tracking-[0.2px] text-[#f9f9f9]">
            {feature.name}
          </span>
          <span className="text-[14px] tracking-[0.2px] text-[#9c9c9d]">
            已找到 {discovered} / {TOTAL_FEATURES} 項功能
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-1 text-[16px] leading-snug tracking-[0.2px] text-[#9c9c9d]">
        {feature.tagline}
      </p>

      {/* Description */}
      <p className="mt-4 text-[16px] leading-[1.6] tracking-[0.2px] text-[#cecece]">
        {feature.description}
      </p>

      {/* Shortcuts */}
      <div className="mt-4 flex flex-col gap-2">
        {feature.shortcuts.map((shortcut, i) => (
          <ShortcutRow
            key={i}
            keys={shortcut.keys}
            description={shortcut.description}
          />
        ))}
      </div>

      {/* Pro Tip */}
      <div
        className="mt-4 rounded-[8px] p-3"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <p className="text-[12px] font-semibold tracking-[0.3px] text-[#ffbc33]">
          專業提示
        </p>
        <p className="mt-1 text-[14px] leading-normal tracking-[0.2px] text-[#cecece]">
          {feature.tip}
        </p>
      </div>

      {/* Continue button */}
      <button
        type="button"
        onClick={handleDismiss}
        className={cn(
          "mt-6 w-full rounded-full py-2.5",
          "text-[16px] font-semibold tracking-[0.3px] text-[#18191a]",
          "transition-opacity hover:opacity-100",
          "cursor-pointer",
        )}
        style={{ background: "hsla(0,0%,100%,0.815)" }}
        onMouseOver={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "#ffffff")
        }
        onMouseOut={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background =
            "hsla(0,0%,100%,0.815)")
        }
      >
        繼續探索
      </button>
    </div>
  );
}
