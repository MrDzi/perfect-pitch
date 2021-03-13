import React, { useState, ReactElement, useEffect } from "react";
import useDetectPitch from "./hooks/useDetectPitch";
import usePlayer from "./hooks/usePlayer";
import PitchIndicator from "./pitch-indicator";
import { getPitchIndicatorStyles } from "./helpers";
import "./game.scss";

enum GameStatus {
  NotStarted,
  InProgress,
  Ended,
}

const Game = (): ReactElement => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NotStarted);
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
        if (numOfTonesPlayed === 4) {
          return setGameStatus(GameStatus.Ended);
        }
        playRandomNote();
      } else {
        setCounter(counter - 1);
      }
    }, 1000);
  }, [counter]);

  const startGame = () => {
    setTotalPoints(0);
    setNumOfTonesPlayed(0);
    setGameStatus(GameStatus.InProgress);
    setCounter(3);
  };

  const isInCenter = counter === 0 && volume && detune && detune > -10 && detune < 10;

  return (
    <div className="wrapper full-size">
      {gameStatus === GameStatus.NotStarted && (
        <div className="flex flex-center full-size">
          <div className="landing-content">
            <h1>Test Your Pitch</h1>
            <p>
              After clicking on “Start”, you will hear a random tone. You need repeat the same tone for at least 1
              second, in any octave. Each tone brings a maximum of 100 points. You will hear 5 tones in total.
            </p>
            <button onClick={startGame}>Start Game</button>
          </div>
        </div>
      )}
      {gameStatus === GameStatus.InProgress && (
        <div className="game full-size">
          <div className="game-header">
            <div className="flex flex-left">
              <div>
                <p>Tone {numOfTonesPlayed + 1} of 10</p>
              </div>
            </div>
            <div>
              <div className="flex flex-center">
                <div className="text-center">
                  <p>
                    {counter !== 0 && numOfTonesPlayed < 4 ? (
                      counter
                    ) : (
                      <span onClick={playLastNote} className="tone-icon">
                        beep!
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-right">
              <div className="flex flex-column position-relative">
                {totalPoints > 0 && (
                  <div className="flex flex-center">
                    <span>Total points: </span>
                    <span className="points">{totalPoints}</span>
                  </div>
                )}
                {counter && points && numOfTonesPlayed ? <div className="points new-points">{`+${points}`}</div> : null}
              </div>
            </div>
          </div>
          <div className="game-visualization">
            <div className="target" style={isInCenter ? { background: "#2A9D8F" } : {}} />
            <div className="line">
              <div className="pitch-indicator" style={getPitchIndicatorStyles(detune, volume, counter)}>
                <PitchIndicator />
              </div>
            </div>
          </div>
        </div>
      )}
      {gameStatus === GameStatus.Ended && (
        <div className="flex flex-center flex-column full-size">
          <div className="flex flex-center margin-bottom">
            <span>Total points: </span>
            <span className="points">{totalPoints}</span>
          </div>
          <button onClick={startGame}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default Game;
