import React, { useState, ReactElement, useEffect, useContext } from "react";
import axios from "axios";
import Header from "../../components/game-header";
import PitchVisualization from "./pitch-visualization";
import useDetectPitch from "./hooks/use-detect-pitch";
import GameEnd from "../../components/game-end";
import usePlayer from "./hooks/use-player";
import { GameStatus } from "../../types";
import { AppContext } from "../../app";
import { API_URL } from "../../constants";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

const getTotalPoints = (points: number, numOfTonesPlayed: number) =>
  Math.round((points / (numOfTonesPlayed === 0 ? 1 : 2)) * 10) / 10;

const Singing = (): ReactElement => {
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
        setTotalPoints((p) => getTotalPoints(p + points, numOfTonesPlayed));
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
              if (user.data._id) {
                setUser((u) => ({
                  id: user.data._id,
                  name: u.name,
                }));
              }
              axios.get(`${API_URL}/scores`).then((res) => {
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
    <div className="page">
      {gameStatus === GameStatus.InProgress && (
        <>
          <Header
            currentStep={numOfTonesPlayed + 1}
            counter={counter}
            points={points}
            totalPoints={totalPoints}
            isNotePlayed={noteData.played}
            onRepeatClick={playLastNote}
            isSingingMode
          />
          <PitchVisualization volume={volume} detune={detune} counter={counter} />
        </>
      )}
      {gameStatus === GameStatus.Ended && (
        <GameEnd totalPoints={totalPoints} userId={user.id} highScoresList={highScoresList} onClick={restartGame} />
      )}
    </div>
  );
};

export default Singing;