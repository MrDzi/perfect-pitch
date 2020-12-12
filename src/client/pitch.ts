import { useState, useEffect, useRef } from "react";

interface Data {
  pitch: number | null;
  note: string | null;
  detune: number | null;
}

export const useDetectPitch = (): [Data | null, () => void] => {
  const [pitchDetectStarted, setPitchDetectStarted] = useState(false);
  const [data, setData] = useState<Data | null>(null);
  const requestRef = useRef<number | null>(null);

  console.log("from useDetectPitch!!!");

  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let buf: Float32Array;
  let DEBUGCANVAS: HTMLCanvasElement | null = null;
  let waveCanvas: CanvasRenderingContext2D | null = null;

  const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gotStream = (stream: any) => {
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    const bufSize = 2048;
    analyser.fftSize = bufSize;
    buf = new Float32Array(analyser.fftSize);

    source.connect(analyser);
    updatePitch();
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
    console.log("from autoCorrelate");
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

  const updatePitch = () => {
    if (!analyser || !audioContext) {
      return;
    }
    analyser.getFloatTimeDomainData(buf);
    console.log("BUF", buf);
    const pitch = autoCorrelate(buf, audioContext.sampleRate);

    if (waveCanvas) {
      // This draws the current waveform, useful for debugging
      waveCanvas.clearRect(0, 0, 512, 256);
      waveCanvas.strokeStyle = "red";
      waveCanvas.beginPath();
      waveCanvas.moveTo(0, 0);
      waveCanvas.lineTo(0, 256);
      waveCanvas.moveTo(128, 0);
      waveCanvas.lineTo(128, 256);
      waveCanvas.moveTo(256, 0);
      waveCanvas.lineTo(256, 256);
      waveCanvas.moveTo(384, 0);
      waveCanvas.lineTo(384, 256);
      waveCanvas.moveTo(512, 0);
      waveCanvas.lineTo(512, 256);
      waveCanvas.stroke();
      waveCanvas.strokeStyle = "black";
      waveCanvas.beginPath();
      waveCanvas.moveTo(0, buf[0]);
      for (let i = 1; i < 512; i++) {
        waveCanvas.lineTo(i, 128 + buf[i] * 128);
      }
      waveCanvas.stroke();
    }

    if (pitch == -1) {
      console.log("ac == -1");
      setData({
        pitch: null,
        note: null,
        detune: null,
      });
    } else {
      console.log("pitch", Math.round(pitch));
      const noteFrequency = noteFromPitch(pitch);
      console.log("note", noteFromPitch(pitch), noteStrings[noteFrequency % 12]);
      const detune = centsOffFromPitch(pitch, noteFrequency);
      setData({
        pitch,
        note: noteStrings[noteFrequency % 12],
        detune,
      });
      if (detune == 0) {
        console.log("detune == 0");
      } else {
        console.log("detune", Math.abs(detune));
      }
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    requestRef.current = window.requestAnimationFrame(updatePitch);
  };

  useEffect(() => {
    if (!pitchDetectStarted) {
      if (requestRef.current) {
        console.log("useEffect stop");
        window.cancelAnimationFrame(requestRef.current);
      }
      return;
    }
    console.log("from useEffect");
    navigator.mediaDevices.getUserMedia({ audio: true }).then(gotStream);
    DEBUGCANVAS = document.getElementById("waveform") as HTMLCanvasElement;
    if (DEBUGCANVAS) {
      waveCanvas = DEBUGCANVAS.getContext("2d");
      if (waveCanvas) {
        waveCanvas.strokeStyle = "black";
        waveCanvas.lineWidth = 1;
      }
    }

    return () => {
      console.log("from useEffect return", requestRef.current);
      if (requestRef.current) {
        window.cancelAnimationFrame(requestRef.current);
      }
    };
  }, [pitchDetectStarted]);

  const togglePitchDetectStarted = () => {
    setPitchDetectStarted(!pitchDetectStarted);
  };

  return [data, togglePitchDetectStarted];
};
