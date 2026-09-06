import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { generateDigits, generateMasterCode } from '../utils/codeGenerator';

export type Station = 1 | 2 | 3 | 4;

interface GameState {
  isStarted: boolean;
  currentStation: Station;
  digits: { puzzle: number | null; planets: number | null; memory: number | null; console: number | null };
  targetDigits: { puzzle: number; planets: number; memory: number };
  masterCode: string;
  timeTotal: number;
  timeRemaining: number;
  isComplete: boolean;
  isGameOver: boolean;
}

interface GameContextType extends GameState {
  startGame: (minutes: number) => void;
  completeStation: (station: Station, digit: number) => void;
  setCurrentStation: (station: Station) => void;
  tick: () => void;
  attemptCode: (code: string) => boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    isStarted: false,
    currentStation: 1,
    digits: { puzzle: null, planets: null, memory: null, console: null },
    targetDigits: { puzzle: 0, planets: 0, memory: 0 },
    masterCode: '',
    timeTotal: 300,
    timeRemaining: 300,
    isComplete: false,
    isGameOver: false,
  });

  const startGame = useCallback((minutes: number) => {
    const total = minutes * 60;
    const targetDigits = generateDigits();
    const allDigits = [targetDigits.puzzle, targetDigits.planets, targetDigits.memory];
    const masterCode = generateMasterCode(allDigits);

    setState({
      isStarted: true,
      currentStation: 1,
      digits: { puzzle: null, planets: null, memory: null, console: null },
      targetDigits,
      masterCode,
      timeTotal: total,
      timeRemaining: total,
      isComplete: false,
      isGameOver: false,
    });
  }, []);

  const completeStation = useCallback((station: Station, digit: number) => {
    setState(prev => {
      const newDigits = { ...prev.digits };
      if (station === 1) newDigits.puzzle = digit;
      if (station === 2) newDigits.planets = digit;
      if (station === 3) newDigits.memory = digit;
      if (station === 4) newDigits.console = digit;
      return { ...prev, digits: newDigits };
    });
  }, []);

  const setCurrentStation = useCallback((station: Station) => {
    setState(prev => ({ ...prev, currentStation: station }));
  }, []);

  const tick = useCallback(() => {
    setState(prev => {
      if (prev.isComplete || prev.isGameOver) return prev;
      const newTime = prev.timeRemaining - 1;
      if (newTime <= 0) {
        return { ...prev, timeRemaining: 0, isGameOver: true };
      }
      return { ...prev, timeRemaining: newTime };
    });
  }, []);

  const attemptCode = useCallback((code: string): boolean => {
    if (code === state.masterCode) {
      setState(prev => ({ ...prev, isComplete: true }));
      return true;
    }
    return false;
  }, [state.masterCode]);

  return (
    <GameContext.Provider value={{ ...state, startGame, completeStation, setCurrentStation, tick, attemptCode }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
