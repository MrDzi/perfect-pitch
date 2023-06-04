import React, { useState, ReactElement, useEffect, useRef, lazy, useContext } from "react";
import useSound from "use-sound";
import { PulseLoader } from "react-spinners";
import cx from "classnames";
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
import Share from "./icons/share";
const GameEndConfetti = lazy(() => import("../../components/game-end-confetti"));
const Stats = lazy(() => import("../../components/stats"));

const NUM_OF_ATTEMPTS = 6;
const LOCAL_STORAGE_KEY = "pitchle_data";

const attemptsArray = [...Array(NUM_OF_ATTEMPTS)];

type MelodyData = {
  date: Date;
  melody: string;
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
  const [shareButtonLabel, setShareButtonLabel] = useState("Share");
  const [currentInput, setCurrentInput] = useState<Input>(
    statsData.current && statsData.current.lastCompletedGameDate === appContext.date
      ? statsData.current.lastGameSolution
      : attemptsArray.reduce((acc, _, i) => {
          acc[i] = [];
          return acc;
        }, {})
  );
  const [gameWon, setGameWon] = useState(
    statsData.current && statsData.current.lastCompletedGameDate === appContext.date
      ? statsData.current.streak > 0
      : false
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [playPopSound] = useSound(popSound, {
    volume: 0.5,
  });
  const [melodyData, melodyDataError, isLoading] = useFetch<MelodyData>({
    url: `${API_URL}/melody`,
    method: HttpMethods.GET,
  });
  const [melodyDecoded, setMelodyDecoded] = useState<undefined | Note[]>(undefined);
  const [noteData, playNotes, repeatPlaying] = usePlayer(600);

  useEffect(() => {
    document.title = "Pitchle | CheckYourPitch";
  }, []);

  useEffect(() => {
    if (currentStep === 0) {
      return;
    }
    if (currentStep === NUM_OF_ATTEMPTS) {
      statsData.current = getUpdatedStats(currentInput, statsData.current, appContext.date, false);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(statsData.current));
      setTimeout(() => {
        setGameStatus(GameStatus.Ended);
      }, 1500);
    }
    const isCurrentInputCorrect =
      checkIfEqualArrays(melodyDecoded || [], currentInput[currentStep - 1]) &&
      (!currentInput[currentStep] || currentInput[currentStep].length === 0);

    if (isCurrentInputCorrect) {
      statsData.current = getUpdatedStats(currentInput, statsData.current, appContext.date, true);
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(statsData.current));
      setTimeout(() => {
        setGameWon(true);
      }, 1000);
      setTimeout(() => {
        setGameStatus(GameStatus.Ended);
      }, 3000);
    }
  }, [currentStep]);

  useEffect(() => {
    if (melodyData) {
      const decoded = window.atob(melodyData.melody.slice(1));
      if (decoded) {
        setMelodyDecoded(JSON.parse(decoded));
      }
    }
  }, [melodyData]);

  if (melodyDataError) {
    return (
      <PageWrapper>
        <div className="full-size flex flex-center">
          Failed to retrieve the melody for today. Please try again by refreshing the page.
        </div>
      </PageWrapper>
    );
  }

  const renderInputs = () => (
    <div>
      {attemptsArray.map((_, i) => (
        <GameStep
          solution={melodyDecoded || []}
          values={currentInput[i]}
          submitted={i < currentStep || gameStatus === GameStatus.Ended}
          key={`input-row-${i}`}
          gameStatus={gameStatus}
        />
      ))}
    </div>
  );

  const playMelody = () => {
    if (melodyDecoded) {
      playNotes(melodyDecoded);
      setGameStatus(GameStatus.InProgress);
    }
  };

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
      return (
        <div className="flex flex-center" style={{ height: 40 }}>
          <PulseLoader size={10} color="#678e3e" />
        </div>
      );
    }
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
          <AudioWave width={28} />
        </div>
      );
    }
  };

  const onShareClick = () => {
    const clipboard = navigator.clipboard;
    const message = generateFinalMessage(melodyDecoded || [], currentInput, currentStep);
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
      <div
        className={cx("pitchle", {
          "pitchle--ended": gameStatus === GameStatus.Ended,
        })}
      >
        <div className="pitchle_header">{getPitchleHeader()}</div>
        <div className="pitchle_content">
          <div style={{ marginBottom: gameStatus === GameStatus.Ended ? 0 : 40 }}>
            <div className="pitchle-input-group">{renderInputs()}</div>
          </div>
          {gameStatus !== GameStatus.Ended ? (
            <div className="pitchle_controls">
              <div className="pitchle_note-buttons flex margin-bottom-half">
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
                <button
                  onClick={onDelete}
                  className="note-button note-button--back"
                  key="note-button-back"
                  disabled={currentInput[currentStep] && currentInput[currentStep].length === 0}
                >
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
              {gameWon && melodyDecoded ? (
                <button className="button button--pitchle-main" onClick={onShareClick}>
                  {shareButtonLabel} <Share />
                </button>
              ) : null}
              {!gameWon && melodyDecoded ? (
                <div>
                  <p>
                    You lost. The melody was: <b>{melodyDecoded.join(", ")}.</b>
                  </p>
                  <p>Come back tomorrow to try again!</p>
                </div>
              ) : null}
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
