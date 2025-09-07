import { useState, useCallback } from "react";
import { NOTES, getNoteFrequency, Note } from "../constants";
import { TonesRelation } from "../types/types";
import useAudio from "./useAudio";

const getNoteFrequencies = (note: Note, relation: TonesRelation): [number, number] => {
  const frequency1 = getNoteFrequency(note);
  let frequency2;
  switch (relation) {
    case TonesRelation.FirstHigher:
      frequency2 = frequency1 - Math.ceil(Math.max(2, Math.random() * 5));
      break;
    case TonesRelation.SecondHigher:
      frequency2 = frequency1 + Math.ceil(Math.max(2, Math.random() * 5));
      break;
    default:
      frequency2 = frequency1;
  }
  return [frequency1, frequency2];
};

const getRandomNote = (notes: readonly Note[], skipNote: Note | null): Note => {
  const getNote = (): Note => {
    const index = Math.floor(Math.random() * notes.length);
    if (skipNote && notes[index] === skipNote) {
      return getNote();
    }
    return notes[index];
  };
  return getNote();
};

const getRandomRelation = () => Math.floor(Math.random() * 3);

const useListeningPlayer = (): [() => void, () => void, boolean, TonesRelation | null, () => void] => {
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [tonesRelation, setTonesRelation] = useState<TonesRelation | null>(null);
  const [tonesPlayingFinished, setTonesPlayingFinished] = useState<boolean>(false);

  const { playFrequencySequence, initializeAudioContext } = useAudio();

  const initiateAudioContext = useCallback(() => {
    initializeAudioContext();
  }, [initializeAudioContext]);

  const playTones = useCallback(() => {
    const newRandomNote = getRandomNote(NOTES, randomNote);
    const randomRelation = getRandomRelation();
    setRandomNote(newRandomNote);
    setTonesRelation(randomRelation);
    setTonesPlayingFinished(false);

    // Play the tones after state is set
    setTimeout(() => {
      const frequencies = getNoteFrequencies(newRandomNote, randomRelation);
      playFrequencySequence(frequencies, 1000, 0.15, () => setTonesPlayingFinished(true));
    }, 0);
  }, [randomNote, playFrequencySequence]);

  const repeatTones = useCallback(() => {
    if (randomNote && tonesRelation !== null) {
      setTonesPlayingFinished(false);
      const frequencies = getNoteFrequencies(randomNote, tonesRelation);
      playFrequencySequence(frequencies, 1000, 0.15, () => setTonesPlayingFinished(true));
    }
  }, [randomNote, tonesRelation, playFrequencySequence]);

  return [playTones, repeatTones, tonesPlayingFinished, tonesRelation, initiateAudioContext];
};

export default useListeningPlayer;
