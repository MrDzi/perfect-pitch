import { useState, useEffect, useRef } from "react";

interface UseCountdownReturn {
  count: number | null;
  start: (initialCount: number) => void;
  stop: () => void;
  reset: () => void;
  isActive: boolean;
}

const useCountdown = (onComplete?: () => void): UseCountdownReturn => {
  const [count, setCount] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (count === null || count <= 0) {
      if (count === 0 && onComplete) {
        onComplete();
      }
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount === null || prevCount <= 1) {
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [count, isActive, onComplete]);

  const start = (initialCount: number) => {
    setCount(initialCount);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  const reset = () => {
    setCount(null);
    setIsActive(false);
  };

  return { count, start, stop, reset, isActive };
};

export default useCountdown;
