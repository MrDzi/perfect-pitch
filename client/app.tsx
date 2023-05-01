import React, { createContext, useState, ReactElement, Dispatch, SetStateAction, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import "./app.scss";
import { User } from "./types/types";

const Start = lazy(() => import("./pages/start"));
const Listening = lazy(() => import("./pages/listening"));
const Singing = lazy(() => import("./pages/singing"));
const Pitchle = lazy(() => import("./pages/pitchle"));

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
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/home" element={<Home />} />
              <Route path="/listening" element={<Listening />} />
              <Route path="/singing" element={<Singing />} />
              <Route path="/pitchle" element={<Pitchle />} />
            </Routes>
          </Suspense>
        </Router>
      </AppContext.Provider>
    </div>
  );
};

export default App;
