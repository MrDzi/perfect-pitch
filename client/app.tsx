import React, { useState, ReactElement, useEffect } from "react";
import { NotStarted, Ended, PitchVisualization, GameHeader } from "./components";
import useDetectPitch from "./hooks/useDetectPitch";
import usePlayer from "./hooks/usePlayer";
import "./app.scss";

enum GameStatus {
  NotStarted,
  InProgress,
  Ended,
}

// in production mode, API_URL will come from webpack
declare const API_URL: string;

const App = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playRandomNote, playLastNote] = usePlayer();
  const [startPitchDetection, stopPitchDetection, points, detune, volume] = useDetectPitch();

  useEffect(() => {
    fetch(`${API_URL}/api/test`).then((res) => {
      console.log("from server: ", res);
    });
  }, []);

  useEffect(() => {
    if (noteData.note) {
      if (noteData.played) {
        startPitchDetection(noteData.note);
      } else {
        stopPitchDetection();
      }
    }
  }, [noteData]);

  useEffect(() => {
    if (points !== null) {
      setNumOfTonesPlayed((n) => n + 1);
      setCounter(3);
    }
  }, [points]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    setTimeout(() => {
      if (counter === 2 && numOfTonesPlayed && points) {
        setTotalPoints((p) => p + points);
      }
      if (counter === 1) {
        setCounter(counter - 1);
        if (numOfTonesPlayed === 3) {
          setGameStatus(GameStatus.Ended);
          return;
        }
        playRandomNote();
      } else {
        setCounter(counter - 1);
      }
    }, 1000);
  }, [counter]);

  useEffect(() => {
    if (gameStatus === GameStatus.InProgress) {
      setTotalPoints(0);
      setNumOfTonesPlayed(0);
      setCounter(3);
    }
  }, [gameStatus]);

  const startGame = () => setGameStatus(GameStatus.InProgress);

  return (
    <div className="wrapper full-size">
      {gameStatus === GameStatus.NotStarted && <NotStarted onClick={startGame} />}
      {gameStatus === GameStatus.InProgress && (
        <div className="game full-size">
          <GameHeader
            numOfTonesPlayed={numOfTonesPlayed}
            counter={counter}
            playLastNote={playLastNote}
            totalPoints={totalPoints}
            points={points}
            isNotePlayed={noteData.played}
          />
          <PitchVisualization volume={volume} detune={detune} counter={counter} />
        </div>
      )}
      {gameStatus === GameStatus.Ended && <Ended totalPoints={totalPoints} onClick={startGame} />}
    </div>
  );
};

export default App;
