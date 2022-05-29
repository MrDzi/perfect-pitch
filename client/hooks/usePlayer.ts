import { useState, useEffect, useRef } from "react";
import { NOTES, getNoteFrequency, Note } from "../constants";

interface NoteData {
  notes: Note[];
  played: boolean;
}

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

  console.log("RANDOM NOTES", randomNotes);

  return randomNotes;
};

const stopTonePlaying = (gainNode: GainNode, oscNode: OscillatorNode, currentTime: number | undefined = 0) => {
  gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.1);
  oscNode.stop(currentTime + 1);
};

const usePlayer = (toneDuration = 1000): [NoteData, (n?: number) => void, () => void] => {
  const [noteData, setNoteData] = useState<NoteData>({
    notes: [],
    played: false,
  });
  const ctx = useRef<AudioContext>(new AudioContext());

  useEffect(() => {
    if (!ctx.current || !noteData.notes.length || noteData.played) {
      return;
    }
    const oscNode: OscillatorNode = ctx.current.createOscillator();
    const frequencies = noteData.notes.map(getNoteFrequency);
    let currentIndex = 0;
    oscNode.frequency.value = frequencies[currentIndex];
    const gainNode: GainNode = ctx.current.createGain();
    oscNode.connect(gainNode);
    gainNode.connect(ctx.current.destination);

    gainNode.gain.value = 0.15;
    oscNode.start(ctx.current.currentTime);

    const interval = setInterval(() => {
      console.log(currentIndex, noteData.notes);
      if (currentIndex < noteData.notes.length - 1) {
        currentIndex++;
        oscNode.frequency.value = frequencies[currentIndex];
      } else {
        stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
        setNoteData({
          ...noteData,
          played: true,
        });
        clearInterval(interval);
      }
    }, toneDuration);

    return () => {
      if (interval) {
        stopTonePlaying(gainNode, oscNode, ctx.current?.currentTime);
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
