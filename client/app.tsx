import React, { useState, ReactElement, useEffect } from "react";
import axios from "axios";
import { NotStarted, Ended, PitchVisualization, GameHeader } from "./components";
import useDetectPitch from "./hooks/useDetectPitch";
import usePlayer from "./hooks/usePlayer";
import "./app.scss";

enum GameStatus {
  NotStarted,
  InProgress,
  Ended,
}

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

// in production mode, API_URL will come from webpack
declare const API_URL: string;

const App = (): ReactElement => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [highScoresList, setHighScoresList] = useState<HighScoresList[]>([]);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playRandomNote, playLastNote] = usePlayer();
  const [startPitchDetection, stopPitchDetection, points, detune, volume] = useDetectPitch();

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
      setTimeout(() => {
        setNumOfTonesPlayed((n) => n + 1);
        setTotalPoints((p) => Math.round(((p + points) / (numOfTonesPlayed === 0 ? 1 : 2)) * 10) / 10);
        setCounter(3);
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
        if (numOfTonesPlayed === 3) {
          setGameStatus(GameStatus.Ended);
          return axios
            .post(`${API_URL}/scores`, {
              userName,
              score: totalPoints,
              date: Date.now(),
            })
            .then((user) => {
              if (user.data._id) {
                setUserId(user.data._id);
              }
              axios.get(`${API_URL}/scores`).then((res) => {
                console.log("scores from frontend", res);
                setHighScoresList(res.data);
              });
            });
        } else {
          playRandomNote();
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
      setCounter(3);
    }
  }, [gameStatus]);

  const startGame = (userName?: string) => {
    setGameStatus(GameStatus.InProgress);
    if (userName) {
      setUserName(userName);
    }
  };

  const restartGame = () => {
    setTotalPoints(0);
    setNumOfTonesPlayed(0);
    setUserName(null);
    setUserId(null);
    setGameStatus(GameStatus.NotStarted);
  };

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
      {gameStatus === GameStatus.Ended && (
        <Ended totalPoints={totalPoints} userId={userId} highScoresList={highScoresList} onClick={restartGame} />
      )}
    </div>
  );
};

export default App;
