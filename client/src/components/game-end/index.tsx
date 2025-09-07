import React, { ReactElement, memo } from "react";
import "./game-end.scss";

interface GameEndProps {
  totalPoints: number;
  onClick: () => void;
  withPercentage?: boolean;
}

const GameEnd = memo(({ totalPoints, onClick, withPercentage = false }: GameEndProps): ReactElement => {
  return (
    <div className="game-end full-size flex flex-center">
      <div className="flex flex-column flex-center">
        <div className="flex margin-bottom">
          <div className="flex flex-center">
            <span>Score:</span>
            <span className="points">{`${totalPoints}${withPercentage ? "%" : ""}`}</span>
          </div>
        </div>
        <button className="button button--secondary" onClick={onClick} style={{ width: 250, marginTop: 50 }}>
          Try Again
        </button>
      </div>
    </div>
  );
});

GameEnd.displayName = "GameEnd";

export default GameEnd;
