export const CELL_SIZE = 40;
export const GRID_COLS = 25;
export const GRID_ROWS = 15;
export const PLAYER_SPEED = 4.5; // cells per second
export const PLAYER_RADIUS = 12; // pixels
export const TOTAL_FEATURES = 14;
export const CANVAS_WIDTH = CELL_SIZE * GRID_COLS; // 1000
export const CANVAS_HEIGHT = CELL_SIZE * GRID_ROWS; // 600

export const COLORS = {
  background: "#07080a",
  floor: "#0d0e10",
  wallEdge: "rgba(255,255,255,0.03)",
  stationUndiscovered: "#FF6363",
  stationDiscovered: "#5fc992",
  playerFill: "#ffffff",
  playerGlow: "rgba(255,99,99,0.3)",
  thomas: "#ffbc33",
  pedro: "#55b3ff",
  minimapBg: "rgba(7,8,10,0.85)",
  minimapBorder: "rgba(255,255,255,0.1)",
  minimapPlayer: "#ffffff",
  minimapStation: "#FF6363",
  minimapStationFound: "#5fc992",
  exitGlow: "#5fc992",
  text: "#f9f9f9",
  textSecondary: "#9c9c9d",
};
