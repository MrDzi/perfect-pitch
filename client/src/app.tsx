import React, { ReactElement, lazy, Suspense, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import Home from "./pages/home";
import About from "./pages/about";
import PrivacyPolicy from "./pages/privacy-policy";
import PageWrapper from "./components/page-wrapper";
import "./app.scss";
import Header from "./components/header";

const Listening = lazy(() => import("./pages/listening"));
const Singing = lazy(() => import("./pages/singing"));
const Pitchle = lazy(() => import("./pages/pitchle"));

const currentDate = new Date();
const date = ("0" + currentDate.getDate()).slice(-2);
const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
const year = currentDate.getFullYear();

const dateFormatted = `${date}/${month}/${year}`;
const dateUnformatted = `${date}${month}${year}`;

export type AppContextType = {
  date: string;
  dateUnformatted: string;
};

export const AppContext = createContext<AppContextType>({
  date: dateFormatted,
  dateUnformatted,
});

const getFallbackElement = () => (
  <PageWrapper>
    <div className="flex flex-center full-size">
      <PulseLoader color="#678e3e" />
    </div>
  </PageWrapper>
);

const App = (): ReactElement => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Suspense fallback={getFallbackElement()}>
            <AppContext.Provider
              value={{
                date: dateFormatted,
                dateUnformatted,
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/listen" element={<Listening />} />
                <Route path="/sing" element={<Singing />} />
                <Route path="/pitchle" element={<Pitchle />} />
              </Routes>
            </AppContext.Provider>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;
