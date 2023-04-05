import React, { useState, useEffect, useRef, ReactElement, ChangeEvent, useContext, KeyboardEvent } from "react";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import { AppContext } from "../../app";
import "./start.scss";

const Start = (): ReactElement => {
  const [inputValue, setInputValue] = useState("");
  const [navigate] = useNavigateWithTransition();
  const inputRef = useRef<HTMLInputElement>(null);
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
    if (!inputValue || !inputValue.length) {
      return;
    }
    window.localStorage.setItem("PERFECT_PITCH_USER", inputValue);
    setUser((u) => ({
      id: u.id,
      name: inputValue,
    }));
    navigate("/home");
  };

  const handleKeypress = (e: KeyboardEvent) => {
    //it triggers by pressing the enter key
    if (e.code === "Enter") {
      onStartClick();
    }
  };

  return (
    <div className="page">
      <div className="start-content">
        <div className="flex flex-center">
          <h1>Test your pitch, </h1>
          <form autoComplete="off">
            <input max={25} ref={inputRef} id="name" name="name" onChange={onInputChange} placeholder="Name" />
          </form>
        </div>
        <button className="button" onClick={onStartClick} onKeyUp={handleKeypress}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Start;
