import * as React from "react";
import { gameReducer, createInitialState } from "../engine/game-reducer";
import { mazeDevLog } from "../maze-dev-log";
import { GameContext } from "./game-context";
import { MazeCanvas } from "./maze-canvas";
import { StartScreen } from "./start-screen";
import { FeatureCard } from "./feature-card";
import { GuideDialog } from "./guide-dialog";
import { GameHUD } from "./game-hud";
import { CompletionScreen } from "./completion-screen";

export function MazeGame(): React.ReactElement {
  const [state, dispatch] = React.useReducer(
    gameReducer,
    undefined,
    createInitialState,
  );

  React.useEffect(() => {
    mazeDevLog("[MazeGame:init] Phase:", state.phase);
  }, [state.phase]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className="bg-background relative h-full w-full overflow-hidden">
        {/* Layer 1: Game canvas — leaves 48px gap at bottom for HUD */}
        <div className="absolute inset-0 bottom-12 flex items-center justify-center">
          <MazeCanvas />
        </div>

        {/* Layer 2: HUD - always visible */}
        <GameHUD />

        {/* Layer 3: Feature card overlay */}
        {state.phase === "feature-card" && <FeatureCard />}

        {/* Layer 4: Guide dialog overlay */}
        {state.phase === "guide-dialog" && <GuideDialog />}

        {/* Layer 5: Start screen */}
        {state.phase === "start" && <StartScreen />}

        {/* Layer 6: Completion screen */}
        {state.phase === "complete" && <CompletionScreen />}
      </div>
    </GameContext.Provider>
  );
}
