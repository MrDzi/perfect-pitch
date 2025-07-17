import React, { useState, ReactElement, useEffect, ChangeEvent } from "react";
import cx from "classnames";
import Header from "../../components/game-header";
import GameEnd from "../../components/game-end";
import useListeningPlayer from "../../hooks/useListeningPlayer";
import { GameStatus, TonesRelation } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";
import "./listening.scss";

const NUM_OF_TONES_TO_PLAY = 5;
const COUNTER_START_VALUE = 3;

const Listening = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
  const [points, setPoints] = useState<number | null>(null);
  const [numOfTonesPlayed, setNumOfTonesPlayed] = useState<number>(0);
  const [counter, setCounter] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [playTones, repeatTones, tonesPlayingFinished, tonesRelation, initiateAudioContext] = useListeningPlayer();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, isSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Listening | CheckYourPitch - Free Ear Training";
  }, []);

  useEffect(() => {
    if (points === null) {
      return;
    }
    setTimeout(() => {
      setNumOfTonesPlayed((n) => n + 1);
      setTotalPoints((p) => p + points);
      setSelectedOption(null);
      setPoints(null);
      setCounter(COUNTER_START_VALUE);
      isSubmitted(false);
    }, 2000);
  }, [points]);

  useEffect(() => {
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
        playTones();
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
    initiateAudioContext();
    setGameStatus(GameStatus.InProgress);
  };

  const restartGame = () => {
    setTotalPoints(0);
    setNumOfTonesPlayed(0);
    setGameStatus(GameStatus.InProgress);
  };

  const onAnswerSubmit = () => {
    isSubmitted(true);
    setPoints(tonesRelation === selectedOption ? 1 : 0);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(e.target.value, 10));
  };

  return (
    <PageWrapper withBackButton>
      <>
        {gameStatus !== GameStatus.Ended && (
          <div className="listening-page">
            <Header
              currentStep={numOfTonesPlayed + 1}
              counter={counter}
              points={points}
              totalSteps={NUM_OF_TONES_TO_PLAY}
              totalPoints={totalPoints}
              isNotePlayed={tonesPlayingFinished}
              onRepeatClick={repeatTones}
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
                      highlighted: submitted && tonesRelation === TonesRelation.FirstHigher,
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
                      highlighted: submitted && tonesRelation === TonesRelation.SecondHigher,
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
                      highlighted: submitted && tonesRelation === TonesRelation.Identical,
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
