import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getNoteFrequency, Note, NOTES } from "../constants";
import { noteFromPitch, centsOffFromPitch, getDeviceOptimizedConfig } from "../helpers";
import useAudio from "./useAudio";
import usePitchDetectionWorker from "./usePitchDetectionWorker";

interface ToneData {
  note: Note;
  detune: number;
  pitch?: number;
  missType?: "low" | "high";
}

const getAverageSingingData = (data: ToneData[]): ToneData => {
  const toneOccurrences: { [key: string]: number } = {};
  let mostFrequentNote = data[0].note;
  let maxCount = 1;
  let detuneSum = 0;
  let lowCount = 0;
  let highCount = 0;
  data.forEach((d, index) => {
    // Discard the beginning of the input
    if (index > 15) {
      if (!toneOccurrences[d.note]) {
        toneOccurrences[d.note] = 1;
      } else {
        toneOccurrences[d.note] = toneOccurrences[d.note] + 1;
      }
      if (toneOccurrences[d.note] > maxCount) {
        maxCount = toneOccurrences[d.note];
        mostFrequentNote = d.note;
      }
      if (d.detune < 0) {
        lowCount++;
      } else {
        highCount++;
      }
      detuneSum += Math.abs(d.detune);
    }
  });

  return {
    note: mostFrequentNote,
    detune: Math.ceil(detuneSum / (data.length - 15)),
    missType: lowCount > highCount ? "low" : "high",
  };
};

const useDetectPitch = (): [(targetNote: Note | null) => void, () => void, ToneData | null, number, number | null] => {
  const [status, setStatus] = useState<{ inProgress: boolean; targetNote: Note | null }>({
    inProgress: false,
    targetNote: null,
  });
  const [detune, setDetune] = useState<number | null>(null);
  const [singingData, setSingingData] = useState<ToneData | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const nonSilentFrameCount = useRef<number>(0);
  const tonesData = useRef<ToneData[]>([]);
  const requestRef = useRef<number | null>(null);

  // Get device-optimized configuration
  const config = useMemo(() => getDeviceOptimizedConfig(), []);
  const buf = useRef(new Float32Array(config.bufferSize));

  const { getMicrophoneStream, createAnalyserFromStream, audioContext } = useAudio();
  const { detectPitch: detectPitchWithWorker, isWorkerSupported } = usePitchDetectionWorker();

  console.log("isWorkerSupported", isWorkerSupported);

  // Memoize target note calculations to avoid repeated expensive operations
  const targetNoteData = useMemo(() => {
    if (!status.targetNote) return null;
    return {
      frequency: getNoteFrequency(status.targetNote),
      noteNum: noteFromPitch(getNoteFrequency(status.targetNote)),
    };
  }, [status.targetNote]);

  useEffect(() => {
    const initializeMicrophone = async () => {
      const stream = await getMicrophoneStream();
      if (stream) {
        analyser.current = createAnalyserFromStream(stream);
        // Apply mobile-optimized settings to analyser
        if (analyser.current) {
          analyser.current.fftSize = config.fftSize;
          analyser.current.smoothingTimeConstant = config.smoothingTimeConstant;
        }
      }
    };

    initializeMicrophone();
  }, [getMicrophoneStream, createAnalyserFromStream, config]);

  useEffect(() => {
    if (!status.inProgress && requestRef.current) {
      window.cancelAnimationFrame(requestRef.current);
      return;
    }
    if (analyser.current && audioContext) {
      updatePitch(audioContext, analyser.current);
    }

    return () => {
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [status.inProgress, audioContext]);

  const updatePitch = useCallback(
    (audioContext: AudioContext, analyser: AnalyserNode) => {
      // Use memoized target note data for better performance
      if (!targetNoteData) return;

      const minPitch = 80;
      const maxPitch = 2000;

      buf.current.fill(0);

      const update = () => {
        if (!analyser || !audioContext || !targetNoteData) {
          return;
        }

        analyser.getFloatTimeDomainData(buf.current);

        // Use Web Worker for pitch detection if supported, otherwise fallback to main thread
        if (isWorkerSupported) {
          const workerConfig = {
            bufferSize: config.bufferSize,
            volumeThreshold: config.volumeThreshold,
            minPitch,
            maxPitch,
          };

          detectPitchWithWorker(buf.current, audioContext.sampleRate, workerConfig, (result) => {
            if (!status.targetNote || !targetNoteData) return;

            if (result.isValid && result.pitch) {
              const noteNum = noteFromPitch(result.pitch);
              const currentDetune = centsOffFromPitch(result.pitch, targetNoteData.noteNum);

              nonSilentFrameCount.current++;
              tonesData.current.push({
                note: NOTES[noteNum % 12],
                detune: currentDetune,
                pitch: result.pitch,
              });

              // Update UI less frequently to reduce render overhead (mobile-optimized)
              if (nonSilentFrameCount.current % config.updateInterval === 0) {
                setDetune(currentDetune);
              }

              // Check for completion (mobile-optimized shorter duration)
              if (nonSilentFrameCount.current > config.maxFrames && requestRef.current) {
                setDetune(null);
                window.cancelAnimationFrame(requestRef.current);
                nonSilentFrameCount.current = 0;

                const averageSingingData = getAverageSingingData(tonesData.current);
                setStatus({
                  inProgress: false,
                  targetNote: null,
                });
                tonesData.current = [];

                setSingingData({
                  note: averageSingingData.note,
                  detune: averageSingingData.detune,
                  missType: averageSingingData.missType,
                });
                return;
              }
            }

            if (status.inProgress) {
              requestRef.current = requestAnimationFrame(update);
            }
          });
        } else {
          // Fallback to main thread processing if Web Workers are not supported
          // Import functions dynamically to avoid including them when using workers
          import("../helpers").then(({ getVolume, autoCorrelate }) => {
            const volume = getVolume(buf.current);

            if (volume > config.volumeThreshold && status.targetNote) {
              const pitch = autoCorrelate(buf.current, audioContext.sampleRate);

              // Skip invalid pitch values early to avoid unnecessary calculations
              if (pitch < minPitch || pitch > maxPitch || isNaN(pitch)) {
                requestRef.current = requestAnimationFrame(update);
                return;
              }

              const noteNum = noteFromPitch(pitch);
              const currentDetune = centsOffFromPitch(pitch, targetNoteData.noteNum);

              nonSilentFrameCount.current++;
              tonesData.current.push({
                note: NOTES[noteNum % 12],
                detune: currentDetune,
                pitch,
              });

              // Update UI less frequently to reduce render overhead (mobile-optimized)
              if (nonSilentFrameCount.current % config.updateInterval === 0) {
                setDetune(currentDetune);
              }

              // Check for completion (mobile-optimized shorter duration)
              if (nonSilentFrameCount.current > config.maxFrames && requestRef.current) {
                setDetune(null);
                window.cancelAnimationFrame(requestRef.current);
                nonSilentFrameCount.current = 0;

                const averageSingingData = getAverageSingingData(tonesData.current);
                setStatus({
                  inProgress: false,
                  targetNote: null,
                });
                tonesData.current = [];

                setSingingData({
                  note: averageSingingData.note,
                  detune: averageSingingData.detune,
                  missType: averageSingingData.missType,
                });
                return;
              }
            }

            requestRef.current = requestAnimationFrame(update);
          });
        }
      };

      update();
    },
    [targetNoteData, status.targetNote, config, isWorkerSupported, detectPitchWithWorker]
  );

  const startPitchDetection = useCallback((targetNote: Note) => {
    setSingingData(null);
    setStatus({
      inProgress: true,
      targetNote,
    });
  }, []);

  const stopPitchDetection = useCallback(() => {
    setStatus({
      inProgress: false,
      targetNote: null,
    });
  }, []);

  return [
    startPitchDetection,
    stopPitchDetection,
    singingData,
    Math.floor(nonSilentFrameCount.current / (config.maxFrames / 100)),
    detune,
  ];
};

export default useDetectPitch;
