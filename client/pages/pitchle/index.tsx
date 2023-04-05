import React, { useState, ReactElement, useEffect, useRef } from "react";
import cx from "classnames";
import Header from "../../components/game-header";
import GameEnd from "../../components/game-end";
import usePlayer from "../../hooks/usePlayer";
import { GameMode, GameStatus } from "../../types/types";
import GameStep from "./game-step";
import { Note, NOTES } from "../../constants";
import SineWave from "../../components/game-header/icons/sine-wave";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

const NUM_OF_TONES_TO_PLAY = 5;
const NUM_OF_ATTEMPTS = 5;

const attemptsArray = [...Array(NUM_OF_ATTEMPTS)];

const Pitchle = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  // const [points, setPoints] = useState<number | null>(null);
  // const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playRandomNotes, repeatPlaying] = usePlayer(700);
  const solution = useRef<Note[]>([]);
  const [currentInput, setCurrentInput] = useState<{ [key: number]: Note[] }>(
    attemptsArray.reduce((acc, _, i) => {
      acc[i] = [];
      return acc;
    }, {})
  );
  const [currentAttempt, setCurrentAttempt] = useState(0);

  const playMelody = () => {
    playRandomNotes(NUM_OF_TONES_TO_PLAY);
    setGameStatus(GameStatus.InProgress);
  };

  useEffect(() => {
    if (noteData.notes.length) {
      solution.current = noteData.notes;
    }
  }, [noteData]);

  const renderInputs = () => (
    <div>
      {attemptsArray.map((_, i) => (
        <GameStep
          solution={solution.current}
          values={currentInput[i]}
          submitted={i < currentAttempt}
          key={`input-row-${i}`}
        />
      ))}
    </div>
  );

  const onSubmit = () => {
    console.log("currentInput", currentInput);
    setCurrentAttempt(currentAttempt + 1);
  };

  const onInput = (n: Note) => {
    if (currentInput[currentAttempt].length >= 5) {
      return;
    }
    setCurrentInput({
      ...currentInput,
      [currentAttempt]: [...currentInput[currentAttempt], n],
    });
  };

  const onDelete = () => {
    if (currentInput[currentAttempt].length === 0) {
      return;
    }
    setCurrentInput({
      ...currentInput,
      [currentAttempt]: [...currentInput[currentAttempt]].slice(0, currentInput[currentAttempt].length - 1),
    });
  };

  console.log("noteData", noteData, gameStatus);

  return (
    <div className="page">
      <div className="pitchle">
        {noteData.played ? (
          <button className="button button--no-border" onClick={repeatPlaying}>
            Repeat the melody
          </button>
        ) : gameStatus !== GameStatus.InProgress ? (
          <button className="button" onClick={playMelody}>
            Play random melody
          </button>
        ) : (
          <span className="tone-icon">
            <SineWave />
          </span>
        )}
        {gameStatus === GameStatus.InProgress && noteData.played && (
          <>
            <div className="flex-center">
              <div className="pitchle-input-group">{renderInputs()}</div>
            </div>
            <div className="flex">
              {NOTES.map((n) => (
                <div onClick={() => onInput(n)} className="note note-button note-button--note" key={`note-button-${n}`}>
                  <span>{n[0]}</span>
                  <span>{n[1]}</span>
                </div>
              ))}
            </div>
            <div className="flex">
              <button onClick={onDelete} className="note-button note-button--back" key="note-button-back">
                Delete
              </button>
              <button
                disabled={currentInput[currentAttempt] && currentInput[currentAttempt].length < 5}
                onClick={onSubmit}
                className="note-button note-button--submit"
                key="note-button-submit"
              >
                Enter
              </button>
            </div>
          </>
        )}
        {/* {gameStatus === GameStatus.Ended && (
          <GameEnd totalPoints={totalPoints} onClick={restartGame} mode={GameMode.PITCHLE} />
        )} */}
      </div>
    </div>
  );
};

export default Pitchle;
