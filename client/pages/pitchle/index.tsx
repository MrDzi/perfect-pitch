import React, { useState, ReactElement, useEffect, useRef } from "react";
import cx from "classnames";
import Modal from "react-bootstrap/Modal";
import PageWrapper from "../../components/page-wrapper";
import usePlayer from "../../hooks/usePlayer";
import { GameStatus } from "../../types/types";
import GameStep, { getResults, InputStatus } from "./game-step";
import { Note, NOTES } from "../../constants";
import SineWave from "../../components/game-header/icons/sine-wave";
import popSound from "../../assets/tones/pop.mp3";
import useSound from "use-sound";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

const greySquare = "\u{2B1C}";
const yellowSqare = "\u{1F7E8}";
const greenSquare = "\u{1F7E9}";
const lineBreak = "\u{000A}";
const doubleLineBreak = "\u{000A}\u{000A}";

const generateFinalMessage = (solution: Note[], input: { [key: number]: Note[] }, step: number): string => {
  let message = `I guessed this 5-tone melody in ${step}/6 tries.${doubleLineBreak}`;

  for (let i = 0; i < Object.keys(input).length; i++) {
    const results = getResults(input[i], solution);
    for (let j = 0; j < results.length; j++) {
      switch (results[j]) {
        case InputStatus.GUESSED:
          message += greenSquare;
          break;
        case InputStatus.GUESSED_NO_POSITION:
          message += yellowSqare;
          break;
        case InputStatus.MISSED:
        default:
          message += greySquare;
      }
      if (j === results.length - 1) {
        message += lineBreak;
      }
    }
  }
  message += lineBreak;
  message += "Can you guess this melody?";
  message += lineBreak;
  message += "test .com";

  console.log(message);

  return message;
};

const NUM_OF_TONES_TO_PLAY = 5;
const NUM_OF_ATTEMPTS = 6;

const attemptsArray = [...Array(NUM_OF_ATTEMPTS)];

const Pitchle = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [noteData, playRandomNotes, repeatPlaying] = usePlayer(800);
  // const [showModal, setShowModal] = useState(false);
  const [clipboardMessage, setClipboardMessage] = useState(
    "Copy your result to clipboard and share with your friends!"
  );
  const [message, setMessage] = useState("");
  const solution = useRef<Note[]>([]);
  const [currentInput, setCurrentInput] = useState<{ [key: number]: Note[] }>(
    attemptsArray.reduce((acc, _, i) => {
      acc[i] = [];
      return acc;
    }, {})
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [playPopSound] = useSound(popSound, {
    volume: 0.5,
  });

  const notesPlayer = new Audio("../assets/tones/c.wav");

  console.log("NOTE PLAYER", notesPlayer);

  notesPlayer.addEventListener("canplaythrough", (event) => {
    /* the audio is now playable; play it if permissions allow */
    notesPlayer.play();
  });

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
      checkIfEqualArrays(solution.current, currentInput[currentStep - 1]) &&
      (!currentInput[currentStep] || currentInput[currentStep].length === 0);

    if (isCurrentInputCorrect) {
      setTimeout(() => {
        // setShowModal(true);
        setMessage(generateFinalMessage(solution.current, currentInput, currentStep));
        setGameStatus(GameStatus.Ended);
      }, 3000);
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
    playPopSound();
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

  const getPitchleHeader = () => {
    if (noteData.played && gameStatus !== GameStatus.Ended) {
      return (
        <button className="button button--no-border" onClick={repeatPlaying}>
          Repeat the melody
        </button>
      );
    }
    if (!noteData.played && gameStatus === GameStatus.NotStarted) {
      return (
        <button className="button" onClick={playMelody}>
          Play the melody
        </button>
      );
    }
    if (!noteData.played && gameStatus === GameStatus.InProgress) {
      return (
        <span className="tone-icon">
          <SineWave />
        </span>
      );
    }
  };

  const onCopyClick = () => {
    navigator.clipboard.writeText(message).then(() => {
      setClipboardMessage("Result copied!");
    });
  };

  const onShareClick = () => {
    navigator.share({
      text: message,
    });
  };

  return (
    <PageWrapper>
      <div className="pitchle page-transition-name">
        <div className="pitchle_header">
          {/* {gameStatus === GameStatus.Ended ? (
            <button className="button" onClick={playMelody}>
              Play again
            </button>
          ) : null} */}
          {getPitchleHeader()}
        </div>
        <div>SOLUTION: {solution.current.join(",")}</div>
        <div className="pitchle_content">
          <div className="flex-center">
            <div className="pitchle-input-group">{renderInputs()}</div>
          </div>
          <div className="flex">
            {NOTES.map((n) => (
              <button
                onClick={() => onInput(n)}
                className="note note-button note-button--note"
                key={`note-button-${n}`}
                disabled={gameStatus !== GameStatus.InProgress}
              >
                <span>{n[0]}</span>
                <span>{n[1]}</span>
              </button>
            ))}
          </div>
          <div className="flex">
            <button onClick={onDelete} className="note-button note-button--back" key="note-button-back">
              Delete
            </button>
            <button
              disabled={
                (currentInput[currentStep] && currentInput[currentStep].length < 5) || gameStatus === GameStatus.Ended
              }
              onClick={onSubmit}
              className="note-button note-button--submit"
              key="note-button-submit"
            >
              Enter
            </button>
          </div>
        </div>
        {gameStatus === GameStatus.Ended ? (
          <>
            <div style={{ cursor: "pointer" }} onClick={onCopyClick}>
              {clipboardMessage}
            </div>
            {"share" in navigator ? (
              <div style={{ marginTop: 20 }} onClick={onShareClick}>
                SHARE
              </div>
            ) : null}
          </>
        ) : null}
        {/* <div onClick={e => e.stopPropagation()}>
          <Modal show={true}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, text in a modal!</Modal.Body>
          </Modal>
        </div> */}
      </div>
    </PageWrapper>
  );
};

export default Pitchle;
