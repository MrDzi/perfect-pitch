import { useState, useEffect, useRef, useCallback } from "react";
import { getNoteFrequency, Note, NOTES } from "../constants";
import { noteFromPitch, autoCorrelate, centsOffFromPitch, getVolume } from "../helpers";
import useAudio from "./useAudio";

interface ToneData {
  note: Note;
  detune: number;
  pitch?: number;
}

const getAverageSingingData = (data: ToneData[]): ToneData => {
  const toneOccurrences: { [key: string]: number } = {};
  let mostFrequentNote = data[0].note;
  let maxCount = 1;
  let detuneSum = 0;
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
      detuneSum += Math.abs(d.detune);
    }
  });
  return {
    note: mostFrequentNote,
    detune: Math.ceil(detuneSum / (data.length - 15)),
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
  const buf = useRef(new Float32Array(2048));

  const { getMicrophoneStream, createAnalyserFromStream, audioContext } = useAudio();

  useEffect(() => {
    const initializeMicrophone = async () => {
      const stream = await getMicrophoneStream();
      if (stream) {
        analyser.current = createAnalyserFromStream(stream);
      }
    };

    initializeMicrophone();
  }, [getMicrophoneStream, createAnalyserFromStream]);

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
      buf.current.fill(0);
      const update = () => {
        if (!analyser || !audioContext) {
          return;
        }
        analyser.getFloatTimeDomainData(buf.current);
        const volume = getVolume(buf.current);
        if (volume > 0.015) {
          const pitch = autoCorrelate(buf.current, audioContext.sampleRate);
          const noteNum = noteFromPitch(pitch);
          if (status.targetNote) {
            const targetNoteNum = noteFromPitch(getNoteFrequency(status.targetNote));
            const currentDetune = centsOffFromPitch(pitch, targetNoteNum);

            nonSilentFrameCount.current = nonSilentFrameCount.current + 1;
            tonesData.current.push({
              note: NOTES[noteNum % 12],
              detune: currentDetune,
              pitch,
            });
            if (nonSilentFrameCount.current % 10 === 0) {
              setDetune(currentDetune);
            }
            if (nonSilentFrameCount.current > 140 && requestRef.current) {
              setDetune(null);
              window.cancelAnimationFrame(requestRef.current);
              nonSilentFrameCount.current = 0;
              const averageSingingData = getAverageSingingData(tonesData.current);
              setStatus({
                inProgress: false,
                targetNote: null,
              });
              tonesData.current = [];
              if (status.targetNote) {
                setSingingData({
                  note: averageSingingData.note,
                  detune: averageSingingData.detune,
                });
              }
              return;
            }
          }
        }

        requestRef.current = requestAnimationFrame(update);
      };

      update();
    },
    [status.targetNote]
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

  return [startPitchDetection, stopPitchDetection, singingData, Math.floor(nonSilentFrameCount.current / 1.4), detune];
};

export default useDetectPitch;
