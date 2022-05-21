import React, { createContext, useState, ReactElement, Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Start from "./pages/start";
import Home from "./pages/home";
import Listening from "./pages/listening";
import Singing from "./pages/singing";
import "./app.scss";

export interface HighScoresList {
  _id: string;
  date: Date;
  userName: string;
  score: number;
}

interface User {
  id: string | null;
  name: string | null;
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
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
};

export default App;
