export const noteFromPitch = (frequency: number): number => {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
};

export const frequencyFromNoteNumber = (note: number): number => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

export const centsOffFromPitch = (frequency: number, noteNumber: number): number => {
  let min: number | null = null;
  const noteNumbers = [noteNumber - 24, noteNumber - 12, noteNumber, noteNumber + 12, noteNumber + 24];
  noteNumbers.forEach((num) => {
    const detune = Math.floor((1200 * Math.log(frequency / frequencyFromNoteNumber(num))) / Math.log(2));
    if (min === null || Math.abs(min) > Math.abs(detune)) {
      min = detune;
    }
  });
  return min === null ? 0 : min;
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
