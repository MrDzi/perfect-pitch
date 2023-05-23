import React, { ReactElement, lazy, Suspense, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import "./app.scss";

const Listening = lazy(() => import("./pages/listening"));
const Singing = lazy(() => import("./pages/singing"));
const Pitchle = lazy(() => import("./pages/pitchle"));

const currentDate = new Date();
const date = ("0" + currentDate.getDate()).slice(-2);
const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
const year = currentDate.getFullYear();

const dateFormatted = `${date}/${month}/${year}`;

export type AppContextType = {
  date: string;
};

export const AppContext = createContext<AppContextType>({
  date: dateFormatted,
});

const App = (): ReactElement => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <AppContext.Provider
          value={{
            date: dateFormatted,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listening" element={<Listening />} />
            <Route path="/singing" element={<Singing />} />
            <Route path="/pitchle" element={<Pitchle />} />
          </Routes>
        </AppContext.Provider>
      </Suspense>
    </Router>
  );
};

export default App;
