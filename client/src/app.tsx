import React, { ReactElement, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsConditions from "./pages/terms-conditions";
import Blog from "./pages/blog";
import PageWrapper from "./components/page-wrapper";
import "./app.scss";
import Header from "./components/header";
import Footer from "./components/footer";

// Import components directly for better react-snap compatibility
import Listening from "./pages/listening";
import Singing from "./pages/singing";
import Pitchle from "./pages/pitchle";

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

const App = (): ReactElement => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
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
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/listen" element={<Listening />} />
              <Route path="/sing" element={<Singing />} />
              <Route path="/pitchle" element={<Pitchle />} />
            </Routes>
          </AppContext.Provider>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
