import * as React from "react";
import { cn } from "../../../utils/cn";
import { mazeDevLog } from "../maze-dev-log";
import { useGame } from "./game-context";
import playerImgSrc from "../../../assets/player.png";

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-foreground inline-flex items-center justify-center rounded-[4px] border border-[rgba(255,255,255,0.1)] px-2 py-1 text-[13px] font-semibold whitespace-nowrap"
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

export function StartScreen() {
  const { state, dispatch } = useGame();
  const [visible, setVisible] = React.useState(false);

  const handleStart = React.useCallback(() => {
    mazeDevLog("[StartScreen:start]");
    dispatch({ type: "START_GAME" });
  }, [dispatch]);

  React.useEffect(() => {
    if (state.phase === "start") {
      requestAnimationFrame(() => setVisible(true));
    }
  }, [state.phase]);

  React.useEffect(() => {
    if (state.phase !== "start") return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleStart();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleStart, state.phase]);

  if (state.phase !== "start") return null;

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
      <div className="flex max-w-lg flex-col items-center px-8 text-center">
        {/* Title */}
        <h1 className="text-foreground text-[48px] leading-[1.1] font-semibold tracking-normal">
          Raycast 迷宮
        </h1>

        {/* Decorative accent bar */}
        <div className="relative mt-3 flex items-center justify-center overflow-visible">
          <div
            className="h-[5px] w-[60px] rounded-full"
            style={{
              background: "#FF6363",
              transform: "rotate(-12deg)",
            }}
          />
        </div>

        {/* Subtitle */}
        <p className="text-muted mt-6 text-[18px] tracking-[0.2px]">
          探索迷宮，解鎖 14 項 Raycast 功能。
        </p>
        <p className="text-subtle mt-2 text-[16px]">
          Thomas 與 Pedro 會在途中為你導覽。
        </p>

        {/* Controls */}
        <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <KeyCap>↑</KeyCap>
              <KeyCap>↓</KeyCap>
              <KeyCap>←</KeyCap>
              <KeyCap>→</KeyCap>
            </div>
            <span className="text-subtle text-[14px]">移動</span>
          </div>
          <div className="flex items-center gap-2">
            <KeyCap>Space</KeyCap>
            <span className="text-subtle text-[14px]">互動</span>
          </div>
        </div>

        {/* Stephanie Chicken intro */}
        <div
          className={cn(
            "mt-8 flex items-center gap-3",
            "transition-all delay-200 duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <img
            src={playerImgSrc}
            width={44}
            height={44}
            className="shrink-0 rounded-full"
            style={{
              border: "2px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.04)",
            }}
          />
          <div
            className="rounded-2xl px-4 py-3 text-left"
            style={{
              background: "#111213",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <p className="text-foreground text-[14px] leading-snug">
              嗨！我是 Stephanie Chicken 🐔
            </p>
            <p className="text-muted mt-0.5 text-[13px] leading-snug">
              讓我帶你逛一圈 Raycast！
            </p>
          </div>
        </div>

        {/* Start button */}
        <button
          type="button"
          onClick={handleStart}
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
          開始探索
        </button>
      </div>
    </div>
  );
}
