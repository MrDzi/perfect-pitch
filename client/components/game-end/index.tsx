import React, { ReactElement, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { HighScoresList } from "../../app";
import { API_URL } from "../../types/declarations";
import useFetch from "../../hooks/useFetch";
import { AppContext } from "../../app";
import { GameMode, HttpMethods } from "../../types/types";

interface UserResponse {
  userName: string;
  _id: string;
  score: number;
  date: Date;
}

const GameEnd = ({
  totalPoints,
  onClick,
  mode,
  withPercentage = false,
}: {
  totalPoints: number;
  onClick: () => void;
  mode: GameMode;
  withPercentage?: boolean | undefined;
}): ReactElement => {
  const [user, setUser] = useContext(AppContext);
  const [data] = useFetch<UserResponse>({
    url: `${API_URL}/scores`,
    method: HttpMethods.POST,
    body: {
      userName: user.name,
      score: totalPoints,
      date: Date.now(),
    },
    params: { gameMode: mode },
  });
  const [highScoresList, highScoresListError, highScoresListLoaded] = useFetch<HighScoresList[]>({
    url: `${API_URL}/scores`,
    method: HttpMethods.GET,
    params: { gameMode: mode },
    wait: data === null,
  });

  useEffect(() => {
    if (data) {
      setUser({
        ...user,
        id: data._id,
      });
    }
  }, [data]);

  return (
    <div className="full-size flex flex-center" style={{ width: 600, margin: "0 auto", textAlign: "center" }}>
      <div className="flex flex-column flex-center">
        <div className="flex margin-bottom">
          <div className="flex flex-center">
            <span>Score:</span>
            <span className="points">{`${totalPoints}${withPercentage ? "%" : ""}`}</span>
          </div>
        </div>
        {highScoresList && highScoresListLoaded ? (
          <ol className="list">
            {highScoresList
              .sort((a, b) => b.score - a.score)
              .map((hs) => {
                const classes = `flex justify-space-between full-size ${hs._id === user.id ? "selected-item" : ""}`;
                return (
                  <li key={hs._id} className={classes}>
                    <span>{hs.userName}</span>
                    <span>{hs.score}%</span>
                  </li>
                );
              })}
          </ol>
        ) : (
          <div>Loading...</div>
        )}
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
