import React, { ReactElement } from "react";

const NotStarted = ({ onClick }: { onClick: () => void }): ReactElement => (
  <div className="flex flex-center full-size">
    <div className="landing-content">
      <h1>Test Your Pitch</h1>
      <p>
        After clicking on “Start”, you will hear a random tone. You need sing or whistle the same tone in any octave.
        <br />
        You wll hear 3 tones in total, each tone can bring a maximum of 100 points.
        <br />
        Are you ready?
      </p>
      <button onClick={onClick}>Start Game</button>
    </div>
  </div>
);

export default NotStarted;
