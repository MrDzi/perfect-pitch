import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Note, NOTES } from "./constants";

interface ToneData {
  pitch: number;
  note: Note;
  detune: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createContextFromStream = (stream: any) => {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  const bufSize = 2048;
  analyser.fftSize = bufSize;

  source.connect(analyser);

  return {
    audioContext,
    analyser,
  };
};

const noteFromPitch = (frequency: number): number => {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
};

const frequencyFromNoteNumber = (note: number) => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

const centsOffFromPitch = (frequency: number, note: number) => {
  return Math.floor((1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2));
};

const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
  // console.log("from autoCorrelate");
  let SIZE = buf.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    rms += buf[i] * buf[i];
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) {
    // not enough signal
    return -1;
  }

  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }
  }

  buf = buf.slice(r1, r2);
  SIZE = buf.length;

  const c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] = c[i] + buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) {
    d++;
  }
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;

  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate / T0;
};

const getPointsWon = (targetNote: Note | null, data: ToneData): number => {
  if (targetNote === data.note) {
    return data.detune > 25 ? 50 : 100;
  }
  return 0;
};

const getAverageToneData = (data: ToneData[]) => {
  const toneOccurences: { [key: string]: number } = {};
  let mostFrequentTone = data[0].note;
  let maxCount = 1;
  let detuneSum = 0;
  let pitchSum = 0;
  data.forEach((d) => {
    if (!toneOccurences[d.note]) {
      toneOccurences[d.note] = 1;
    } else {
      toneOccurences[d.note] = toneOccurences[d.note] + 1;
    }
    if (toneOccurences[d.note] > maxCount) {
      maxCount = toneOccurences[d.note];
      mostFrequentTone = d.note;
    }
    detuneSum += Math.abs(d.detune);
    pitchSum += d.pitch;
  });
  return {
    note: mostFrequentTone,
    detune: Math.floor(detuneSum / data.length),
    pitch: Math.floor(pitchSum / data.length),
  };
};

const useDetectPitch = (): [number | null, Dispatch<SetStateAction<Note>>, number[]] => {
  const [targetNote, setTargetNote] = useState<Note | null>(null);
  const [finalData, setFinalData] = useState<number | null>(null);
  const [points, setPoints] = useState<number[]>([]);
  const silentFrameCount = useRef<number>(0);
  const nonSilentFrameCount = useRef<number>(0);
  const tonesData = useRef<ToneData[]>([]);
  const requestRef = useRef<number | null>(null);

  console.log("from useDetectPitch!!!");

  const updatePitch = (audioContext: AudioContext, analyser: AnalyserNode, buf: Float32Array) => {
    const update = () => {
      // console.log(0, requestRef.current);
      if (!analyser || !audioContext) {
        return;
      }
      analyser.getFloatTimeDomainData(buf);
      // console.log("BUF", buf);
      const pitch = autoCorrelate(buf, audioContext.sampleRate);

      if (pitch === -1) {
        console.log("pitch -1", silentFrameCount.current);
        silentFrameCount.current = silentFrameCount.current + 1;
        if (silentFrameCount.current > 90 && nonSilentFrameCount.current > 60 && requestRef.current) {
          console.log("cancel!!!", requestRef.current);
          window.cancelAnimationFrame(requestRef.current);
          silentFrameCount.current = 0;
          // const f = tonesData.current.reduce((acc, data) => {
          //   return acc + data.pitch;
          // }, 0);
          // setFinalData(f / tonesData.current.length);
          // console.log("setFinalData", f / tonesData.current.length, tonesData.current);

          console.log("end", length);
          // const lastTonesData = tonesData.current.slice(length - 60);
          const averageToneData = getAverageToneData(tonesData.current);
          console.log("AVERAGE: ", averageToneData);
          const pointsWon = getPointsWon(targetNote, averageToneData);
          setPoints((currentPoints) => [...currentPoints, pointsWon]);
          return;
        }
      } else {
        console.log("pitch NOT -1");
        // console.log("pitch", Math.round(pitch));
        const noteNum = noteFromPitch(pitch);
        // console.log("note", noteFromPitch(pitch), NOTES[noteNum % 12]);
        const detune = centsOffFromPitch(pitch, noteNum);
        // console.log("detune", Math.abs(detune));
        silentFrameCount.current = 0;
        nonSilentFrameCount.current = nonSilentFrameCount.current + 1;
        console.log("non silent", nonSilentFrameCount.current);
        tonesData.current.push({
          pitch,
          note: NOTES[noteNum % 12],
          detune,
        });
      }

      requestRef.current = requestAnimationFrame(update);
    };

    update();
  };

  useEffect(() => {
    if (!targetNote) {
      if (requestRef.current) {
        console.log("useEffect stop");
        window.cancelAnimationFrame(requestRef.current);
      }
      return;
    }
    console.log("from useEffect");
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const { audioContext, analyser } = createContextFromStream(stream);
      const buf = new Float32Array(analyser.fftSize);
      updatePitch(audioContext, analyser, buf);
    });

    return () => {
      console.log("from useEffect return", requestRef.current);
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetNote]);

  return [finalData, setTargetNote, points];
};

export default useDetectPitch;
