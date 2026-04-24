import * as React from "react";
import { cn } from "../../../utils/cn";
import { mazeDevLog } from "../maze-dev-log";
import { useGame } from "./game-context";
import { guideScripts } from "../data/guide-scripts";

function LineDots({
  total,
  current,
  color,
}: {
  total: number;
  current: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-200"
          style={{
            width: i === current ? 16 : 6,
            height: 6,
            background: i === current ? color : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
}

export function GuideDialog() {
  const { state, dispatch } = useGame();
  const [visible, setVisible] = React.useState(false);

  const npcId = state.activeNPCId;
  const script = npcId ? guideScripts.get(npcId) : null;
  const lineIndex = state.activeGuideDialogIndex;
  const isLastLine = script ? lineIndex >= script.lines.length - 1 : true;

  const handleDismiss = React.useCallback(() => {
    mazeDevLog("[GuideDialog:dismiss]", { npcId });
    dispatch({ type: "DISMISS_DIALOG" });
  }, [dispatch, npcId]);

  const handleAdvance = React.useCallback(() => {
    if (isLastLine) {
      handleDismiss();
    } else {
      mazeDevLog("[GuideDialog:advance]", { npcId, lineIndex });
      dispatch({ type: "ADVANCE_DIALOG" });
    }
  }, [dispatch, handleDismiss, isLastLine, lineIndex, npcId]);

  React.useEffect(() => {
    if (state.phase === "guide-dialog" && script) {
      mazeDevLog("[GuideDialog:show]", { npcId, lineIndex });
      requestAnimationFrame(() => setVisible(true));
    } else {
      queueMicrotask(() => setVisible(false));
    }
  }, [lineIndex, npcId, script, state.phase]);

  React.useEffect(() => {
    if (state.phase !== "guide-dialog") return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleAdvance();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleDismiss();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAdvance, handleDismiss, state.phase]);

  if (!script || state.phase !== "guide-dialog") return null;

  const currentLine = script.lines[lineIndex] ?? "";

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2",
        "w-full max-w-[480px] px-5 py-5",
        "rounded-card",
        "transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        top: 120,
        background: "#101111",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "rgb(27,28,30) 0px 0px 0px 1px, rgba(0,0,0,0.4) 0px 8px 24px",
      }}
    >
      {/* NPC Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="size-2 shrink-0 rounded-full"
          style={{ background: script.color }}
        />
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="text-foreground text-[18px] leading-tight font-semibold">
            {script.name}
          </span>
          <span className="text-subtle shrink-0 text-[14px]">
            {script.role}
          </span>
        </div>
      </div>

      {/* Dialog text */}
      <p className="text-light-gray mt-3 text-[16px] leading-[1.6] tracking-[0.2px]">
        {currentLine}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-subtle text-[12px]">
          {isLastLine ? "按空白鍵關閉" : "按空白鍵繼續"}
        </p>
        <LineDots
          total={script.lines.length}
          current={lineIndex}
          color={script.color}
        />
      </div>
    </div>
  );
}
