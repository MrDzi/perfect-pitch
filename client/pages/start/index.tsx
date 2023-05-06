import React, { useState, useEffect, useRef, ReactElement, ChangeEvent, useContext, FormEvent } from "react";
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onStartClick();
  };

  return (
    <div className="page page--start">
      <div className="page--start_content-wrapper">
        <div className="flex">
          <h1>Test your pitch, </h1>
          <form onSubmit={handleSubmit} autoComplete="off">
            <input max={25} ref={inputRef} id="name" name="name" onChange={onInputChange} placeholder="Name" />
          </form>
        </div>
        <button className="button" onClick={onStartClick}>
          Start
        </button>
      </div>
    </div>
  );
};

export default Start;
