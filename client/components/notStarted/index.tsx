import React, { ReactElement } from "react";

const NotStarted = ({ onClick }: { onClick: () => void }): ReactElement => (
  <div className="flex flex-center full-size">
    <div className="landing-content">
      <h1>Test Your Pitch</h1>
      <p>
        After clicking on “Start”, you will hear a random tone. You need repeat the same tone for at least 1 second, in
        any octave. Each tone brings a maximum of 100 points. You will hear 3 tones in total.
      </p>
      <button onClick={onClick}>Start Game</button>
    </div>
  </div>
);

export default NotStarted;
