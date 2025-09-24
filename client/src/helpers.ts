import { Note } from "./constants";

// Cache for frequently used calculations
const frequencyCache = new Map<number, number>();
const noteFromPitchCache = new Map<number, number>();

export const noteFromPitch = (frequency: number): number => {
  // Round frequency to avoid cache misses for very similar values
  const roundedFreq = Math.round(frequency * 10) / 10;

  if (noteFromPitchCache.has(roundedFreq)) {
    return noteFromPitchCache.get(roundedFreq) || 0;
  }

  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  const result = Math.round(noteNum) + 69;

  // Limit cache size to prevent memory leaks
  if (noteFromPitchCache.size < 1000) {
    noteFromPitchCache.set(roundedFreq, result);
  }

  return result;
};

export const frequencyFromNoteNumber = (note: number): number => {
  if (frequencyCache.has(note)) {
    return frequencyCache.get(note) || 0;
  }

  const frequency = 440 * Math.pow(2, (note - 69) / 12);

  // Cache common note numbers
  if (note >= 0 && note <= 127) {
    frequencyCache.set(note, frequency);
  }

  return frequency;
};

// Cache for cents calculations
const centsCache = new Map<string, number>();

export const centsOffFromPitch = (frequency: number, noteNumber: number): number => {
  // Create cache key with rounded values
  const roundedFreq = Math.round(frequency * 10) / 10;
  const cacheKey = `${roundedFreq}-${noteNumber}`;

  if (centsCache.has(cacheKey)) {
    return centsCache.get(cacheKey) || 0;
  }

  let min: number | null = null;
  const noteNumbers = [noteNumber - 24, noteNumber - 12, noteNumber, noteNumber + 12, noteNumber + 24];

  for (const num of noteNumbers) {
    const detune = Math.floor((1200 * Math.log(frequency / frequencyFromNoteNumber(num))) / Math.log(2));
    if (min === null || Math.abs(min) > Math.abs(detune)) {
      min = detune;
    }
  }

  const result = min === null ? 0 : min;

  // Limit cache size
  if (centsCache.size < 1000) {
    centsCache.set(cacheKey, result);
  }

  return result;
};

export const getVolume = (buf: Float32Array): number => {
  const SIZE = buf.length;
  let rms = 0;

  for (let i = 0; i < SIZE; i++) {
    rms += Math.pow(buf[i], 2);
  }
  return Math.sqrt(rms / SIZE);
};

// Logic taken from: https://github.com/cwilso/PitchDetect/blob/4190bc705747fbb3f82eb465ea18a2dfb5873080/js/pitchdetect.js
export const autoCorrelate = (buf: Float32Array, sampleRate: number): number => {
  let SIZE = buf.length;

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

const getRandomNote = (notes: readonly Note[], skip: Note | null): Note => {
  const index = Math.floor(Math.random() * notes.length);
  if (skip && notes[index] === skip) {
    return getRandomNote(notes, skip);
  }
  return notes[index];
};

export const getRandomNotes = (notes: readonly Note[], count = 1): Note[] => {
  const randomNotes: Note[] = [];

  for (let i = 0; i < count; i++) {
    randomNotes.push(getRandomNote(notes, randomNotes[i - 1]));
  }
  return randomNotes;
};

// Mobile device detection utility
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Performance configuration based on device type
export const getDeviceOptimizedConfig = () => {
  const isMobile = isMobileDevice();

  return {
    // Audio processing configuration
    bufferSize: isMobile ? 1024 : 2048,
    volumeThreshold: isMobile ? 0.012 : 0.015, // Lower threshold for mobile
    updateInterval: isMobile ? 15 : 10, // More frequent UI updates on mobile
    maxFrames: isMobile ? 100 : 170, // Shorter analysis period on mobile

    // Audio context configuration
    fftSize: isMobile ? 1024 : 2048,
    smoothingTimeConstant: isMobile ? 0.85 : 0.8, // Less smoothing for more responsiveness
  };
};
