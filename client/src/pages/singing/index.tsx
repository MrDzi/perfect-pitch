import React, { useState, ReactElement, useEffect } from "react";
import Header from "../../components/game-header";
import PitchVisualization from "./pitch-visualization";
import GameEnd from "../../components/game-end";
import usePlayer from "../../hooks/usePlayer";
import useDetectPitch from "../../hooks/useDetectPitch";
import { GameStatus } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";
import "./singing.scss";

const getTotalPoints = (points: number, numOfTonesPlayed: number) =>
  Math.round((points / (numOfTonesPlayed === 0 ? 1 : 2)) * 10) / 10;

const NUM_OF_NOTES_TO_PLAY = 5;
const COUNTER_START_VALUE = 3;
const LOCAL_STORAGE_KEY = "singing_info_seen";

const savedData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
const savedDataParsed = typeof savedData === "string" ? JSON.parse(savedData) : null;

const Singing = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playRandomNote, repeatNotes] = usePlayer();
  const [startPitchDetection, stopPitchDetection, reset, points, detune, progress] = useDetectPitch();
  const [instructionsSeen, setInstructionsSeen] = useState<null | boolean>(savedDataParsed);

  useEffect(() => {
    document.title = "Singing | CheckYourPitch";
  }, []);

  useEffect(() => {
    if (noteData.notes) {
      if (noteData.played) {
        startPitchDetection(noteData.notes[0]);
      } else {
        stopPitchDetection();
      }
    }
  }, [noteData]);

  useEffect(() => {
    if (points !== null) {
      setTimeout(() => {
        setNumOfTonesPlayed((n) => n + 1);
        setTotalPoints((p) => getTotalPoints(p + points, numOfTonesPlayed));
        setCounter(COUNTER_START_VALUE);
        reset();
      }, 2000);
    }
  }, [points]);

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
          playRandomNote();
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

  const restartGame = () => {
    setTotalPoints(0);
    setNumOfTonesPlayed(0);
    setGameStatus(GameStatus.InProgress);
  };

  const closeInstructionsOverlay = () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(true));
    setInstructionsSeen(true);
  };

  return (
    <PageWrapper>
      {gameStatus !== GameStatus.Ended ? (
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
            points={points}
            totalPoints={totalPoints}
            isNotePlayed={noteData.played}
            onRepeatClick={repeatNotes}
            onStartClick={startGame}
            gameStatus={gameStatus}
            isSingingMode
            withPercentage
          />
          <PitchVisualization
            detune={detune}
            shouldVisualize={counter === 0}
            progress={points !== null ? 100 : progress}
          />
        </div>
      ) : (
        <GameEnd totalPoints={totalPoints} onClick={restartGame} withPercentage />
      )}
    </PageWrapper>
  );
};

export default Singing;
