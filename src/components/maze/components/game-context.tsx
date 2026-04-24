import * as React from "react";
import type { GameContextType } from "../engine/game-reducer";

export const GameContext = React.createContext<GameContextType>(null!);

export function useGame() {
  return React.useContext(GameContext);
}
