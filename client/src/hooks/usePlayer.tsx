import { useState, useEffect } from "react";
import { NOTES, Note } from "../constants";
import { getRandomNotes } from "../helpers";
import scale from "../assets/tones/scale.mp3";
import useSound from "use-sound";

interface NoteData {
  notes: Note[];
  played: boolean;
}

const TONE_DURATION = 1403;

const usePlayer = (toneDuration = 1000): [NoteData, (notes?: Note[], n?: number) => void, () => void] => {
  const [noteData, setNoteData] = useState<NoteData>({
    notes: [],
    played: false,
  });
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
    if (!noteData.notes.length || noteData.played) {
      return;
    }
    let currentIndex = 0;
    const note = noteData.notes[currentIndex].toLowerCase();
    play({ id: note });

    const interval = setInterval(() => {
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

  const playNotes = (notes?: Note[], count = 1) => {
    setNoteData({
      notes: notes || getRandomNotes(NOTES, count),
      played: false,
    });
  };

  const repeatNote = () => {
    setNoteData({
      ...noteData,
      played: false,
    });
  };

  return [noteData, playNotes, repeatNote];
};

export default usePlayer;
