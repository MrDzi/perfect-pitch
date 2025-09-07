import { useState, useEffect, useCallback } from "react";
import { GameStatus } from "../types/types";

interface GameStateConfig {
  totalSteps: number;
  counterStartValue: number;
  onCounterComplete?: () => void;
}

interface GameStateReturn {
  gameStatus: GameStatus;
  currentStep: number;
  counter: number | null;
  points: number | null;
  totalPoints: number;
  startGame: () => void;
  restartGame: () => void;
  nextStep: (earnedPoints: number) => void;
  setGameStatus: (status: GameStatus) => void;
  setCounter: (counter: number | null) => void;
  setCurrentStep: (step: number) => void;
  setTotalPoints: (points: number) => void;
}

const useGameState = (config: GameStateConfig): GameStateReturn => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    if (gameStatus === GameStatus.InProgress) {
      setTotalPoints(0);
      setCurrentStep(0);
      setCounter(config.counterStartValue);
    }
  }, [gameStatus, config.counterStartValue]);

  useEffect(() => {
    if (points === null) {
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentStep((step) => step + 1);
      setTotalPoints((total) => total + points);
      setPoints(null);
      setCounter(config.counterStartValue);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [points, config.counterStartValue]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    const timeout = setTimeout(() => {
      setCounter(counter - 1);
      if (counter === 1) {
        if (currentStep === config.totalSteps) {
          setGameStatus(GameStatus.Ended);
          return;
        }
        if (config.onCounterComplete) {
          config.onCounterComplete();
        }
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [counter, currentStep, config.totalSteps, config.onCounterComplete]);

  const startGame = useCallback(() => {
    setGameStatus(GameStatus.InProgress);
  }, []);

  const restartGame = useCallback(() => {
    setTotalPoints(0);
    setCurrentStep(0);
    setGameStatus(GameStatus.InProgress);
  }, []);

  const nextStep = useCallback((earnedPoints: number) => {
    setPoints(earnedPoints);
  }, []);

  return {
    gameStatus,
    currentStep,
    counter,
    points,
    totalPoints,
    startGame,
    restartGame,
    nextStep,
    setGameStatus,
    setCounter,
    setCurrentStep,
    setTotalPoints,
  };
};

export default useGameState;
