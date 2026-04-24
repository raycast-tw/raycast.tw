import * as React from "react";
import { cn } from "../../../utils/cn";
import { mazeDevLog } from "../maze-dev-log";
import { useGame } from "./game-context";
import { features } from "../data/feature-content";
import { TOTAL_FEATURES } from "../engine/constants";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function CompletionScreen() {
  const { state, dispatch } = useGame();
  const [visible, setVisible] = React.useState(false);
  const [elapsedMs, setElapsedMs] = React.useState(0);

  const handleReset = React.useCallback(() => {
    mazeDevLog("[CompletionScreen:reset]");
    dispatch({ type: "RESET_GAME" });
  }, [dispatch]);

  React.useEffect(() => {
    if (state.phase === "complete") {
      mazeDevLog("[CompletionScreen:show]", {
        discovered: state.discoveredFeatures.length,
        moveCount: state.moveCount,
      });
      requestAnimationFrame(() => setVisible(true));
      // NOTE: Removed Electron IPC call to open confetti extension
      // Original: window.glazeAPI.glaze.ipc.invoke('app:openExternal', 'raycast://extensions/raycast/raycast/confetti')
    } else {
      queueMicrotask(() => setVisible(false));
    }
  }, [state.phase, state.discoveredFeatures.length, state.moveCount]);

  React.useEffect(() => {
    if (state.phase !== "complete") return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleReset();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [state.phase, handleReset]);

  React.useEffect(() => {
    if (state.phase !== "complete" || state.startTime === null) {
      setElapsedMs(0);
      return;
    }
    setElapsedMs(Date.now() - state.startTime);
  }, [state.phase, state.startTime]);

  if (state.phase !== "complete") return null;

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        "backdrop-blur-sm",
        "transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{ background: "rgba(7, 8, 10, 0.92)" }}
    >
      <div className="flex w-full max-w-2xl flex-col items-center px-8 text-center">
        {/* Title */}
        <h1 className="text-foreground text-[48px] leading-[1.1] font-semibold tracking-normal">
          全部找到了！
        </h1>

        {/* Decorative accent */}
        <div className="mt-3 flex items-center justify-center">
          <div
            className="h-[5px] w-[60px] rounded-full"
            style={{
              background: "#FF6363",
              transform: "rotate(-12deg)",
            }}
          />
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-6">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-foreground text-[28px] font-semibold tabular-nums">
              {state.discoveredFeatures.length}
            </span>
            <span className="text-muted text-[14px]">已發現功能</span>
          </div>
          <div
            className="h-8 w-px shrink-0"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-foreground font-mono text-[28px] font-semibold tabular-nums">
              {formatElapsed(elapsedMs)}
            </span>
            <span className="text-muted text-[14px]">時間</span>
          </div>
          <div
            className="h-8 w-px shrink-0"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-foreground text-[28px] font-semibold tabular-nums">
              {state.moveCount}
            </span>
            <span className="text-muted text-[14px]">步數</span>
          </div>
        </div>

        {/* Feature grid */}
        <div
          className="rounded-card mt-6 w-full p-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-muted mb-3 text-left text-[12px] font-semibold tracking-[0.3px]">
            已發現功能
          </p>
          <div className="grid grid-cols-2 gap-3">
            {state.discoveredFeatures.map((featureId) => {
              const feature = features.get(featureId);
              if (!feature) return null;
              return (
                <div
                  key={featureId}
                  className="flex min-w-0 items-center gap-2"
                >
                  <img
                    src={feature.iconUrl}
                    width={16}
                    height={16}
                    style={{ objectFit: "contain", flexShrink: 0 }}
                  />
                  <span className="text-light-gray truncate text-[14px] tracking-[0.2px]">
                    {feature.name}
                  </span>
                </div>
              );
            })}
            {/* Pad to TOTAL_FEATURES slots if somehow under */}
            {Array.from({
              length: Math.max(
                0,
                TOTAL_FEATURES - state.discoveredFeatures.length,
              ),
            }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-2">
                <div
                  className="size-4 shrink-0 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <span className="text-subtle text-[14px]">—</span>
              </div>
            ))}
          </div>
        </div>

        {/* Play Again button */}
        <button
          type="button"
          onClick={handleReset}
          className="mt-8 cursor-pointer rounded-full px-8 py-3 text-[16px] font-semibold tracking-[0.3px] text-[#18191a] transition-opacity"
          style={{ background: "hsla(0,0%,100%,0.815)" }}
          onMouseOver={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "#ffffff")
          }
          onMouseOut={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
              "hsla(0,0%,100%,0.815)")
          }
        >
          再玩一次
        </button>
      </div>
    </div>
  );
}
