import React, { useState, ReactElement, useEffect, useRef, lazy } from "react";
import useSound from "use-sound";
import PageWrapper from "../../components/page-wrapper";
import { generateFinalMessage, checkIfEqualArrays } from "./helpers";
import usePlayer from "../../hooks/usePlayer";
import { GameStatus } from "../../types/types";
import GameStep from "./game-step";
import { Note, NOTES } from "../../constants";
import AudioWave from "../../components/game-header/icons/sine-wave";
import popSound from "../../assets/tones/pop.mp3";
const GameEnd = lazy(() => import("../../components/game-end-confetti"));

const NUM_OF_TONES_TO_PLAY = 5;
const NUM_OF_ATTEMPTS = 6;

const attemptsArray = [...Array(NUM_OF_ATTEMPTS)];

const Pitchle = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [noteData, playRandomNotes, repeatPlaying] = usePlayer(600);
  const [shareButtonLabel, setShareButtonLabel] = useState("Share \u{1F3A4}");
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
      }, 1500);
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

  const getPitchleHeader = () => {
    if (noteData.played && gameStatus !== GameStatus.Ended) {
      return (
        <button className="button button--secondary button--small" onClick={repeatPlaying}>
          Repeat the melody
        </button>
      );
    }
    if (!noteData.played && gameStatus === GameStatus.NotStarted) {
      return (
        <button className="button button--small" onClick={playMelody}>
          Play the melody
        </button>
      );
    }
    if (!noteData.played && gameStatus === GameStatus.InProgress) {
      return (
        <div className="sine-wave-wrapper">
          <AudioWave />
        </div>
      );
    }
  };

  const onShareClick = () => {
    const clipboard = navigator.clipboard;
    if ("share" in navigator) {
      return navigator.share({
        text: message,
      });
    }
    clipboard.writeText(message).then(() => {
      setShareButtonLabel("Copied to clipboard!");
    });
  };

  return (
    <PageWrapper>
      <div className="pitchle page-transition-name">
        <div className="pitchle_header">{getPitchleHeader()}</div>
        <div className="pitchle_content">
          <div className="flex-center" style={{ marginTop: 12 }}>
            <div className="pitchle-input-group">{renderInputs()}</div>
          </div>
          {gameStatus !== GameStatus.Ended ? (
            <div>
              <div className="flex margin-bottom-half">
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
              <div className="flex flex-center">
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
            </div>
          ) : (
            <>
              <GameEnd />
              <button className="button" onClick={onShareClick}>
                {shareButtonLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Pitchle;
