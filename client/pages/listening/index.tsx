import React, { useState, ReactElement, useEffect, ChangeEvent } from "react";
import Header from "../../components/game-header";
import GameEnd from "../../components/game-end";
import useListeningPlayer from "../../hooks/useListeningPlayer";
import { GameStatus } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";
import cx from "classnames";
import "./listening.scss";

const NUM_OF_TONES_TO_PLAY = 2;

const Listening = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [points, setPoints] = useState<number | null>(null);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [noteData, playTwoNotes, playLastNote] = useListeningPlayer();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, isSubmitted] = useState(false);

  useEffect(() => {
    if (points !== null) {
      setTimeout(() => {
        setNumOfTonesPlayed((n) => n + 1);
        setTotalPoints((p) => p + points);
        setSelectedOption(null);
        setPoints(null);
        setCounter(3);
        isSubmitted(false);
      }, 2000);
    }
  }, [points]);

  useEffect(() => {
    console.log(counter, numOfTonesPlayed);
    if (!counter) {
      return;
    }
    if (numOfTonesPlayed === NUM_OF_TONES_TO_PLAY) {
      setGameStatus(GameStatus.Ended);
      setCounter(null);
      return;
    }
    setTimeout(() => {
      setCounter(counter - 1);
      if (counter === 1) {
        playTwoNotes();
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

  const startGame = () => {
    setGameStatus(GameStatus.InProgress);
  };

  const restartGame = () => {
    setTotalPoints(0);
    setNumOfTonesPlayed(0);
    setGameStatus(GameStatus.InProgress);
  };

  const onAnswerSubmit = () => {
    isSubmitted(true);
    setPoints(noteData.relation === selectedOption ? 1 : 0);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(e.target.value, 10));
  };

  return (
    <PageWrapper>
      <>
        {gameStatus !== GameStatus.Ended && (
          <div className="flex flex-column full-size">
            <Header
              currentStep={numOfTonesPlayed + 1}
              counter={counter}
              points={points}
              totalSteps={NUM_OF_TONES_TO_PLAY}
              totalPoints={totalPoints}
              isNotePlayed={noteData.played}
              onRepeatClick={playLastNote}
              gameStatus={gameStatus}
              onStartClick={startGame}
            />
            <div className="game-visualization flex-center">
              {counter === 0 && (
                <div className="radio-group">
                  <input
                    type="radio"
                    name="options"
                    id="0"
                    value={0}
                    onChange={handleOptionChange}
                    checked={selectedOption === 0}
                    className={cx({
                      highlighted: submitted && noteData.relation === 0,
                    })}
                  />
                  <label htmlFor="0">The first tone is higher</label>
                  <input
                    type="radio"
                    name="options"
                    id="1"
                    value={1}
                    onChange={handleOptionChange}
                    checked={selectedOption === 1}
                    className={cx({
                      highlighted: submitted && noteData.relation === 1,
                    })}
                  />
                  <label htmlFor="1">The second tone is higher</label>
                  <input
                    type="radio"
                    name="options"
                    id="2"
                    value={2}
                    onChange={handleOptionChange}
                    checked={selectedOption === 2}
                    className={cx({
                      highlighted: submitted && noteData.relation === 2,
                    })}
                  />
                  <label htmlFor="2">Two tones are identical</label>
                  <button className="button" onClick={onAnswerSubmit}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {gameStatus === GameStatus.Ended && <GameEnd totalPoints={totalPoints} onClick={restartGame} />}
      </>
    </PageWrapper>
  );
};

export default Listening;
