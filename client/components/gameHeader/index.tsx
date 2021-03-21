import React, { ReactElement } from "react";
import Microphone from "./icons/microphone";
import SoundWave from "./icons/sound-wave";

interface GameHeaderProps {
  numOfTonesPlayed: number;
  counter: number | null;
  playLastNote: () => void;
  totalPoints: number;
  points: number | null;
  isNotePlayed: boolean;
}

const GameHeader = ({
  numOfTonesPlayed,
  counter,
  playLastNote,
  totalPoints,
  points,
  isNotePlayed,
}: GameHeaderProps): ReactElement => {
  return (
    <div className="game-header">
      <div className="flex flex-left">
        <div>
          <p>Tone {numOfTonesPlayed + 1} of 10</p>
        </div>
      </div>
      <div>
        <div className="flex flex-center" style={{ height: "50px" }}>
          <div className="text-center">
            {counter !== 0 && numOfTonesPlayed < 3 ? (
              <span>{counter}</span>
            ) : isNotePlayed ? (
              <Microphone />
            ) : (
              <span onClick={playLastNote} className="tone-icon">
                <SoundWave />
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-right">
        <div className="flex flex-column position-relative">
          <div className="flex flex-center">
            <span>Total points: </span>
            <span className="points">{totalPoints}</span>
          </div>
          {counter && points && numOfTonesPlayed ? <div className="points new-points">{`+${points}`}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
