import React, { ReactElement } from "react";
import Microphone from "./icons/microphone";
import SineWave from "./icons/sine-wave";
import "./game-header.scss";

interface GameHeaderProps {
  currentStep: number;
  counter: number | null;
  totalPoints: number;
  points: number | null;
  isNotePlayed: boolean;
  isSingingMode?: boolean;
  totalSteps?: number;
  onRepeatClick: () => void;
}

const shouldRenderRepeatButton = (
  counter: number | null,
  currentStep: number,
  totalSteps: number,
  isNotePlayed: boolean
): boolean => counter === 0 && currentStep <= totalSteps && isNotePlayed;

const Header = ({
  currentStep,
  totalSteps = 3,
  counter,
  totalPoints,
  points,
  isNotePlayed,
  onRepeatClick,
  isSingingMode = false,
}: GameHeaderProps): ReactElement => {
  console.log(currentStep, totalSteps);
  return (
    <div className="game-header">
      <div className="flex flex-left padding">
        <div className="flex flex-column justify-space-between">
          <div style={{ height: "50px" }}>
            {currentStep <= totalSteps && (
              <span className="points">
                {currentStep}/{totalSteps}
              </span>
            )}
          </div>
          {shouldRenderRepeatButton(counter, currentStep, totalSteps, isNotePlayed) && (
            <button className="button button--no-border" onClick={onRepeatClick}>
              REPEAT NOTE{isSingingMode ? "" : "S"}
            </button>
          )}
        </div>
      </div>
      <div>
        <div className="flex flex-center padding" style={{ height: "50px" }}>
          <div className="text-center">
            {counter !== 0 && currentStep <= totalSteps ? (
              <span className="game-header_points">{counter}</span>
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
      <div className="flex flex-right padding">
        <div className="flex flex-column position-relative">
          <div className="flex flex-center">
            <span>Score: </span>
            <span className="game-header_points">{totalPoints}%</span>
          </div>
          {points !== null ? <div className="game-header_points game-header_new-points">{`+${points}%`}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
