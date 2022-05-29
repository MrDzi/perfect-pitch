import React, { useState, ReactElement, useEffect, useRef } from "react";
import cx from "classnames";
import Header from "../../components/game-header";
import GameEnd from "../../components/game-end";
import usePlayer from "../../hooks/usePlayer";
import { GameMode, GameStatus } from "../../types/types";
import GameStep from "./game-step";
import { Note, NOTES } from "../../constants";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

const NUM_OF_TONES_TO_PLAY = 5;
const NUM_OF_ATTEMPTS = 5;

const Pitchle = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  // const [points, setPoints] = useState<number | null>(null);
  // const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playRandomNotes, repeatPlaying] = usePlayer(700);
  const solution = useRef<Note[]>([]);
  const [currentInput, setCurrentInput] = useState<{ [key: number]: Note[] }>(
    [...Array(NUM_OF_ATTEMPTS)].reduce((acc, _, i) => {
      acc[i] = [];
      return acc;
    }, {})
  );
  const [currentAttempt, setCurrentAttempt] = useState(0);

  console.log("current input", currentInput);

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
      {[...Array(NUM_OF_ATTEMPTS)].map((_, i) => (
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
    console.log("Submitted");
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

  const onBack = () => {
    if (currentInput[currentAttempt].length === 0) {
      return;
    }
    setCurrentInput({
      ...currentInput,
      [currentAttempt]: [...currentInput[currentAttempt]].slice(0, currentInput[currentAttempt].length - 1),
    });
  };

  console.log("noteData.played", noteData.played);

  return (
    <div className="page">
      {noteData.played ? <div onClick={repeatPlaying}>Repeat melody</div> : <div onClick={playMelody}>Play melody</div>}
      {gameStatus === GameStatus.InProgress && (
        <>
          {/* <Header
            currentStep={numOfTonesPlayed + 1}
            totalSteps={5}
            counter={counter}
            points={points}
            totalPoints={totalPoints}
            isNotePlayed={noteData.played}
            onRepeatClick={playLastNote}
          /> */}
          {solution.current.length ? (
            <>
              <div className="game-visualization flex-center">
                <div className="pitchle-input-group">{renderInputs()}</div>
              </div>
              <div className="flex">
                {NOTES.map((n) => (
                  <div onClick={() => onInput(n)} className={cx("note-button", {})} key={`note-button-${n}`}>
                    {n}
                  </div>
                ))}
                <div onClick={onBack} key="note-button-back">
                  Back
                </div>
                <div onClick={onSubmit} key="note-button-submit">
                  Enter
                </div>
              </div>
            </>
          ) : (
            <div>Click on the button above to hear the melody and start the game</div>
          )}
        </>
      )}
      {/* {gameStatus === GameStatus.Ended && (
        <GameEnd totalPoints={totalPoints} onClick={restartGame} mode={GameMode.PITCHLE} />
      )} */}
    </div>
  );
};

export default Pitchle;
