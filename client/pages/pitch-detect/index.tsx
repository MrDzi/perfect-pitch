import React, { useState, ReactElement, useEffect, useContext } from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useHistory
// } from "react-router-dom";
import axios from "axios";
import GameHeader from "./gameHeader";
import PitchVisualization from "./pitchVisualization";
import useDetectPitch from "../../hooks/useDetectPitch";
import Ended from "./ended";
import usePlayer from "../../hooks/usePlayer";
import { AppContext } from "../../app";

enum GameStatus {
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

const PitchDetect = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.InProgress);
  const [highScoresList, setHighScoresList] = useState<HighScoresList[]>([]);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playRandomNote, playLastNote] = usePlayer();
  const [startPitchDetection, stopPitchDetection, points, detune, volume] = useDetectPitch();
  const [user, setUser] = useContext(AppContext);

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
              userName: user.name,
              score: totalPoints,
              date: Date.now(),
            })
            .then((user) => {
              if (user.data._id && setUser) {
                setUser((u) => ({
                  id: user.data._id,
                  name: u.name,
                }));
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

  const restartGame = () => {
    setTotalPoints(0);
    setNumOfTonesPlayed(0);
    setGameStatus(GameStatus.InProgress);
  };

  return (
    <div className="game full-size">
      {gameStatus === GameStatus.InProgress && (
        <>
          <GameHeader
            numOfTonesPlayed={numOfTonesPlayed}
            counter={counter}
            playLastNote={playLastNote}
            totalPoints={totalPoints}
            points={points}
            isNotePlayed={noteData.played}
          />
          <PitchVisualization volume={volume} detune={detune} counter={counter} />
        </>
      )}
      {gameStatus === GameStatus.Ended && (
        <Ended totalPoints={totalPoints} userId={user.id} highScoresList={highScoresList} onClick={restartGame} />
      )}
    </div>
  );
};

export default PitchDetect;
