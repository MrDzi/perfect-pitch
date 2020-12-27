import { useState, useEffect, useRef } from "react";
import { NOTES, getNoteFrequency, Note } from "./constants";

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

const usePlayer = (): [Note | null, () => void] => {
  const [note, setNote] = useState<Note | null>(null);
  const ctx = useRef<AudioContext>(new AudioContext());

  useEffect(() => {
    console.log("note!", note);
    let timeout: ReturnType<typeof setTimeout>;
    let oscNode: OscillatorNode;
    let gainNode: GainNode;
    if (ctx.current && note !== null) {
      oscNode = ctx.current.createOscillator();
      oscNode.frequency.value = getNoteFrequency(note);
      gainNode = ctx.current.createGain();
      oscNode.connect(gainNode);
      gainNode.connect(ctx.current.destination);

      gainNode.gain.value = 0.2;
      oscNode.start(ctx.current.currentTime);
      // gainNode.gain.exponentialRampToValueAtTime(0.2, ctx.current.currentTime + 0.5);
      timeout = setTimeout(() => {
        stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
      }, 1000);

      console.log("timeout: ", timeout);
    }

    return () => {
      console.log("clear timeout", timeout);
      if (timeout) {
        stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
        clearTimeout(timeout);
      }
    };
  }, [note]);

  const playRandomNote = () => {
    const randomNote = getRandomNote(NOTES, note);
    setNote(randomNote);
  };

  return [note, playRandomNote];
};

export default usePlayer;
