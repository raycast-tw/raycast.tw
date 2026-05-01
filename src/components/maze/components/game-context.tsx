import * as React from "react";
import type { GameContextType } from "../engine/game-reducer";

export const GameContext = React.createContext<GameContextType>(null!);

export function useGame() {
  const ctx = React.useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameContext.Provider");
  return ctx;
}
