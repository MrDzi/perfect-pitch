import React, { ReactElement } from "react";
import Microphone from "./icons/microphone";
import AudioWave from "./icons/sine-wave";
import "./game-header.scss";
import { GameStatus } from "../../types/types";

interface GameHeaderProps {
  currentStep: number;
  counter: number | null;
  totalPoints: number;
  points: number | null;
  isNotePlayed: boolean;
  gameStatus?: GameStatus;
  isSingingMode?: boolean;
  withPercentage?: boolean;
  totalSteps?: number;
  onRepeatClick: () => void;
  onStartClick?: () => void;
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
  onStartClick,
  onRepeatClick,
  gameStatus,
  isSingingMode = false,
  withPercentage = false,
}: GameHeaderProps): ReactElement => {
  const getCentralComponent = () => {
    if (gameStatus !== undefined && gameStatus === GameStatus.NotStarted) {
      return (
        <button className="button button--no-border" onClick={onStartClick}>
          Click here to start
        </button>
      );
    }
    if (counter !== 0 && currentStep <= totalSteps) {
      return <span className="game-header_points">{counter}</span>;
    }
    if (isNotePlayed) {
      if (isSingingMode) {
        return <Microphone />;
      }
      return null;
    }
    return <AudioWave width={45} />;
  };

  console.log("points", points);
  console.log("currentStep", currentStep);
  return (
    <div className="game-header">
      <div className="flex flex-left">
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
        <div className="flex flex-center" style={{ height: "50px" }}>
          <div className="text-center">{getCentralComponent()}</div>
        </div>
      </div>
      <div className="flex flex-right">
        <div className="flex flex-column position-relative">
          <div className="flex flex-center">
            <span>Score: </span>
            <span className="game-header_points">{`${totalPoints}${withPercentage ? "%" : ""}`}</span>
          </div>
          {points !== null && currentStep !== 0 ? (
            <div className="game-header_points game-header_new-points">{`+${points}${withPercentage ? "%" : ""}`}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
