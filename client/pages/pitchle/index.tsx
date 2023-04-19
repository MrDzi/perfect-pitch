import React, { useState, ReactElement, useEffect, useRef } from "react";
import cx from "classnames";
import PageWrapper from "../../components/page-wrapper";
import usePlayer from "../../hooks/usePlayer";
import { GameStatus } from "../../types/types";
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
  const [noteData, playRandomNotes, repeatPlaying] = usePlayer(700);
  const [isSuccessfullyCompleted, setIsSuccessfullyCompleted] = useState(false);
  const solution = useRef<Note[]>([]);
  const [currentInput, setCurrentInput] = useState<{ [key: number]: Note[] }>(
    attemptsArray.reduce((acc, _, i) => {
      acc[i] = [];
      return acc;
    }, {})
  );
  const [currentStep, setCurrentStep] = useState(0);

  const playMelody = () => {
    playRandomNotes(NUM_OF_TONES_TO_PLAY);
    setGameStatus(GameStatus.InProgress);
  };

  useEffect(() => {
    if (noteData.notes.length) {
      solution.current = noteData.notes;
    }
  }, [noteData]);

  useEffect(() => {
    if (currentStep === 0) {
      return;
    }
    const isCurrentInputCorrect =
      checkIfEqualArrays(solution.current, currentInput[currentStep - 1]) && currentInput[currentStep].length === 0;

    if (isCurrentInputCorrect) {
      setTimeout(() => {
        setIsSuccessfullyCompleted(true);
        setGameStatus(GameStatus.Ended);
      }, 2000);
    }
  }, [currentStep]);

  const renderInputs = () => (
    <div>
      {attemptsArray.map((_, i) => (
        <GameStep
          solution={solution.current}
          values={currentInput[i]}
          submitted={i < currentStep}
          key={`input-row-${i}`}
        />
      ))}
    </div>
  );

  const onSubmit = () => {
    setCurrentStep(currentStep + 1);
  };

  const onInput = (n: Note) => {
    if (currentInput[currentStep].length >= 5) {
      return;
    }
    setCurrentInput({
      ...currentInput,
      [currentStep]: [...currentInput[currentStep], n],
    });
  };

  const onDelete = () => {
    if (currentInput[currentStep].length === 0) {
      return;
    }
    setCurrentInput({
      ...currentInput,
      [currentStep]: [...currentInput[currentStep]].slice(0, currentInput[currentStep].length - 1),
    });
  };

  function checkIfEqualArrays<T>(arr1: T[], arr2: T[]): boolean {
    const length = Math.max(arr1.length, arr2.length);
    let equalArrays = true;
    for (let i = 0; i < length; i++) {
      if (arr1[i] !== arr2[i]) {
        equalArrays = false;
      }
    }
    return equalArrays;
  }

  return (
    <PageWrapper>
      <div className="pitchle page-transition-name">
        {noteData.played ? (
          <button className="button button--no-border" onClick={repeatPlaying}>
            Repeat the melody
          </button>
        ) : gameStatus !== GameStatus.InProgress ? (
          <button className="button" onClick={playMelody}>
            Play the melody
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
                disabled={currentInput[currentStep] && currentInput[currentStep].length < 5}
                onClick={onSubmit}
                className="note-button note-button--submit"
                key="note-button-submit"
              >
                Enter
              </button>
            </div>
          </>
        )}
        {gameStatus === GameStatus.Ended && <div>Game ended</div>}
      </div>
    </PageWrapper>
  );
};

export default Pitchle;
