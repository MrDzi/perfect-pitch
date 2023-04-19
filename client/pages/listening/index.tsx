import React, { useState, ReactElement, useEffect, ChangeEvent } from "react";
import Header from "../../components/game-header";
import GameEnd from "../../components/game-end";
import useListeningPlayer from "../../hooks/useListeningPlayer";
import { GameMode, GameStatus } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

const NUM_OF_TONES_TO_PLAY = 5;

const Listening = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.InProgress);
  const [points, setPoints] = useState<number | null>(null);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playTwoNotes, playLastNote] = useListeningPlayer();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (points !== null) {
      setTimeout(() => {
        setNumOfTonesPlayed((n) => n + 1);
        setTotalPoints((p) => p + points);
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
      setCounter(counter - 1);
      if (counter === 1) {
        if (numOfTonesPlayed === NUM_OF_TONES_TO_PLAY) {
          setGameStatus(GameStatus.Ended);
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
    setPoints(noteData.relation === selectedOption ? 1 : 0);
    setSelectedOption(null);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(e.target.value, 10));
  };

  return (
    <PageWrapper>
      <>
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
          <GameEnd totalPoints={totalPoints} onClick={restartGame} mode={GameMode.LISTENING} />
        )}
      </>
    </PageWrapper>
  );
};

export default Listening;
