import React, { ReactElement, memo } from "react";
import { Stats as StatsType } from "../../pages/pitchle";
import "./stats.scss";

interface StatsProps {
  data: StatsType;
}

const Stats = memo(({ data }: StatsProps): ReactElement => {
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
});

Stats.displayName = "Stats";

export default Stats;
