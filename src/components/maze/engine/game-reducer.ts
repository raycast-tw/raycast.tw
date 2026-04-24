import * as React from "react";
import { TOTAL_FEATURES } from "./constants";
import { startPosition } from "../data/maze-data";

export type GamePhase =
  | "start"
  | "playing"
  | "feature-card"
  | "guide-dialog"
  | "complete";

export interface GameState {
  phase: GamePhase;
  playerX: number; // grid coords (float for interpolation)
  playerY: number;
  discoveredFeatures: string[]; // feature IDs found
  encounteredNPCs: string[]; // NPC IDs spoken to
  activeFeatureId: string | null;
  activeNPCId: string | null;
  activeGuideDialogIndex: number;
  moveCount: number;
  startTime: number | null;
}

export type GameAction =
  | { type: "START_GAME" }
  | { type: "MOVE_PLAYER"; x: number; y: number }
  | { type: "DISCOVER_FEATURE"; featureId: string }
  | { type: "REVISIT_FEATURE"; featureId: string }
  | { type: "DISMISS_FEATURE" }
  | { type: "ENCOUNTER_NPC"; npcId: string }
  | { type: "ADVANCE_DIALOG" }
  | { type: "DISMISS_DIALOG" }
  | { type: "RESET_GAME" };

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function createInitialState(): GameState {
  return {
    phase: "start",
    playerX: startPosition.col + 0.5,
    playerY: startPosition.row + 0.5,
    discoveredFeatures: [],
    encounteredNPCs: [],
    activeFeatureId: null,
    activeNPCId: null,
    activeGuideDialogIndex: 0,
    moveCount: 0,
    startTime: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        phase: "playing",
        startTime: Date.now(),
      };

    case "MOVE_PLAYER":
      return {
        ...state,
        playerX: action.x,
        playerY: action.y,
        moveCount: state.moveCount + 1,
      };

    case "DISCOVER_FEATURE": {
      if (state.discoveredFeatures.includes(action.featureId)) return state;
      return {
        ...state,
        discoveredFeatures: [...state.discoveredFeatures, action.featureId],
        activeFeatureId: action.featureId,
        phase: "feature-card",
      };
    }

    case "REVISIT_FEATURE": {
      if (!state.discoveredFeatures.includes(action.featureId)) return state;
      return {
        ...state,
        activeFeatureId: action.featureId,
        phase: "feature-card",
      };
    }

    case "DISMISS_FEATURE": {
      const allFound = state.discoveredFeatures.length === TOTAL_FEATURES;
      return {
        ...state,
        activeFeatureId: null,
        phase: allFound ? "complete" : "playing",
      };
    }

    case "ENCOUNTER_NPC": {
      if (state.encounteredNPCs.includes(action.npcId)) return state;
      return {
        ...state,
        encounteredNPCs: [...state.encounteredNPCs, action.npcId],
        activeNPCId: action.npcId,
        activeGuideDialogIndex: 0,
        phase: "guide-dialog",
      };
    }

    case "ADVANCE_DIALOG":
      return {
        ...state,
        activeGuideDialogIndex: state.activeGuideDialogIndex + 1,
      };

    case "DISMISS_DIALOG":
      return {
        ...state,
        activeNPCId: null,
        activeGuideDialogIndex: 0,
        phase: "playing",
      };

    case "RESET_GAME":
      return createInitialState();

    default:
      return state;
  }
}
