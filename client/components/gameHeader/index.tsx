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
        <div className="flex flex-column justify-space-between">
          <div style={{ height: "50px" }}>
            {numOfTonesPlayed < 3 && <span className="points">{numOfTonesPlayed + 1}/3</span>}
          </div>
          {counter === 0 && numOfTonesPlayed < 3 && isNotePlayed && (
            <button className="button button--no-border" onClick={playLastNote}>
              REPEAT NOTE
            </button>
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-center" style={{ height: "50px" }}>
          <div className="text-center">
            {false ? (
              <span className="points">{counter}</span>
            ) : false ? (
              <Microphone />
            ) : (
              <span className="tone-icon">
                <SoundWave />
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-right">
        <div className="flex flex-column position-relative">
          <div className="flex flex-center">
            <span>Points: </span>
            <span className="points">{totalPoints}</span>
          </div>
          {points !== null ? <div className="points new-points">{`+${points}`}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
