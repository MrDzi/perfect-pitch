import React, { useState, ReactElement, useEffect } from "react";
import Header from "../../components/game-header";
import PitchVisualization from "./pitch-visualization";
import GameEnd from "../../components/game-end";
import usePlayer from "../../hooks/usePlayer";
import useDetectPitch from "../../hooks/useDetectPitch";
import { GameStatus } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";

const getTotalPoints = (points: number, numOfTonesPlayed: number) =>
  Math.round((points / (numOfTonesPlayed === 0 ? 1 : 2)) * 10) / 10;

const NUM_OF_NOTES_TO_PLAY = 3;
const COUNTER_START_VALUE = 3;

const Singing = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playRandomNotes, repeatPlaying] = usePlayer();
  const [startPitchDetection, stopPitchDetection, points, detune, volume] = useDetectPitch();

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
      }, 2000);
    }
  }, [points]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    setTimeout(() => {
      if (counter === 1) {
        setCounter(counter - 1);
        if (numOfTonesPlayed === NUM_OF_NOTES_TO_PLAY) {
          setGameStatus(GameStatus.Ended);
          return;
        } else {
          playRandomNotes();
        }
      } else {
        setCounter(counter - 1);
      }
    }, 1000);
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

  return (
    <PageWrapper>
      {gameStatus !== GameStatus.Ended ? (
        <>
          <Header
            currentStep={numOfTonesPlayed + 1}
            counter={counter}
            points={points}
            totalPoints={totalPoints}
            isNotePlayed={noteData.played}
            onRepeatClick={repeatPlaying}
            onStartClick={startGame}
            gameStatus={gameStatus}
            isSingingMode
            withPercentage
          />
          <PitchVisualization volume={volume} detune={detune} shouldVisualize={counter === 0} />
        </>
      ) : (
        <GameEnd totalPoints={totalPoints} onClick={restartGame} withPercentage />
      )}
    </PageWrapper>
  );
};

export default Singing;
