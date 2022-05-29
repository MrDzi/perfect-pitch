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

const userInitialState = {
  id: null,
  name: null,
};

export const AppContext = createContext<[User, Dispatch<SetStateAction<User>> | (() => void)]>([
  userInitialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

const App = (): ReactElement => {
  const [user, setUser] = useState<User>(userInitialState);

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
