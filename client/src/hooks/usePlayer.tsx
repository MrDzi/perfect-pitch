import { useState, useEffect } from "react";
import useSound from "use-sound";
import { NOTES, Note } from "../constants";
import { getRandomNotes } from "../helpers";
import scale from "../assets/tones/scale.mp3";

const TONE_DURATION = 1403;

const usePlayer = (toneDuration = 1000): [(notes?: Note[], n?: number) => void, () => void, boolean, Note[]] => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [playingFinished, setPlayingFinished] = useState<boolean>(false);
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
    if (!notes.length || playingFinished) {
      return;
    }
    let currentIndex = 0;
    const note = notes[currentIndex].toLowerCase();
    play({ id: note });

    const interval = setInterval(() => {
      if (currentIndex < notes.length - 1) {
        currentIndex++;
        const note = notes[currentIndex].toLowerCase();
        play({ id: note });
      } else {
        setPlayingFinished(true);
        clearInterval(interval);
      }
    }, toneDuration);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [notes, playingFinished]);

  const playNotes = (notesFromParam?: Note[], count = 1) => {
    setNotes(notesFromParam || getRandomNotes(NOTES, count));
    setPlayingFinished(false);
  };

  const repeatNotes = () => {
    setPlayingFinished(false);
  };

  return [playNotes, repeatNotes, playingFinished, notes];
};

export default usePlayer;
