import React, { useState, useEffect, useRef, ReactElement, ChangeEvent, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../app";

const Home = (): ReactElement => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const [user, setUser] = useContext(AppContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const onStartClick = () => {
    if (!inputValue.length) {
      return;
    }
    if (inputValue && setUser) {
      setUser((u) => ({
        id: u.id,
        name: inputValue,
      }));
    }
    history.push("/pitch-detect");
  };

  return (
    <div className="flex flex-center full-size">
      <div className="landing-content">
        <h1>test your pitch</h1>
        <p>
          Turn on the sound and make sure there is no noise in the room.
          <br />
          You wll hear a random tone which you should repeat.
          <br />
          Each tone brings a maximum of 100 points.
          <br />
          Write your name bellow and hit that Start button!
        </p>
        <input max={25} ref={inputRef} id="name" name="name" onChange={onInputChange} />
        <button className="button" onClick={onStartClick}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Home;
