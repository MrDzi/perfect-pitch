import React, { useState, ReactElement, useEffect, useRef, lazy, useContext } from "react";
import useSound from "use-sound";
import PageWrapper from "../../components/page-wrapper";
import { generateFinalMessage, checkIfEqualArrays } from "./helpers";
import usePlayer from "../../hooks/usePlayer";
import { GameStatus } from "../../types/types";
import GameStep from "./game-step";
import { Note, NOTES } from "../../constants";
import { API_URL } from "../../types/declarations";
import { AppContext } from "../../app";
import useFetch, { HttpMethods } from "../../hooks/useFetch";
import AudioWave from "../../components/game-header/icons/sine-wave";
import popSound from "../../assets/tones/pop.mp3";
const GameEndConfetti = lazy(() => import("../../components/game-end-confetti"));
const Stats = lazy(() => import("../../components/stats"));

const NUM_OF_ATTEMPTS = 6;
const LOCAL_STORAGE_KEY = "pitchle";

const attemptsArray = [...Array(NUM_OF_ATTEMPTS)];

type MelodyData = {
  date: Date;
  melody: Note[];
};

type Input = { [key: number]: Note[] };

export type Stats = {
  gamesPlayed: number;
  gamesWon: number;
  winPercentage: number;
  streak: number;
  maxStreak: number;
  lastCompletedGameDate: string;
  lastGameSolution: { [key: number]: Note[] };
};

const savedLSData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
const savedLSDataParsed = typeof savedLSData === "string" ? JSON.parse(savedLSData) : null;

const getUpdatedStats = (currentInput: Input, currentStats: Stats | null, date: string, isWon: boolean) => {
  let updatedStats: Stats;
  if (currentStats) {
    const updatedStreak = isWon ? currentStats.streak + 1 : 0;
    const updatedGamesWon = currentStats.gamesWon + (isWon ? 1 : 0);
    const updatedGamesPlayed = currentStats.gamesPlayed + 1;
    const updatedWinPercentage = Math.floor((updatedGamesWon * 100) / updatedGamesPlayed);
    updatedStats = {
      gamesPlayed: updatedGamesPlayed,
      gamesWon: updatedGamesWon,
      winPercentage: updatedWinPercentage,
      streak: updatedStreak,
      maxStreak: Math.max(currentStats.maxStreak, updatedStreak),
      lastCompletedGameDate: date,
      lastGameSolution: currentInput,
    };
  } else {
    updatedStats = {
      gamesPlayed: 1,
      gamesWon: isWon ? 1 : 0,
      winPercentage: isWon ? 100 : 0,
      streak: isWon ? 1 : 0,
      maxStreak: isWon ? 1 : 0,
      lastCompletedGameDate: date,
      lastGameSolution: currentInput,
    };
  }
  return updatedStats;
};

const Pitchle = (): ReactElement => {
  const appContext = useContext(AppContext);
  const statsData = useRef<Stats | null>(savedLSDataParsed);
  const [gameStatus, setGameStatus] = useState<GameStatus>(
    statsData.current && statsData.current.lastCompletedGameDate === appContext.date
      ? GameStatus.Ended
      : GameStatus.NotStarted
  );
  const [shareButtonLabel, setShareButtonLabel] = useState("Share \u{1F3A4}");
  const [message, setMessage] = useState("");
  const [currentInput, setCurrentInput] = useState<Input>(
    statsData.current && statsData.current.lastCompletedGameDate === appContext.date
      ? statsData.current.lastGameSolution
      : attemptsArray.reduce((acc, _, i) => {
          acc[i] = [];
          return acc;
        }, {})
  );
  const [gameWon, setGameWon] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [playPopSound] = useSound(popSound, {
    volume: 0.5,
  });
  const [melodyData, melodyDataError, isLoading] = useFetch<MelodyData>({
    url: `${API_URL}/melody`,
    method: HttpMethods.GET,
  });
  const [noteData, playNotes, repeatPlaying] = usePlayer(600);

  if (melodyDataError) {
    return (
      <PageWrapper>
        <div className="full-size flex flex-center">
          Failed to retrieve the melody for this day. Please try again by refreshing the page.
        </div>
      </PageWrapper>
    );
  }

  const playMelody = () => {
    if (melodyData) {
      playNotes(melodyData.melody);
      setGameStatus(GameStatus.InProgress);
    }
  };

  useEffect(() => {
    if (currentStep === 0) {
      return;
    }
    if (currentStep === NUM_OF_ATTEMPTS) {
      setTimeout(() => {
        setGameStatus(GameStatus.Ended);
        statsData.current = getUpdatedStats(currentInput, statsData.current, appContext.date, false);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(statsData.current));
      }, 1500);
    }
    const isCurrentInputCorrect =
      checkIfEqualArrays(melodyData?.melody || [], currentInput[currentStep - 1]) &&
      (!currentInput[currentStep] || currentInput[currentStep].length === 0);

    if (isCurrentInputCorrect) {
      setTimeout(() => {
        setMessage(generateFinalMessage(melodyData?.melody || [], currentInput, currentStep));
        setGameWon(true);
        statsData.current = getUpdatedStats(currentInput, statsData.current, appContext.date, true);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(statsData.current));
      }, 1500);
      setTimeout(() => {
        setGameStatus(GameStatus.Ended);
      }, 3000);
    }
  }, [currentStep]);

  const renderInputs = () => (
    <div>
      {attemptsArray.map((_, i) => (
        <GameStep
          solution={melodyData?.melody || []}
          values={currentInput[i]}
          submitted={i < currentStep || gameStatus === GameStatus.Ended}
          key={`input-row-${i}`}
          gameStatus={gameStatus}
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
    if (isLoading) {
      return <p>Loading the melody...</p>;
    }
    if (noteData.played && gameStatus !== GameStatus.Ended) {
      return (
        <div className="pitchle_header">
          <button className="button button--secondary button--small" onClick={repeatPlaying}>
            Repeat the melody
          </button>
        </div>
      );
    }
    if (!noteData.played && gameStatus === GameStatus.NotStarted) {
      return (
        <div className="pitchle_header">
          <button className="button button--small" onClick={playMelody}>
            Play the melody
          </button>
        </div>
      );
    }
    if (!noteData.played && gameStatus === GameStatus.InProgress) {
      return (
        <div className="pitchle_header">
          <div className="sine-wave-wrapper">
            <AudioWave width={25} />
          </div>
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
      <div className="pitchle">
        {getPitchleHeader()}
        <div className="pitchle_content">
          <div className="flex-center" style={{ marginBottom: gameStatus === GameStatus.Ended ? 0 : 40 }}>
            <div className="pitchle-input-group">{renderInputs()}</div>
          </div>
          {gameStatus !== GameStatus.Ended ? (
            <div style={{ marginBottom: 20 }}>
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
              <button className="button button--pitchle-main" onClick={onShareClick}>
                {shareButtonLabel}
              </button>
              {statsData.current ? <Stats data={statsData.current} /> : null}
            </>
          )}
          {gameWon ? <GameEndConfetti /> : null}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Pitchle;
