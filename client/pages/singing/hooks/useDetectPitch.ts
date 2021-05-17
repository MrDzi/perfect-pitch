import { useState, useEffect, useRef } from "react";
import { getNoteFrequency, Note, NOTES } from "../../../constants";
import { noteFromPitch, autoCorrelate, centsOffFromPitch, getVolume } from "../../../helpers";

interface ToneData {
  note: Note;
  detune: number;
  pitch?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createContextFromStream = (audioContext: AudioContext, stream: any) => {
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  const bufSize = 2048;
  analyser.fftSize = bufSize;

  source.connect(analyser);

  return analyser;
};

const getPointsWon = (targetNote: Note | null, note: Note | null, detune: number | null): number => {
  if (note && targetNote === note && detune) {
    return Math.abs(detune) > 100 ? 0 : 100 - Math.abs(detune);
  }
  return 0;
};

const getAverageToneData = (data: ToneData[]) => {
  const toneOccurrences: { [key: string]: number } = {};
  let mostFrequentNote = data[0].note;
  let maxCount = 1;
  let detuneSum = 0;
  data.forEach((d, index) => {
    if (index > 10) {
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
    detune: Math.ceil(detuneSum / (data.length - 10)),
  };
};

const useDetectPitch = (): [(targetNote: Note | null) => void, () => void, number | null, number | null, number] => {
  const [status, setStatus] = useState<{ started: boolean; targetNote: Note | null }>({
    started: false,
    targetNote: null,
  });
  const [detune, setDetune] = useState<number | null>(null);
  const [volume, setVolume] = useState(0);
  const [points, setPoints] = useState<number | null>(null);
  const ctx = useRef<AudioContext>(new AudioContext());
  const analyser = useRef<AnalyserNode | null>(null);
  const nonSilentFrameCount = useRef<number>(0);
  const tonesData = useRef<ToneData[]>([]);
  const requestRef = useRef<number | null>(null);

  const updatePitch = (audioContext: AudioContext, analyser: AnalyserNode, buf: Float32Array) => {
    const update = () => {
      if (!analyser || !audioContext) {
        return;
      }
      analyser.getFloatTimeDomainData(buf);
      const volume = getVolume(buf);
      if (volume < 0.015) {
        // not enough signal
        setVolume(0);
        if (detune !== null) {
          setDetune(null);
        }
      } else {
        setVolume(Math.min(volume * 5, 2));
        const pitch = autoCorrelate(buf, audioContext.sampleRate);
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
          setDetune(currentDetune);
          console.log("nonSilentFrame", nonSilentFrameCount.current);
          if (nonSilentFrameCount.current > 60 && requestRef.current) {
            setVolume(0);
            window.cancelAnimationFrame(requestRef.current);
            nonSilentFrameCount.current = 0;
            const averageToneData = getAverageToneData(tonesData.current);
            setStatus({
              started: false,
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

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      ctx.current = new AudioContext();
      analyser.current = createContextFromStream(ctx.current, stream);
    });
  }, []);

  useEffect(() => {
    if (!status.started) {
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
      return;
    }
    if (analyser.current) {
      const buf = new Float32Array(analyser.current.fftSize);
      updatePitch(ctx.current, analyser.current, buf);
    }

    return () => {
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [status.started]);

  const startPitchDetection = (targetNote: Note) => {
    setPoints(null);
    setStatus({
      started: true,
      targetNote,
    });
  };

  const stopPitchDetection = () => {
    setStatus({
      started: false,
      targetNote: null,
    });
  };

  return [startPitchDetection, stopPitchDetection, points, detune, volume];
};

export default useDetectPitch;
