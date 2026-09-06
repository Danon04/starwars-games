import { useEffect, useRef } from 'react';
import { useGame } from '../store/gameState';

export function useTimer() {
  const { timeRemaining, timeTotal, isStarted, isComplete, isGameOver, tick } = useGame();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isStarted && !isComplete && !isGameOver && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStarted, isComplete, isGameOver, timeRemaining, tick]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progress = timeTotal > 0 ? timeRemaining / timeTotal : 0;
  const isWarning = timeRemaining <= 60 && timeRemaining > 30;
  const isDanger = timeRemaining <= 30 && timeRemaining > 0;

  return { minutes, seconds, formatted, progress, isWarning, isDanger, timeRemaining, timeTotal };
}
