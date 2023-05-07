import React, { useState, ReactElement, useEffect, ChangeEvent } from "react";
import Header from "../../components/game-header";
import GameEnd from "../../components/game-end";
import useListeningPlayer from "../../hooks/useListeningPlayer";
import { GameStatus } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";
import "./listening.scss";

const NUM_OF_TONES_TO_PLAY = 5;

const Listening = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
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
        setSelectedOption(null);
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
          return;
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

  const startGame = () => {
    setGameStatus(GameStatus.InProgress);
  };

  const restartGame = () => {
    // setTotalPoints(0);
    // setNumOfTonesPlayed(0);
    // setGameStatus(GameStatus.InProgress);
    window.location.reload();
  };

  const onAnswerSubmit = () => {
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
              totalSteps={5}
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
          </div>
        )}
        {gameStatus === GameStatus.Ended && <GameEnd totalPoints={totalPoints} onClick={restartGame} />}
      </>
    </PageWrapper>
  );
};

export default Listening;
