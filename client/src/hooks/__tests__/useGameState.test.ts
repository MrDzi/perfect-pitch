import { renderHook, act } from "@testing-library/react";
import { GameStatus } from "../../types/types";
import useGameState from "../useGameState";

describe("useGameState", () => {
  const defaultConfig = {
    totalSteps: 5,
    counterStartValue: 3,
    onCounterComplete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    expect(result.current.gameStatus).toBe(GameStatus.NotStarted);
    expect(result.current.currentStep).toBe(0);
    expect(result.current.counter).toBe(null);
    expect(result.current.points).toBe(null);
    expect(result.current.totalPoints).toBe(0);
  });

  it("should start game correctly", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    act(() => {
      result.current.startGame();
    });

    expect(result.current.gameStatus).toBe(GameStatus.InProgress);
  });

  it("should set counter when game starts", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    act(() => {
      result.current.startGame();
    });

    expect(result.current.counter).toBe(3);
  });

  it("should handle nextStep with earned points", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    act(() => {
      result.current.startGame();
      result.current.nextStep(100);
    });

    expect(result.current.points).toBe(100);

    // Fast-forward timers to trigger the step completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.totalPoints).toBe(100);
    expect(result.current.points).toBe(null);
  });

  it("should restart game correctly", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    act(() => {
      result.current.startGame();
      result.current.nextStep(50);
      jest.advanceTimersByTime(2000);
      result.current.restartGame();
    });

    expect(result.current.gameStatus).toBe(GameStatus.InProgress);
    expect(result.current.currentStep).toBe(0);
    expect(result.current.totalPoints).toBe(0);
  });

  it("should handle counter countdown", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    act(() => {
      result.current.setCounter(3);
    });

    expect(result.current.counter).toBe(3);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.counter).toBe(2);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.counter).toBe(1);
  });

  it("should set game status", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    act(() => {
      result.current.setGameStatus(GameStatus.InProgress);
    });

    expect(result.current.gameStatus).toBe(GameStatus.InProgress);
  });

  it("should set total points", () => {
    const { result } = renderHook(() => useGameState(defaultConfig));

    act(() => {
      result.current.setTotalPoints(150);
    });

    expect(result.current.totalPoints).toBe(150);
  });
});
