import { useState, useEffect, useRef } from "react";
import { NOTES, getNoteFrequency, Note } from "../constants";

interface NoteData {
  note: Note | null;
  played: boolean;
}

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

const stopTonePlaying = (gainNode: GainNode, oscNode: OscillatorNode, currentTime: number | undefined = 0) => {
  gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.1);
  oscNode.stop(currentTime + 1);
};

const usePlayer = (): [NoteData, () => void, () => void] => {
  const [noteData, setNoteData] = useState<NoteData>({
    note: null,
    played: false,
  });
  const ctx = useRef<AudioContext>(new AudioContext());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let oscNode: OscillatorNode;
    let gainNode: GainNode;
    if (ctx.current && noteData.note !== null && !noteData.played) {
      oscNode = ctx.current.createOscillator();
      oscNode.frequency.value = getNoteFrequency(noteData.note);
      gainNode = ctx.current.createGain();
      oscNode.connect(gainNode);
      gainNode.connect(ctx.current.destination);

      gainNode.gain.value = 0.15;
      oscNode.start(ctx.current.currentTime);
      timeout = setTimeout(() => {
        stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
        setNoteData({
          note: noteData.note,
          played: true,
        });
      }, 1000);
    }

    return () => {
      if (timeout) {
        stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
        clearTimeout(timeout);
      }
    };
  }, [noteData]);

  const playRandomNote = () => {
    const randomNote = getRandomNote(NOTES, noteData.note);
    setNoteData({
      note: randomNote,
      played: false,
    });
  };

  const playLastNote = () => {
    setNoteData({
      note: noteData.note,
      played: false,
    });
  };

  return [noteData, playRandomNote, playLastNote];
};

export default usePlayer;
