import { useRef, useCallback, useEffect, useState } from "react";

export interface AudioContextState {
  context: AudioContext | null;
  isInitialized: boolean;
}

export interface OscillatorConfig {
  frequency: number;
  gain: number;
  duration?: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentIndex: number;
}

const useAudio = () => {
  const [contextState, setContextState] = useState<AudioContextState>({
    context: null,
    isInitialized: false,
  });
  const [playbackState, setPlaybackState] = useState<AudioPlaybackState>({
    isPlaying: false,
    currentIndex: 0,
  });

  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize audio context
  const initializeAudioContext = useCallback(() => {
    if (contextState.isInitialized) return contextState.context;

    try {
      const audioContext = new AudioContext();
      setContextState({
        context: audioContext,
        isInitialized: true,
      });
      return audioContext;
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
      return null;
    }
  }, [contextState.isInitialized, contextState.context]);

  // Create oscillator with gain node
  const createOscillator = useCallback(
    (config: OscillatorConfig) => {
      const audioContext = contextState.context || initializeAudioContext();
      if (!audioContext) return null;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = config.frequency;
      gainNode.gain.value = config.gain;

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      return { oscillator, gainNode, audioContext };
    },
    [contextState.context, initializeAudioContext]
  );

  // Stop oscillator with fade out
  const stopOscillator = useCallback(
    (fadeOutDuration = 0.1) => {
      if (!gainNodeRef.current || !oscillatorRef.current || !contextState.context) return;

      const currentTime = contextState.context.currentTime;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, currentTime + fadeOutDuration);
      oscillatorRef.current.stop(currentTime + fadeOutDuration + 0.1);

      oscillatorRef.current = null;
      gainNodeRef.current = null;
    },
    [contextState.context]
  );

  // Play single tone
  const playTone = useCallback(
    (frequency: number, duration = 1000, gain = 0.15) => {
      const nodes = createOscillator({ frequency, gain });
      if (!nodes) return;

      const { oscillator } = nodes;
      oscillator.start();

      setTimeout(() => {
        stopOscillator();
      }, duration);
    },
    [createOscillator, stopOscillator]
  );

  // Play sequence of frequencies
  const playFrequencySequence = useCallback(
    (
      frequencies: number[],
      interval = 1000,
      gain = 0.15,
      onComplete?: () => void,
      onProgress?: (index: number) => void
    ) => {
      if (frequencies.length === 0) return;

      const audioContext = contextState.context || initializeAudioContext();
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      let currentIndex = 0;
      let isPlaying = true;

      setPlaybackState({ isPlaying: true, currentIndex: 0 });

      // Set initial frequency and gain
      oscillator.frequency.value = frequencies[0];
      gainNode.gain.value = gain;

      intervalRef.current = setInterval(() => {
        if (!oscillatorRef.current || !gainNodeRef.current) return;

        if (isPlaying) {
          // Fade out current tone
          gainNodeRef.current.gain.value = 0;
          isPlaying = false;
          onProgress?.(currentIndex);

          if (currentIndex === frequencies.length - 1) {
            // Sequence complete
            setPlaybackState({ isPlaying: false, currentIndex: 0 });
            onComplete?.();
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return;
          }
        } else {
          // Start next tone
          currentIndex++;
          oscillatorRef.current.frequency.value = frequencies[currentIndex];
          gainNodeRef.current.gain.value = gain;
          isPlaying = true;
          setPlaybackState({ isPlaying: true, currentIndex });
        }
      }, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        stopOscillator();
      };
    },
    [contextState.context, initializeAudioContext, stopOscillator]
  );

  // Get microphone stream
  const getMicrophoneStream = useCallback(async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (error) {
      console.error("Failed to get microphone access:", error);
      return null;
    }
  }, []);

  // Create analyser from stream
  const createAnalyserFromStream = useCallback(
    (stream: MediaStream) => {
      const audioContext = contextState.context || initializeAudioContext();
      if (!audioContext) return null;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      return analyser;
    },
    [contextState.context, initializeAudioContext]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopOscillator();
      if (contextState.context) {
        contextState.context.close();
      }
    };
  }, [stopOscillator, contextState.context]);

  return {
    // State
    audioContext: contextState.context,
    isAudioInitialized: contextState.isInitialized,
    playbackState,

    // Core functions
    initializeAudioContext,
    createOscillator,
    stopOscillator,

    // High-level functions
    playTone,
    playFrequencySequence,

    // Microphone functions
    getMicrophoneStream,
    createAnalyserFromStream,

    // Cleanup
    cleanup: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      stopOscillator();
    },
  };
};

export default useAudio;
