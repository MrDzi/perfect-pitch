import { useState, useEffect, useRef } from "react";
import { getNoteFrequency, Note, NOTES } from "../constants";
import { noteFromPitch, autoCorrelate, centsOffFromPitch, getVolume } from "../helpers";

interface ToneData {
  note: Note;
  detune: number;
  pitch?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createContextFromStream = (audioContext: AudioContext, stream: any) => {
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  source.connect(analyser);

  return analyser;
};

const getPointsWon = (targetNote: Note | null, note: Note | null, detune: number | null): number => {
  if (note && targetNote === note && detune) {
    return Math.abs(detune) > 110 ? 0 : Math.min(110 - Math.abs(detune), 100);
  }
  return 0;
};

const getAverageToneData = (data: ToneData[]) => {
  const toneOccurrences: { [key: string]: number } = {};
  let mostFrequentNote = data[0].note;
  let maxCount = 1;
  let detuneSum = 0;
  data.forEach((d, index) => {
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

const useDetectPitch = (): [
  (targetNote: Note | null) => void,
  () => void,
  () => void,
  number | null,
  number | null,
  number
] => {
  const [status, setStatus] = useState<{ inProgress: boolean; targetNote: Note | null }>({
    inProgress: false,
    targetNote: null,
  });
  const [detune, setDetune] = useState<number | null>(null);
  const [points, setPoints] = useState<number | null>(null);
  const ctx = useRef<AudioContext>(new AudioContext());
  const analyser = useRef<AnalyserNode | null>(null);
  const nonSilentFrameCount = useRef<number>(0);
  const tonesData = useRef<ToneData[]>([]);
  const requestRef = useRef<number | null>(null);
  const buf = useRef(new Float32Array(2048));

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      console.log("CREATE AUDIO CONTEXT");
      ctx.current = new AudioContext();
      analyser.current = createContextFromStream(ctx.current, stream);
    });
  }, []);

  useEffect(() => {
    if (!status.inProgress && requestRef.current) {
      window.cancelAnimationFrame(requestRef.current);
      return;
    }
    if (analyser.current) {
      updatePitch(ctx.current, analyser.current);
    }

    return () => {
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [status.inProgress]);

  const updatePitch = (audioContext: AudioContext, analyser: AnalyserNode) => {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (status.targetNote) {
          const targetNoteNum = noteFromPitch(getNoteFrequency(status.targetNote));
          const currentDetune = centsOffFromPitch(pitch, targetNoteNum);

          nonSilentFrameCount.current = nonSilentFrameCount.current + 1;
          tonesData.current.push({
            note: NOTES[noteNum % 12],
            detune: currentDetune,
            pitch,
          });
          console.log("CURRENT D", currentDetune);
          if (nonSilentFrameCount.current % 10 === 0) {
            setDetune(currentDetune);
          }
          if (nonSilentFrameCount.current > 120 && requestRef.current) {
            console.log("#####");
            setDetune(null);
            window.cancelAnimationFrame(requestRef.current);
            nonSilentFrameCount.current = 0;
            const averageToneData = getAverageToneData(tonesData.current);
            setStatus({
              inProgress: false,
              targetNote: null,
            });
            tonesData.current = [];
            if (status.targetNote) {
              const pointsWon = getPointsWon(status.targetNote, averageToneData.note, averageToneData.detune);
              setPoints(pointsWon);
            }
            return;
          }
        }
      }

      requestRef.current = requestAnimationFrame(update);
    };

    update();
  };

  const startPitchDetection = (targetNote: Note) => {
    setPoints(null);
    setStatus({
      inProgress: true,
      targetNote,
    });
  };

  const stopPitchDetection = () => {
    setStatus({
      inProgress: false,
      targetNote: null,
    });
  };

  const reset = () => {
    setPoints(null);
  };

  console.log("DET", detune);

  return [
    startPitchDetection,
    stopPitchDetection,
    reset,
    points,
    detune,
    Math.floor(nonSilentFrameCount.current / 1.2),
  ];
};

export default useDetectPitch;
