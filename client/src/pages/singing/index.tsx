import React, { useState, ReactElement, useEffect } from "react";
import Header from "../../components/game-header";
import PitchVisualization from "./pitch-visualization";
import GameEnd from "../../components/game-end";
import usePlayer from "../../hooks/usePlayer";
import useDetectPitch from "../../hooks/useDetectPitch";
import { GameStatus } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";
import "./singing.scss";
import { Note } from "../../constants";

const getTotalPoints = (currentTotalPoints: number, points: number, numOfTonesPlayed: number) =>
  Math.round(((currentTotalPoints + points) / (numOfTonesPlayed === 0 ? 1 : 2)) * 10) / 10;

const NUM_OF_NOTES_TO_PLAY = 5;
const COUNTER_START_VALUE = 3;
const LOCAL_STORAGE_KEY = "singing_info_seen";

const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
const savedDataParsed = typeof savedData === "string" ? JSON.parse(savedData) : null;

const getPointsWon = (targetNote: Note | null, note: Note | null, detune: number | null): number => {
  if (detune) {
    return Math.max(0, Math.min(107 - Math.abs(detune), 100));
  }
  return 0;
};

const Singing = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [playNote, repeatNote, playingNoteFinished, notes] = usePlayer();
  const [startPitchDetection, stopPitchDetection, singingData, progress, detune] = useDetectPitch();
  const [instructionsSeen, setInstructionsSeen] = useState<null | boolean>(savedDataParsed);

  useEffect(() => {
    document.title = "Singing | CheckYourPitch";
  }, []);

  useEffect(() => {
    if (singingData) {
      const newPoints = getPointsWon(notes[0], singingData.note, singingData.detune);
      setCurrentPoints(newPoints);
      setTimeout(() => {
        setNumOfTonesPlayed((n) => n + 1);
        setTotalPoints((p) => getTotalPoints(p, newPoints, numOfTonesPlayed));
        setCounter(COUNTER_START_VALUE);
        setCurrentPoints(null);
      }, 2000);
    }
  }, [singingData]);

  useEffect(() => {
    if (!notes) {
      return;
    }
    if (playingNoteFinished) {
      startPitchDetection(notes[0]);
    } else {
      stopPitchDetection();
    }
  }, [notes, playingNoteFinished]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    const timeout = setTimeout(() => {
      setCounter(counter - 1);
      if (counter === 1) {
        if (numOfTonesPlayed === NUM_OF_NOTES_TO_PLAY) {
          setGameStatus(GameStatus.Ended);
          return;
        } else {
          playNote();
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [counter]);

  useEffect(() => {
    if (gameStatus === GameStatus.InProgress) {
      setTotalPoints(0);
      setNumOfTonesPlayed(0);
      setCounter(COUNTER_START_VALUE);
    }
  }, [gameStatus]);

  const startGame = () => {
    setGameStatus(GameStatus.InProgress);
  };

  const closeInstructionsOverlay = () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(true));
    setInstructionsSeen(true);
  };

  if (gameStatus === GameStatus.Ended) {
    return (
      <PageWrapper>
        <GameEnd totalPoints={totalPoints} onClick={startGame} withPercentage />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-column full-size">
        {instructionsSeen !== true ? (
          <div className="instructions-overlay">
            <p>Make sure you allowed the application to use your microphone.</p>
            <p>
              When you click on the &quot;start&quot; button, you will hear a tone after 3 seconds. You then need to
              repeat this tone by singing or whistling. You will hear 5 tones in total.
            </p>
            <button className="button button--secondary button--inverted" onClick={closeInstructionsOverlay}>
              Ok
            </button>
          </div>
        ) : null}
        <Header
          totalSteps={NUM_OF_NOTES_TO_PLAY}
          currentStep={numOfTonesPlayed + 1}
          counter={counter}
          points={currentPoints}
          totalPoints={totalPoints}
          isNotePlayed={playingNoteFinished}
          onRepeatClick={repeatNote}
          onStartClick={startGame}
          gameStatus={gameStatus}
          isSingingMode
          withPercentage
        />
        <PitchVisualization
          detune={detune}
          shouldVisualize={counter === 0}
          progress={currentPoints !== null ? 100 : progress}
        />
      </div>
    </PageWrapper>
  );
};

export default Singing;
