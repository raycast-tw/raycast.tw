import * as React from "react";
import { useGame } from "./game-context";
import { TOTAL_FEATURES } from "../engine/constants";

function SmallKeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-foreground inline-flex items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[12px] font-semibold whitespace-nowrap"
      style={{
        background: "linear-gradient(to bottom, #121212, #0d0d0d)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.6)",
      }}
    >
      {children}
    </span>
  );
}

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function GameHUD() {
  const { state } = useGame();
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (state.phase === "start") {
      queueMicrotask(() => setElapsed(0));
      return;
    }
    if (state.phase === "complete" && state.startTime !== null) {
      queueMicrotask(() => setElapsed(Date.now() - state.startTime!));
      return;
    }
    if (state.phase !== "playing" || state.startTime === null) {
      return;
    }

    const tick = () => {
      setElapsed(Date.now() - state.startTime!);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [state.phase, state.startTime]);

  const discovered = state.discoveredFeatures.length;
  const fillPercent = (discovered / TOTAL_FEATURES) * 100;

  return (
    <div
      className="absolute right-0 bottom-0 left-0 flex h-12 items-center px-5"
      style={{
        background: "#07080a",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Progress — left */}
      <div className="flex w-32 shrink-0 flex-col gap-1">
        <span className="text-muted text-[15px] font-semibold tabular-nums">
          {discovered} / {TOTAL_FEATURES} 項功能
        </span>
        <div
          className="h-[3px] overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.06)", width: 120 }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${fillPercent}%`, background: "#FF6363" }}
          />
        </div>
      </div>

      {/* Controls hint — center */}
      <div className="flex flex-1 items-center justify-center gap-3">
        <div className="flex items-center gap-1">
          <SmallKeyCap>↑</SmallKeyCap>
          <SmallKeyCap>↓</SmallKeyCap>
          <SmallKeyCap>←</SmallKeyCap>
          <SmallKeyCap>→</SmallKeyCap>
          <span className="text-subtle ml-1 text-[13px]">移動</span>
        </div>
        <div className="flex items-center gap-1">
          <SmallKeyCap>WASD</SmallKeyCap>
          <span className="text-subtle text-[13px]">亦可</span>
        </div>
        <div className="flex items-center gap-1">
          <SmallKeyCap>Space</SmallKeyCap>
          <span className="text-subtle text-[13px]">互動</span>
        </div>
        <div className="flex items-center gap-1">
          <SmallKeyCap>R</SmallKeyCap>
          <span className="text-subtle text-[13px]">重開</span>
        </div>
      </div>

      {/* Timer — right */}
      <div className="flex w-32 shrink-0 justify-end">
        <span className="text-subtle font-mono text-[15px] tabular-nums">
          {formatElapsed(elapsed)}
        </span>
      </div>
    </div>
  );
}
