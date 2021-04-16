import React, { ReactElement } from "react";
import { HighScoresList } from "../../app";

const Ended = ({
  totalPoints,
  highScoresList,
  userId,
  onClick,
}: {
  totalPoints: number;
  highScoresList: HighScoresList[];
  userId: string | null;
  onClick: () => void;
}): ReactElement => (
  <div className="full-size flex flex-center" style={{ width: 600, margin: "0 auto", textAlign: "center" }}>
    <div className="flex flex-column flex-center">
      <div className="flex margin-bottom">
        <div className="flex flex-center">
          <span>Score: </span>
          <span className="points">{totalPoints}%</span>
        </div>
      </div>
      <ol className="list">
        {highScoresList
          .sort((a, b) => b.score - a.score)
          .map((hs) => {
            const classes = `flex justify-space-between full-size ${hs._id === userId ? "selected-item" : ""}`;
            return (
              <li key={hs._id} className={classes}>
                <span>{hs.userName}</span>
                <span>{hs.score}%</span>
              </li>
            );
          })}
      </ol>
      <button className="button" onClick={onClick} style={{ width: 300, marginTop: 100 }}>
        Try Again
      </button>
    </div>
  </div>
);

export default Ended;
