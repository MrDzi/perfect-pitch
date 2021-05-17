import React, { ReactElement } from "react";
import Microphone from "./icons/microphone";
import SineWave from "./icons/sine-wave";

interface HeaderProps {
  step: number;
  counter: number | null;
  totalPoints: number;
  points: number | null;
  isNotePlayed: boolean;
  isSingingMode?: boolean;
  totalSteps?: number;
  onRepeatClick: () => void;
}

const Header = ({
  step,
  totalSteps = 3,
  counter,
  totalPoints,
  points,
  isNotePlayed,
  onRepeatClick,
  isSingingMode = true,
}: HeaderProps): ReactElement => {
  console.log("points", points);
  return (
    <div className="game-header">
      <div className="flex flex-left">
        <div className="flex flex-column justify-space-between">
          <div style={{ height: "50px" }}>
            {step < totalSteps && (
              <span className="points">
                {step + 1}/{totalSteps}
              </span>
            )}
          </div>
          {counter === 0 && step < totalSteps && isNotePlayed && (
            <button className="button button--no-border" onClick={onRepeatClick}>
              REPEAT NOTE{isSingingMode ? "" : "S"}
            </button>
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-center" style={{ height: "50px" }}>
          <div className="text-center">
            {counter !== 0 && step < totalSteps ? (
              <span className="points">{counter}</span>
            ) : isNotePlayed ? (
              isSingingMode ? (
                <Microphone />
              ) : null
            ) : (
              <span className="tone-icon">
                <SineWave />
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-right">
        <div className="flex flex-column position-relative">
          <div className="flex flex-center">
            <span>Score: </span>
            <span className="points">{totalPoints}%</span>
          </div>
          {points !== null ? <div className="points new-points">{`+${points}%`}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
