import { GRID_COLS, GRID_ROWS } from "../engine/constants";

const mazeString = [
  "#########################",
  "#.....#.........#.......#",
  "#.###.#.#.#####.#.#.###.#",
  "#.#.....#.......#.#.....#",
  "#.#.###.#.#.###.#.#.#.#.#",
  "#.....#.#.#.......#.#...#",
  "#.###.###.###.###.###.#.#",
  "#.................#.....#",
  "#.###.###.###.###.#.###.#",
  "#.....#.#.#.......#.#...#",
  "#.#.###.#.#.###.#.#.#.#.#",
  "#.#.......#.......#.....#",
  "#.#######.#####.#.#####.#",
  "#...............#.......#",
  "#########################",
];

function parseMaze(rows: string[]): Uint8Array {
  const grid = new Uint8Array(GRID_COLS * GRID_ROWS);
  for (let row = 0; row < GRID_ROWS; row++) {
    const line = rows[row] ?? "";
    for (let col = 0; col < GRID_COLS; col++) {
      const ch = line[col] ?? "#";
      grid[row * GRID_COLS + col] = ch === "." ? 1 : 0;
    }
  }
  return grid;
}

export const mazeGrid: Uint8Array = parseMaze(mazeString);

export const startPosition: { row: number; col: number } = { row: 1, col: 1 };

export const exitPosition: { row: number; col: number } = { row: 13, col: 23 };

export const stationPositions = new Map<string, { row: number; col: number }>([
  ["search-bar", { row: 1, col: 3 }],
  ["hotkey", { row: 3, col: 5 }],
  ["clipboard", { row: 5, col: 3 }],
  ["snippets", { row: 9, col: 3 }],
  ["quicklinks", { row: 3, col: 11 }],
  ["window-mgmt", { row: 5, col: 13 }],
  ["calculator", { row: 7, col: 10 }],
  ["calendar", { row: 9, col: 13 }],
  ["file-search", { row: 11, col: 15 }],
  ["store", { row: 3, col: 21 }],
  ["ai", { row: 5, col: 21 }],
  ["notes", { row: 7, col: 21 }],
  ["focus", { row: 9, col: 21 }],
  ["system", { row: 11, col: 21 }],
]);

export const npcPositions = new Map<string, { row: number; col: number }>([
  ["thomas", { row: 7, col: 7 }],
  ["pedro", { row: 7, col: 15 }],
]);
