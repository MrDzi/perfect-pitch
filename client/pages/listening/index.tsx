import React, { useState, ReactElement, useEffect, useContext, ChangeEvent } from "react";
import axios from "axios";
import Header from "../../components/game-header";
import GameEnd from "../../components/game-end";
import useListeningPlayer from "./hooks/use-listening-player";
import { GameStatus } from "../../types/types";
import { AppContext } from "../../app";
import { API_URL } from "../../types/declarations";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

const getTotalPoints = (points: number, numOfTonesPlayed: number) =>
  Math.round((points / (numOfTonesPlayed === 0 ? 1 : 2)) * 10) / 10;

const Listening = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.InProgress);
  const [highScoresList, setHighScoresList] = useState<HighScoresList[]>([]);
  const [points, setPoints] = useState<number | null>(null);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [user, setUser] = useContext(AppContext);
  const [noteData, playTwoNotes, playLastNote] = useListeningPlayer();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (points !== null) {
      setTimeout(() => {
        setNumOfTonesPlayed((n) => n + 1);
        setTotalPoints((p) => getTotalPoints(p + points, numOfTonesPlayed));
        setPoints(null);
        setCounter(3);
      }, 2000);
    }
  }, [points]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    setTimeout(() => {
      if (counter !== 1) {
        setCounter(counter - 1);
      } else {
        setCounter(counter - 1);
        if (numOfTonesPlayed === 5) {
          setGameStatus(GameStatus.Ended);
          // return axios
          //   .post(`${API_URL}/scores`, {
          //     userName: user.name,
          //     score: totalPoints,
          //     date: Date.now(),
          //   })
          //   .then((user) => {
          //     if (user.data._id) {
          //       setUser((u) => ({
          //         id: user.data._id,
          //         name: u.name,
          //       }));
          //     }
          //     axios.get(`${API_URL}/scores`).then((res) => {
          //       setHighScoresList(res.data);
          //     });
          //   });
        } else {
          playTwoNotes();
        }
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

  const onAnswerSubmit = () => {
    setPoints(noteData.relation === selectedOption ? 100 : 0);
    setSelectedOption(null);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(e.target.value, 10));
  };

  return (
    <div className="page">
      {gameStatus === GameStatus.InProgress && (
        <>
          <Header
            currentStep={numOfTonesPlayed + 1}
            totalSteps={5}
            counter={counter}
            points={points}
            totalPoints={totalPoints}
            isNotePlayed={noteData.played}
            onRepeatClick={playLastNote}
          />
          <div className="game-visualization flex-center">
            {noteData.played && counter === 0 && (
              <div className="radio-group">
                <input
                  type="radio"
                  name="options"
                  id="0"
                  value={0}
                  onChange={handleOptionChange}
                  checked={selectedOption === 0}
                />
                <label htmlFor="0">The first tone was higher</label>
                <input
                  type="radio"
                  name="options"
                  id="1"
                  value={1}
                  onChange={handleOptionChange}
                  checked={selectedOption === 1}
                />
                <label htmlFor="1">The second tone was higher</label>
                <input
                  type="radio"
                  name="options"
                  id="2"
                  value={2}
                  onChange={handleOptionChange}
                  checked={selectedOption === 2}
                />
                <label htmlFor="2">Two tones are identical</label>
                <button className="button" onClick={onAnswerSubmit}>
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {gameStatus === GameStatus.Ended && (
        <GameEnd totalPoints={totalPoints} userId={user.id} highScoresList={highScoresList} onClick={restartGame} />
      )}
    </div>
  );
};

export default Listening;
