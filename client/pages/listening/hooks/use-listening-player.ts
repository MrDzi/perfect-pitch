import { useState, useEffect, useRef } from "react";
import { NOTES, getNoteFrequency, Note } from "../../../constants";

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
      frequency2 = frequency1 - Math.floor(Math.random() * 10);
      break;
    case TonesRelation.SecondHigher:
      frequency2 = frequency1 + Math.floor(Math.random() * 10);
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

  useEffect(() => {
    if (!ctx.current || noteData.note === null || noteData.relation === null || noteData.played) {
      return;
    }
    const oscNode: OscillatorNode = ctx.current.createOscillator();
    const [frequency1, frequency2] = getNoteFrequencies(noteData);
    oscNode.frequency.value = frequency1;
    const gainNode: GainNode = ctx.current.createGain();
    oscNode.connect(gainNode);
    gainNode.connect(ctx.current.destination);

    gainNode.gain.value = 0.15;
    oscNode.start(ctx.current.currentTime);
    let timeout2: ReturnType<typeof setTimeout>, timeout3: ReturnType<typeof setTimeout>;
    const timeout = setTimeout(() => {
      gainNode.gain.value = 0;
      timeout2 = setTimeout(() => {
        oscNode.frequency.value = frequency2;
        gainNode.gain.value = 0.15;
        timeout3 = setTimeout(() => {
          stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
          setNoteData((nd) => ({
            note: nd.note,
            relation: nd.relation,
            played: true,
          }));
          console.log(noteData.relation);
        }, 1000);
      }, 500);
    }, 1000);

    return () => {
      const t = timeout || timeout2 || timeout3;
      if (t) {
        stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
        clearTimeout(t); // clear other timeouts!
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
    setNoteData((nd) => ({
      note: nd.note,
      relation: nd.relation,
      played: false,
    }));
  };

  return [noteData, playTwoNotes, playLastNote];
};

export default useListeningPlayer;
