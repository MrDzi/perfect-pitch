import React, { ReactElement } from "react";

const Ended = ({ totalPoints, onClick }: { totalPoints: number; onClick: () => void }): ReactElement => (
  <div className="flex flex-center flex-column full-size">
    <div className="flex flex-center margin-bottom">
      <span>Total points: </span>
      <span className="points">{totalPoints}</span>
    </div>
    <button onClick={onClick}>Try Again</button>
  </div>
);

export default Ended;
