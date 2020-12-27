import { useState, useEffect, useRef } from "react";
import { getNoteFrequency, Note, NOTES } from "./constants";
import { noteFromPitch, autoCorrelate, centsOffFromPitch } from "./helpers";

interface ToneData {
  note: Note;
  detune: number;
  pitch?: number;
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

const getPointsWon = (targetNote: Note | null, note: Note | null, detune: number | null): number => {
  if (note && targetNote === note && detune) {
    return detune > 25 ? 50 : 100;
  }
  return 0;
};

const getAverageToneData = (data: ToneData[]) => {
  const toneOccurences: { [key: string]: number } = {};
  let mostFrequentNote = data[0].note;
  let maxCount = 1;
  let detuneSum = 0;
  data.forEach((d, index) => {
    if (index > 10) {
      if (!toneOccurences[d.note]) {
        toneOccurences[d.note] = 1;
      } else {
        toneOccurences[d.note] = toneOccurences[d.note] + 1;
      }
      if (toneOccurences[d.note] > maxCount) {
        maxCount = toneOccurences[d.note];
        mostFrequentNote = d.note;
      }
      detuneSum += d.detune;
    }
  });
  return {
    note: mostFrequentNote,
    detune: detuneSum / data.length,
  };
};

const useDetectPitch = (): [(targetNote: Note | null) => void, Note | null, number] => {
  const [status, setStatus] = useState<{ started: boolean; targetNote: Note | null }>({
    started: false,
    targetNote: null,
  });
  const [finalNote, setFinalNote] = useState<Note | null>(null);
  const [points, setPoints] = useState<number>(0);
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
        if (silentFrameCount.current > 60 && nonSilentFrameCount.current > 60 && requestRef.current) {
          console.log("cancel!!!", requestRef.current);
          window.cancelAnimationFrame(requestRef.current);
          silentFrameCount.current = 0;
          const averageToneData = getAverageToneData(tonesData.current);
          console.log("AVERAGE: ", averageToneData, status.targetNote, tonesData.current);
          setFinalNote(averageToneData.note);
          setStatus({
            started: false,
            targetNote: null,
          });
          if (status.targetNote) {
            const pointsWon = getPointsWon(status.targetNote, averageToneData.note, averageToneData.detune);
            setPoints(pointsWon);
          }
          return;
        }
      } else {
        console.log("pitch NOT -1");
        // console.log("pitch", Math.round(pitch));
        const noteNum = noteFromPitch(pitch);
        const targetNoteNum = noteFromPitch(getNoteFrequency(status.targetNote!));
        // console.log("note", noteFromPitch(pitch), NOTES[noteNum % 12]);
        const detune = centsOffFromPitch(pitch, targetNoteNum);
        // console.log("detune", Math.abs(detune));
        silentFrameCount.current = 0;
        nonSilentFrameCount.current = nonSilentFrameCount.current + 1;
        console.log("non silent", nonSilentFrameCount.current);
        tonesData.current.push({
          note: NOTES[noteNum % 12],
          detune,
          pitch,
        });
      }

      requestRef.current = requestAnimationFrame(update);
    };

    update();
  };

  useEffect(() => {
    if (!status.started) {
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
  }, [status.started]);

  const startPitchDetection = (targetNote: Note | null) => {
    setPoints(0);
    setStatus({
      started: true,
      targetNote,
    });
  };

  return [startPitchDetection, finalNote, points];
};

export default useDetectPitch;
