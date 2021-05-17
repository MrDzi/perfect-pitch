import React, { useState, useEffect, useRef, ReactElement, ChangeEvent, useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../app";

const Start = (): ReactElement => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const [, setUser] = useContext(AppContext);

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
    if (inputValue) {
      setUser((u) => ({
        id: u.id,
        name: inputValue,
      }));
    }
    history.push("/home");
  };

  return (
    <div className="flex flex-center full-size">
      <div className="landing-content">
        <h1>Test your ear</h1>
        <p>To start, write your name bellow</p>
        <input max={25} ref={inputRef} id="name" name="name" onChange={onInputChange} />
        <button className="button" onClick={onStartClick}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Start;
