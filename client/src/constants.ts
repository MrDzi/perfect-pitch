export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export type Note = typeof NOTES[number];

export type NoteFrequencies = {
  [key in Note]: number[];
};

/* eslint-disable prettier/prettier */
const NOTE_FREQUENCIES: NoteFrequencies = {
  "C": [261.63, 523.25],
  "C#": [277.18, 554.37],
  "D": [293.66, 587.33],
  "D#": [311.13, 622.25],
  "E": [329.63, 659.26],
  "F": [349.23, 698.46],
  "F#": [369.99, 739.99],
  "G": [392, 783.99],
  "G#": [415.3, 830.61],
  "A": [440, 880],
  "A#": [466.16, 932.33],
  "B": [493.88, 987.77],
};

export const getNoteFrequency = (note: Note): number => NOTE_FREQUENCIES[note][0];
