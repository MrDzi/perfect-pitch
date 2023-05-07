import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

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
    <div className="full-size flex flex-center" style={{ width: 600, margin: "0 auto", textAlign: "center" }}>
      <div className="flex flex-column flex-center">
        <div className="flex margin-bottom">
          <div className="flex flex-center">
            <span>Score:</span>
            <span className="points">{`${totalPoints}${withPercentage ? "%" : ""}`}</span>
          </div>
        </div>
        <button className="button" onClick={onClick} style={{ width: 300, marginTop: 50 }}>
          Try Again
        </button>
        <Link to="/home">
          <button className="button" onClick={onClick} style={{ width: 300, marginTop: 15 }}>
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GameEnd;
