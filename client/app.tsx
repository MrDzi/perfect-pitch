import React, { createContext, useState, ReactElement, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/home";
import PitchDetect from "./pages/pitch-detect";
import "./app.scss";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

// in production mode, API_URL will come from webpack
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const API_URL: string;

interface User {
  id: string | null;
  name: string | null;
}

const userInitialState = {
  id: null,
  name: null,
};

export const AppContext = createContext<[User, Dispatch<SetStateAction<User>> | null]>([userInitialState, null]);

const App = (): ReactElement => {
  const [user, setUser] = useState<User>(userInitialState);

  return (
    <div className="wrapper full-size">
      <AppContext.Provider value={[user, setUser]}>
        <Router>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/pitch-detect">
            <PitchDetect />
          </Route>
        </Router>
      </AppContext.Provider>
    </div>
  );
};

export default App;
