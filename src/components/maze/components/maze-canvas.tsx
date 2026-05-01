import * as React from "react";
import thomasImgSrc from "../../../assets/thomas.png";
import pedroImgSrc from "../../../assets/pedro.png";
import playerImgSrc from "../../../assets/player.png";
import { features } from "../data/feature-content";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CELL_SIZE,
  GRID_COLS,
  GRID_ROWS,
  PLAYER_SPEED,
  PLAYER_RADIUS,
  COLORS,
  TOTAL_FEATURES,
} from "../engine/constants";
import { canMoveTo, getTriggersAtPosition } from "../engine/collision";
import {
  mazeGrid,
  stationPositions,
  npcPositions,
  exitPosition,
} from "../data/maze-data";
import { mazeDevLog, mazeDevWarn } from "../maze-dev-log";
import { useGame } from "./game-context";

// Convert a 6-digit hex color to "r,g,b" string for use in rgba()
function hexRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

const MINIMAP_WIDTH = 150;
const MINIMAP_HEIGHT = 90;
const MINIMAP_PAD = 12;
const MINIMAP_ICON_SIZE = 10;
const MINIMAP_SCALE_X = MINIMAP_WIDTH / (GRID_COLS * CELL_SIZE);
const MINIMAP_SCALE_Y = MINIMAP_HEIGHT / (GRID_ROWS * CELL_SIZE);

function drawMinimap(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  discoveredFeatures: string[],
  featureIcons: Map<string, HTMLImageElement>,
): void {
  const ox = CANVAS_WIDTH - MINIMAP_WIDTH - MINIMAP_PAD;
  const oy = MINIMAP_PAD;

  ctx.save();
  ctx.fillStyle = COLORS.minimapBg;
  ctx.strokeStyle = COLORS.minimapBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(ox, oy, MINIMAP_WIDTH, MINIMAP_HEIGHT, 6);
  ctx.fill();
  ctx.stroke();
  ctx.clip();

  // Draw maze cells
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const isWalkable = (mazeGrid[row * GRID_COLS + col] & 0x01) === 1;
      if (isWalkable) {
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(
          ox + col * CELL_SIZE * MINIMAP_SCALE_X,
          oy + row * CELL_SIZE * MINIMAP_SCALE_Y,
          CELL_SIZE * MINIMAP_SCALE_X,
          CELL_SIZE * MINIMAP_SCALE_Y,
        );
      }
    }
  }

  // Draw stations
  for (const [id, pos] of stationPositions) {
    const found = discoveredFeatures.includes(id);
    const cx = ox + (pos.col + 0.5) * CELL_SIZE * MINIMAP_SCALE_X;
    const cy = oy + (pos.row + 0.5) * CELL_SIZE * MINIMAP_SCALE_Y;

    if (found) {
      const iconImg = featureIcons.get(id);
      if (iconImg) {
        ctx.drawImage(
          iconImg,
          cx - MINIMAP_ICON_SIZE / 2,
          cy - MINIMAP_ICON_SIZE / 2,
          MINIMAP_ICON_SIZE,
          MINIMAP_ICON_SIZE,
        );
      } else {
        // Fallback dot while icon loads
        ctx.fillStyle = COLORS.minimapStationFound;
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = features.get(id)?.color ?? COLORS.minimapStation;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw NPC dots
  for (const [id, pos] of npcPositions) {
    ctx.fillStyle = id === "thomas" ? COLORS.thomas : COLORS.pedro;
    const cx = ox + (pos.col + 0.5) * CELL_SIZE * MINIMAP_SCALE_X;
    const cy = oy + (pos.row + 0.5) * CELL_SIZE * MINIMAP_SCALE_Y;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw player
  const px = ox + playerX * CELL_SIZE * MINIMAP_SCALE_X;
  const py = oy + playerY * CELL_SIZE * MINIMAP_SCALE_Y;
  ctx.fillStyle = COLORS.minimapPlayer;
  ctx.beginPath();
  ctx.arc(px, py, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  discoveredFeatures: string[],
  time: number,
  thomasImage: HTMLImageElement | null,
  pedroImage: HTMLImageElement | null,
  featureIcons: Map<string, HTMLImageElement>,
  playerImage: HTMLImageElement | null,
): void {
  // High-quality image smoothing for all drawImage calls
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Clear background (void = walls)
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw walkable floor tiles
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const isWalkable = (mazeGrid[row * GRID_COLS + col] & 0x01) === 1;
      if (!isWalkable) continue;

      const px = col * CELL_SIZE;
      const py = row * CELL_SIZE;

      ctx.fillStyle = COLORS.floor;
      ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

      // Subtle inset edges for depth on cells adjacent to walls
      const hasWallAbove =
        row === 0 || (mazeGrid[(row - 1) * GRID_COLS + col] & 0x01) === 0;
      const hasWallLeft =
        col === 0 || (mazeGrid[row * GRID_COLS + (col - 1)] & 0x01) === 0;
      const hasWallRight =
        col === GRID_COLS - 1 ||
        (mazeGrid[row * GRID_COLS + (col + 1)] & 0x01) === 0;
      const hasWallBelow =
        row === GRID_ROWS - 1 ||
        (mazeGrid[(row + 1) * GRID_COLS + col] & 0x01) === 0;

      ctx.strokeStyle = COLORS.wallEdge;
      ctx.lineWidth = 1;
      if (hasWallAbove) {
        ctx.beginPath();
        ctx.moveTo(px, py + 0.5);
        ctx.lineTo(px + CELL_SIZE, py + 0.5);
        ctx.stroke();
      }
      if (hasWallLeft) {
        ctx.beginPath();
        ctx.moveTo(px + 0.5, py);
        ctx.lineTo(px + 0.5, py + CELL_SIZE);
        ctx.stroke();
      }
      if (hasWallRight) {
        ctx.beginPath();
        ctx.moveTo(px + CELL_SIZE - 0.5, py);
        ctx.lineTo(px + CELL_SIZE - 0.5, py + CELL_SIZE);
        ctx.stroke();
      }
      if (hasWallBelow) {
        ctx.beginPath();
        ctx.moveTo(px, py + CELL_SIZE - 0.5);
        ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE - 0.5);
        ctx.stroke();
      }
    }
  }

  // Draw exit marker
  const exitPx = (exitPosition.col + 0.5) * CELL_SIZE;
  const exitPy = (exitPosition.row + 0.5) * CELL_SIZE;
  const allFound = discoveredFeatures.length === TOTAL_FEATURES;
  const exitPulse = Math.sin(time * 3) * 0.3 + 0.7;
  const exitGrad = ctx.createRadialGradient(
    exitPx,
    exitPy,
    0,
    exitPx,
    exitPy,
    20,
  );
  exitGrad.addColorStop(
    0,
    allFound
      ? `rgba(95,201,146,${exitPulse})`
      : `rgba(95,201,146,${exitPulse * 0.3})`,
  );
  exitGrad.addColorStop(1, "transparent");
  ctx.fillStyle = exitGrad;
  ctx.beginPath();
  ctx.arc(exitPx, exitPy, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = allFound ? COLORS.exitGlow : "rgba(95,201,146,0.35)";
  ctx.beginPath();
  ctx.arc(exitPx, exitPy, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw station markers
  for (const [id, pos] of stationPositions) {
    const cx = (pos.col + 0.5) * CELL_SIZE;
    const cy = (pos.row + 0.5) * CELL_SIZE;
    const found = discoveredFeatures.includes(id);

    if (found) {
      const feature = features.get(id);
      const iconImg = featureIcons.get(id);

      // Draw the icon centered on the station
      if (iconImg) {
        const iconSize = 26;
        ctx.drawImage(
          iconImg,
          cx - iconSize / 2,
          cy - iconSize / 2,
          iconSize,
          iconSize,
        );
      } else {
        // Fallback dot while icon loads
        ctx.fillStyle = feature?.color ?? COLORS.stationDiscovered;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      const dotColor = features.get(id)?.color ?? COLORS.stationUndiscovered;
      const pulse = Math.sin(time * 3) * 0.3 + 0.7;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
      grad.addColorStop(0, `rgba(${hexRgb(dotColor)},${pulse})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = dotColor;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw NPC markers
  for (const [id, pos] of npcPositions) {
    const color = id === "thomas" ? COLORS.thomas : COLORS.pedro;
    const bob = Math.sin(time * 2) * 2;
    const cx = (pos.col + 0.5) * CELL_SIZE;
    const cy = (pos.row + 0.5) * CELL_SIZE + bob;

    if (id === "thomas" && thomasImage) {
      const radius = 18;

      // Ambient glow ring
      ctx.save();
      const glow = ctx.createRadialGradient(
        cx,
        cy,
        radius - 2,
        cx,
        cy,
        radius + 10,
      );
      glow.addColorStop(0, "rgba(255,188,51,0.35)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
      ctx.fill();

      // Clip to circle and draw avatar image
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        thomasImage,
        cx - radius,
        cy - radius,
        radius * 2,
        radius * 2,
      );
      ctx.restore();

      // Yellow border ring
      ctx.strokeStyle = COLORS.thomas;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (id === "pedro" && pedroImage) {
      const radius = 18;

      // Ambient glow ring
      ctx.save();
      const glow = ctx.createRadialGradient(
        cx,
        cy,
        radius - 2,
        cx,
        cy,
        radius + 10,
      );
      glow.addColorStop(0, "rgba(85,179,255,0.35)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
      ctx.fill();

      // Clip to circle and draw avatar image
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        pedroImage,
        cx - radius,
        cy - radius,
        radius * 2,
        radius * 2,
      );
      ctx.restore();

      // Blue border ring
      ctx.strokeStyle = COLORS.pedro;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Fallback silhouette while image loads
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(cx - 6, cy - 2, 12, 16, 4);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy - 7, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw player (Stephanie Chicken)
  const pcx = playerX * CELL_SIZE;
  const pcy = playerY * CELL_SIZE + Math.sin(time * 2.5) * 1.5;

  if (playerImage) {
    const size = PLAYER_RADIUS * 2;
    ctx.drawImage(
      playerImage,
      pcx - PLAYER_RADIUS,
      pcy - PLAYER_RADIUS,
      size,
      size,
    );
  } else {
    ctx.fillStyle = COLORS.playerFill;
    ctx.beginPath();
    ctx.arc(pcx, pcy, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw minimap
  drawMinimap(ctx, playerX, playerY, discoveredFeatures, featureIcons);
}

export function MazeCanvas(): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { state, dispatch } = useGame();

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const [cssScale, setCssScale] = React.useState(1);

  const playerPosRef = React.useRef({ x: state.playerX, y: state.playerY });
  const keysRef = React.useRef<Set<string>>(new Set());
  const rafRef = React.useRef<number>(0);
  const lastTimeRef = React.useRef<number>(0);
  const thomasImageRef = React.useRef<HTMLImageElement | null>(null);
  const pedroImageRef = React.useRef<HTMLImageElement | null>(null);
  const playerImageRef = React.useRef<HTMLImageElement | null>(null);
  const featureIconsRef = React.useRef<Map<string, HTMLImageElement>>(
    new Map(),
  );
  /** When true, draw one static frame (e.g. after reset to start screen). */
  const needsStaticRedrawRef = React.useRef(true);

  const stateRef = React.useRef(state);
  const dispatchRef = React.useRef(dispatch);
  React.useLayoutEffect(() => {
    stateRef.current = state;
    dispatchRef.current = dispatch;
  });

  React.useLayoutEffect(() => {
    if (state.phase === "start") {
      needsStaticRedrawRef.current = true;
    }
  }, [state.phase]);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(() => {
      const { width, height } = wrapper.getBoundingClientRect();
      setCssScale(Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT));
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const thomasImg = new Image();
    thomasImg.src = thomasImgSrc;
    thomasImg.onload = () => {
      thomasImageRef.current = thomasImg;
      needsStaticRedrawRef.current = true;
      mazeDevLog("[MazeCanvas:assets] Thomas image loaded");
    };

    const pedroImg = new Image();
    pedroImg.src = pedroImgSrc;
    pedroImg.onload = () => {
      pedroImageRef.current = pedroImg;
      needsStaticRedrawRef.current = true;
      mazeDevLog("[MazeCanvas:assets] Pedro image loaded");
    };

    const playerImg = new Image();
    playerImg.src = playerImgSrc;
    playerImg.onload = () => {
      playerImageRef.current = playerImg;
      needsStaticRedrawRef.current = true;
      mazeDevLog("[MazeCanvas:assets] Player image loaded");
    };
  }, []);

  React.useEffect(() => {
    let loaded = 0;
    for (const [id, feature] of features) {
      const img = new Image();
      img.onload = () => {
        featureIconsRef.current.set(id, img);
        needsStaticRedrawRef.current = true;
        loaded++;
        if (loaded === features.size) {
          mazeDevLog("[MazeCanvas:assets] All feature icons loaded");
        }
      };
      img.onerror = () => {
        mazeDevWarn(
          "[MazeCanvas:assets] Failed to load icon for",
          id,
          feature.iconUrl,
        );
      };
      img.src = feature.iconUrl;
    }
  }, []);

  // Keep player pos ref in sync when state resets (e.g. RESET_GAME)
  React.useEffect(() => {
    if (state.phase === "start") {
      playerPosRef.current = { x: state.playerX, y: state.playerY };
    }
  }, [state.phase, state.playerX, state.playerY]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);

      const currentState = stateRef.current;
      if (currentState.phase !== "playing") return;

      // R → restart game
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        mazeDevLog("[MazeCanvas:shortcut] Restart game");
        dispatchRef.current({ type: "RESET_GAME" });
        return;
      }

      // Space → re-open card for an already-discovered station
      if (e.key === " ") {
        e.preventDefault();
        const { x, y } = playerPosRef.current;
        const { stationId } = getTriggersAtPosition(
          x,
          y,
          stationPositions,
          npcPositions,
        );
        if (stationId && currentState.discoveredFeatures.includes(stationId)) {
          mazeDevLog("[MazeCanvas:shortcut] Revisit feature", stationId);
          dispatchRef.current({
            type: "REVISIT_FEATURE",
            featureId: stationId,
          });
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    mazeDevLog("[MazeCanvas:init] Game loop starting");

    function loop(timestamp: number) {
      const dt =
        lastTimeRef.current === 0
          ? 0
          : (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      const time = timestamp / 1000;

      const currentState = stateRef.current;
      const currentDispatch = dispatchRef.current;
      const phase = currentState.phase;

      if (phase === "playing" && dt > 0) {
        const keys = keysRef.current;
        let dx = 0;
        let dy = 0;

        if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) dx -= 1;
        if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) dx += 1;
        if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) dy -= 1;
        if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) dy += 1;

        if (dx !== 0 || dy !== 0) {
          // Normalize diagonal movement
          const len = Math.sqrt(dx * dx + dy * dy);
          dx = (dx / len) * PLAYER_SPEED * dt;
          dy = (dy / len) * PLAYER_SPEED * dt;

          const { x, y } = playerPosRef.current;
          const newX = x + dx;
          const newY = y + dy;

          let finalX = x;
          let finalY = y;

          // Full move
          if (canMoveTo(mazeGrid, newX, newY)) {
            finalX = newX;
            finalY = newY;
          } else if (canMoveTo(mazeGrid, newX, y)) {
            // Wall-slide: x only
            finalX = newX;
            finalY = y;
          } else if (canMoveTo(mazeGrid, x, newY)) {
            // Wall-slide: y only
            finalX = x;
            finalY = newY;
          }

          if (finalX !== x || finalY !== y) {
            playerPosRef.current = { x: finalX, y: finalY };
            currentDispatch({ type: "MOVE_PLAYER", x: finalX, y: finalY });

            // Check triggers at new position
            const { stationId, npcId } = getTriggersAtPosition(
              finalX,
              finalY,
              stationPositions,
              npcPositions,
            );

            if (
              stationId &&
              !currentState.discoveredFeatures.includes(stationId)
            ) {
              mazeDevLog("[MazeCanvas:trigger] Discovered feature:", stationId);
              currentDispatch({
                type: "DISCOVER_FEATURE",
                featureId: stationId,
              });
            } else if (npcId && !currentState.encounteredNPCs.includes(npcId)) {
              mazeDevLog("[MazeCanvas:trigger] Encountered NPC:", npcId);
              currentDispatch({ type: "ENCOUNTER_NPC", npcId });
            }
          }
        }
      }

      const { x, y } = playerPosRef.current;
      const shouldDraw =
        phase === "playing" ||
        (phase === "start" && needsStaticRedrawRef.current);

      if (!shouldDraw) {
        rafRef.current = 0;
        return;
      }

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(
        ctx!,
        x,
        y,
        stateRef.current.discoveredFeatures,
        time,
        thomasImageRef.current,
        pedroImageRef.current,
        featureIconsRef.current,
        playerImageRef.current,
      );

      if (phase === "start" && needsStaticRedrawRef.current) {
        needsStaticRedrawRef.current = false;
      }

      if (phase === "playing") {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = 0;
      }
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastTimeRef.current = 0;
      mazeDevLog("[MazeCanvas:cleanup] Game loop stopped");
    };
  }, [dpr, state.phase]);

  return (
    <div
      ref={wrapperRef}
      className="flex h-full w-full items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH * dpr}
        height={CANVAS_HEIGHT * dpr}
        className="block"
        style={{
          width: CANVAS_WIDTH * cssScale,
          height: CANVAS_HEIGHT * cssScale,
          background: "#07080a",
        }}
      />
    </div>
  );
}
