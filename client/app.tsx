import React, { ReactElement, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import "./app.scss";

// const Start = lazy(() => import("./pages/start"));
const Listening = lazy(() => import("./pages/listening"));
const Singing = lazy(() => import("./pages/singing"));
const Pitchle = lazy(() => import("./pages/pitchle"));

const App = (): ReactElement => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* <Route path="/" element={<Start />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/singing" element={<Singing />} />
          <Route path="/pitchle" element={<Pitchle />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
