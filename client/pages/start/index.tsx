import React, { useState, useEffect, useRef, ReactElement, ChangeEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../app";
import "./start.scss";

const Start = (): ReactElement => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
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
    setUser((u) => ({
      id: u.id,
      name: inputValue,
    }));
    navigate("/home");
  };

  return (
    <div className="page">
      <div className="start-content">
        <h1>Test your pitch</h1>
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
