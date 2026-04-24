import { MazeGame } from "./components/maze-game";

/**
 * Raycast Maze Game Component
 *
 * A standalone React component that renders an interactive maze game
 * where players explore and discover Raycast features.
 *
 * Usage:
 * ```tsx
 * import { MazeGame } from '@/components/maze';
 *
 * export function App() {
 *   return (
 *     <div className="w-full h-screen">
 *       <MazeGame />
 *     </div>
 *   );
 * }
 * ```
 */

export { MazeGame };

/* eslint-disable react-refresh/only-export-components -- barrel: public hooks, types, constants */
// Export types for consumers
export type {
  GamePhase,
  GameState,
  GameAction,
  GameContextType,
} from "./engine/game-reducer";
export { useGame } from "./components/game-context";

// Export constants for consumers
export {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TOTAL_FEATURES,
} from "./engine/constants";
/* eslint-enable react-refresh/only-export-components */
