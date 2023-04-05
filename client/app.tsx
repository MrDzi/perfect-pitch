import React, { createContext, useState, ReactElement, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Start from "./pages/start";
import Home from "./pages/home";
import Listening from "./pages/listening";
import Singing from "./pages/singing";
import "./app.scss";
import { User } from "./types/types";
import Pitchle from "./pages/pitchle";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

export const AppContext = createContext<[User, Dispatch<SetStateAction<User>> | (() => void)]>([
  {
    id: null,
    name: null,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

const App = (): ReactElement => {
  const userFromLocalStorage = window.localStorage.getItem("PERFECT_PITCH_USER");
  const userInitialState = {
    id: null,
    name: userFromLocalStorage || null,
  };
  const [user, setUser] = useState<User>(userInitialState);

  console.log("USER", user);

  return (
    <div className="wrapper full-size">
      <AppContext.Provider value={[user, setUser]}>
        <Router>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/home" element={<Home />} />
            <Route path="/listening" element={<Listening />} />
            <Route path="/singing" element={<Singing />} />
            <Route path="/pitchle" element={<Pitchle />} />
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
};

export default App;
