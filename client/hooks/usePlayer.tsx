import { useState, useEffect, useRef } from "react";
import { NOTES, Note } from "../constants";
import scale from "../assets/tones/scale.mp3";
import useSound from "use-sound";

interface NoteData {
  notes: Note[];
  played: boolean;
}

const TONE_DURATION = 1403;

const getRandomNote = (notes: readonly Note[], skip: Note | null): Note => {
  const index = Math.floor(Math.random() * notes.length);
  if (skip && notes[index] === skip) {
    return getRandomNote(notes, skip);
  }
  return notes[index];
};

const getRandomNotes = (notes: readonly Note[], count = 1): Note[] => {
  const randomNotes: Note[] = [];

  for (let i = 0; i < count; i++) {
    randomNotes.push(getRandomNote(notes, randomNotes[i - 1]));
  }
  return randomNotes;
};

const usePlayer = (toneDuration = 1000): [NoteData, (n?: number) => void, () => void] => {
  const [noteData, setNoteData] = useState<NoteData>({
    notes: [],
    played: false,
  });
  const ctx = useRef<AudioContext>(new AudioContext());
  const [play] = useSound(scale, {
    sprite: {
      c: [0, TONE_DURATION],
      "c#": [TONE_DURATION, TONE_DURATION],
      d: [TONE_DURATION * 2, TONE_DURATION],
      "d#": [TONE_DURATION * 3, TONE_DURATION],
      e: [TONE_DURATION * 4, TONE_DURATION],
      f: [TONE_DURATION * 5, TONE_DURATION],
      "f#": [TONE_DURATION * 6, TONE_DURATION],
      g: [TONE_DURATION * 7, TONE_DURATION],
      "g#": [TONE_DURATION * 8, TONE_DURATION],
      a: [TONE_DURATION * 9, TONE_DURATION],
      "a#": [TONE_DURATION * 10, TONE_DURATION],
      b: [TONE_DURATION * 11, TONE_DURATION],
    },
  });

  useEffect(() => {
    if (!ctx.current || !noteData.notes.length || noteData.played) {
      return;
    }
    let currentIndex = 0;
    const note = noteData.notes[currentIndex].toLowerCase();
    play({ id: note });

    const interval = setInterval(() => {
      console.log(currentIndex, noteData.notes);
      if (currentIndex < noteData.notes.length - 1) {
        currentIndex++;
        const note = noteData.notes[currentIndex].toLowerCase();
        play({ id: note });
      } else {
        setNoteData({
          ...noteData,
          played: true,
        });
        clearInterval(interval);
      }
    }, toneDuration);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [noteData]);

  const playRandomNotes = (count = 1) => {
    const randomNotes = getRandomNotes(NOTES, count);
    setNoteData({
      notes: randomNotes,
      played: false,
    });
  };

  const repeatPlaying = () => {
    setNoteData({
      ...noteData,
      played: false,
    });
  };

  return [noteData, playRandomNotes, repeatPlaying];
};

export default usePlayer;
