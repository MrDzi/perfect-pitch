import React, { ReactElement } from "react";
import "./game-end.scss";

const GameEnd = ({
  totalPoints,
  onClick,
  withPercentage = false,
}: {
  totalPoints: number;
  onClick: () => void;
  withPercentage?: boolean | undefined;
}): ReactElement => {
  return (
    <div className="game-end full-size flex flex-center">
      <div className="flex flex-column flex-center">
        <div className="flex margin-bottom">
          <div className="flex flex-center">
            <span className="points">{`${totalPoints}${withPercentage ? "%" : ""}`}</span>
          </div>
        </div>
        <button className="button button--secondary" onClick={onClick} style={{ width: 250, marginTop: 50 }}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default GameEnd;
