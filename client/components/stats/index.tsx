import React, { ReactElement } from "react";
import { Stats } from "../../pages/pitchle";
import "./stats.scss";

const Stats = ({ data }: { data: Stats }): ReactElement => {
  console.log("FROM STATS", data);
  return (
    <div className="stats">
      <div className="stats_header">
        <h2>Stats</h2>
      </div>
      <ul>
        <li>
          <div className="stats_item">
            <span>Games played</span>
            <span>{data.gamesPlayed}</span>
          </div>
        </li>
        <li>
          <div className="stats_item">
            <span>Wins</span>
            <span>{data.gamesWon}</span>
          </div>
        </li>
        <li>
          <div className="stats_item">
            <span>Success rate</span>
            <span>{`${data.winPercentage}%`}</span>
          </div>
        </li>
        <li>
          <div className="stats_item">
            <span>Current streak</span>
            <span>{data.streak}</span>
          </div>
        </li>
        <li>
          <div className="stats_item">
            <span>Max streak</span>
            <span>{data.maxStreak}</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Stats;
