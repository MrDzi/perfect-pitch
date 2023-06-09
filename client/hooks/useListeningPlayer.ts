import { useState, useEffect, useRef } from "react";
import { NOTES, getNoteFrequency, Note } from "../constants";

interface NoteData {
  note: Note | null;
  relation: TonesRelation | null;
  played: boolean;
}

enum TonesRelation {
  FirstHigher,
  SecondHigher,
  Identical,
}

const getNoteFrequencies = (noteData: NoteData): [number, number] => {
  const frequency1 = getNoteFrequency(noteData.note as Note);
  let frequency2;
  switch (noteData.relation) {
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

const getRandomNote = (notes: readonly Note[], skip: Note | null): Note => {
  const getNote = (): Note => {
    const index = Math.floor(Math.random() * notes.length);
    if (skip && notes[index] === skip) {
      return getNote();
    }
    return notes[index];
  };
  return getNote();
};

const getRandomRelation = () => Math.floor(Math.random() * 3);

const stopTonePlaying = (gainNode: GainNode, oscNode: OscillatorNode, currentTime: number | undefined = 0) => {
  gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.1);
  oscNode.stop(currentTime + 1);
};

const useListeningPlayer = (): [NoteData, () => void, () => void] => {
  const [noteData, setNoteData] = useState<NoteData>({
    note: null,
    relation: null,
    played: false,
  });
  const ctx = useRef<AudioContext>(new AudioContext());
  const oscNode = useRef<OscillatorNode>(ctx.current.createOscillator());
  const gainNode = useRef<GainNode>(ctx.current.createGain());

  useEffect(() => {
    oscNode.current.connect(gainNode.current);
    gainNode.current.connect(ctx.current.destination);

    gainNode.current.gain.value = 0;
    oscNode.current.start(ctx.current.currentTime);

    return () => {
      stopTonePlaying(gainNode.current, oscNode.current, ctx.current?.currentTime);
    };
  }, []);

  useEffect(() => {
    if (!ctx.current || noteData.note === null || noteData.relation === null || noteData.played) {
      return;
    }

    const playNotes = (frequencies: number[], callback: () => void, timeout = 1000) => {
      oscNode.current.frequency.value = frequencies[0];

      gainNode.current.gain.value = 0.15;

      let currentIndex = 0;
      let isPlaying = true;

      const interval = setInterval(() => {
        if (isPlaying) {
          gainNode.current.gain.value = 0;
          isPlaying = false;
          if (currentIndex === frequencies.length - 1) {
            callback();
          }
          return;
        }
        currentIndex++;
        oscNode.current.frequency.value = frequencies[currentIndex];
        gainNode.current.gain.value = 0.15;
        isPlaying = true;
      }, timeout);

      return interval;
    };

    const frequencies = getNoteFrequencies(noteData);
    const callback = () => {
      setNoteData((noteData) => ({
        ...noteData,
        played: true,
      }));
    };
    const interval = playNotes(frequencies, callback);

    return () => {
      if (interval) {
        gainNode.current.gain.value = 0;
        clearTimeout(interval);
      }
    };
  }, [noteData]);

  const playTwoNotes = () => {
    const randomNote = getRandomNote(NOTES, noteData.note);
    const randomRelation = getRandomRelation();
    setNoteData({
      note: randomNote,
      relation: randomRelation,
      played: false,
    });
  };

  const playLastNote = () => {
    setNoteData((noteData) => ({
      ...noteData,
      played: false,
    }));
  };

  return [noteData, playTwoNotes, playLastNote];
};

export default useListeningPlayer;
