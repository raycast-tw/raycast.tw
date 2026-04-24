import { GRID_COLS, GRID_ROWS, CELL_SIZE, PLAYER_RADIUS } from "./constants";

/**
 * Check if a player position is valid (no wall collision).
 * Uses four-corner bounding box method.
 */
export function canMoveTo(grid: Uint8Array, x: number, y: number): boolean {
  const r = PLAYER_RADIUS / CELL_SIZE;
  const corners: [number, number][] = [
    [x - r, y - r],
    [x + r, y - r],
    [x - r, y + r],
    [x + r, y + r],
  ];
  for (const [cx, cy] of corners) {
    const col = Math.floor(cx);
    const row = Math.floor(cy);
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS)
      return false;
    if ((grid[row * GRID_COLS + col] & 0x01) === 0) return false;
  }
  return true;
}

/**
 * Check what triggers are at or near the player position.
 */
export function getTriggersAtPosition(
  x: number,
  y: number,
  stationPositions: Map<string, { row: number; col: number }>,
  npcPositions: Map<string, { row: number; col: number }>,
): { stationId: string | null; npcId: string | null } {
  const col = Math.floor(x);
  const row = Math.floor(y);

  let stationId: string | null = null;
  for (const [id, pos] of stationPositions) {
    if (pos.row === row && pos.col === col) {
      stationId = id;
      break;
    }
  }

  let npcId: string | null = null;
  for (const [id, pos] of npcPositions) {
    // Trigger within 1.2 cell distance
    const dx = x - (pos.col + 0.5);
    const dy = y - (pos.row + 0.5);
    if (Math.sqrt(dx * dx + dy * dy) < 1.2) {
      npcId = id;
      break;
    }
  }

  return { stationId, npcId };
}
