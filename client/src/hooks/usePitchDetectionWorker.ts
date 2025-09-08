import { useRef, useCallback, useEffect } from "react";

interface PitchDetectionConfig {
  bufferSize: number;
  volumeThreshold: number;
  minPitch: number;
  maxPitch: number;
}

interface PitchDetectionResult {
  type: "PITCH_DETECTED";
  pitch: number | null;
  volume: number;
  isValid: boolean;
}

interface PitchDetectionMessage {
  type: "DETECT_PITCH";
  audioData: Float32Array;
  sampleRate: number;
  config: PitchDetectionConfig;
}

const usePitchDetectionWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const callbackRef = useRef<((result: PitchDetectionResult) => void) | null>(null);

  // Initialize the worker
  const initializeWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current;

    try {
      // Load worker from external file
      workerRef.current = new Worker("/pitchDetectionWorker.js");

      workerRef.current.onmessage = (event: MessageEvent<PitchDetectionResult>) => {
        if (callbackRef.current && event.data.type === "PITCH_DETECTED") {
          callbackRef.current(event.data);
        }
      };

      workerRef.current.onerror = (error) => {
        console.error("Pitch detection worker error:", error);
      };

      return workerRef.current;
    } catch (error) {
      console.error("Failed to create pitch detection worker:", error);
      return null;
    }
  }, []);

  // Detect pitch using the worker
  const detectPitch = useCallback(
    (
      audioData: Float32Array,
      sampleRate: number,
      config: PitchDetectionConfig,
      callback: (result: PitchDetectionResult) => void
    ) => {
      const worker = workerRef.current || initializeWorker();
      if (!worker) {
        // Fallback: call callback with null result if worker fails
        callback({
          type: "PITCH_DETECTED",
          pitch: null,
          volume: 0,
          isValid: false,
        });
        return;
      }

      callbackRef.current = callback;

      const message: PitchDetectionMessage = {
        type: "DETECT_PITCH",
        audioData,
        sampleRate,
        config,
      };

      // Use transferable objects on mobile for better performance
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        worker.postMessage(message, [message.audioData.buffer]);
      } else {
        worker.postMessage(message);
      }
    },
    [initializeWorker]
  );

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      callbackRef.current = null;
    };
  }, []);

  return {
    detectPitch,
    isWorkerSupported: typeof Worker !== "undefined",
  };
};

export default usePitchDetectionWorker;
