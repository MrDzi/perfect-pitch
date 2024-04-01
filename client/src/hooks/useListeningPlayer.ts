import { useState, useEffect, useRef } from "react";
import { NOTES, getNoteFrequency, Note } from "../constants";
import { TonesRelation } from "../types/types";

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

const stopTonePlaying = (gainNode: GainNode, oscNode: OscillatorNode, currentTime: number | undefined = 0) => {
  gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.1);
  oscNode.stop(currentTime + 1);
};

const useListeningPlayer = (): [() => void, () => void, TonesRelation | null, boolean, () => void] => {
  const [randomNote, setRandomNote] = useState<Note | null>(null);
  const [tonesRelation, setTonesRelation] = useState<TonesRelation | null>(null);
  const [tonesPlayed, setTonesPlayed] = useState<boolean>(false);
  const ctx = useRef<AudioContext | null>(null);
  const oscNode = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      if (gainNode.current && oscNode.current) {
        stopTonePlaying(gainNode.current, oscNode.current, ctx.current?.currentTime);
      }
    };
  }, []);

  useEffect(() => {
    if (!ctx.current || randomNote === null || tonesRelation === null || tonesPlayed) {
      return;
    }

    const playTones = (frequencies: number[], callback: () => void, timeout = 1000) => {
      if (!oscNode.current || !gainNode.current) {
        return;
      }
      oscNode.current.frequency.value = frequencies[0];
      gainNode.current.gain.value = 0.15;

      let currentIndex = 0;
      let isPlaying = true;

      const interval = setInterval(() => {
        if (!oscNode.current || !gainNode.current) {
          return;
        }
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

    const frequencies = getNoteFrequencies(randomNote, tonesRelation);
    const interval = playTones(frequencies, () => {
      setTonesPlayed(true);
    });

    return () => {
      if (interval && gainNode.current) {
        gainNode.current.gain.value = 0;
        clearTimeout(interval);
      }
    };
  }, [randomNote, tonesRelation, tonesPlayed]);

  const initiateAudioContext = () => {
    ctx.current = new AudioContext();
    oscNode.current = ctx.current.createOscillator();
    gainNode.current = ctx.current.createGain();

    oscNode.current.connect(gainNode.current);
    gainNode.current.connect(ctx.current.destination);

    gainNode.current.gain.value = 0;
    oscNode.current.start(ctx.current.currentTime);
  };

  const playTones = () => {
    const newRandomNote = getRandomNote(NOTES, randomNote);
    const randomRelation = getRandomRelation();
    setRandomNote(newRandomNote);
    setTonesRelation(randomRelation);
    setTonesPlayed(false);
  };

  const repeatTones = () => {
    setTonesPlayed(false);
  };

  return [playTones, repeatTones, tonesRelation, tonesPlayed, initiateAudioContext];
};

export default useListeningPlayer;
