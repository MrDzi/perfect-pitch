import React, { ReactElement } from "react";
import { Helmet } from "react-helmet";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import MicIcon from "./icons/mic";
import HeadphonesIcon from "./icons/headphones";
import CableIcon from "./icons/cable";
import "./home.scss";

const Home = (): ReactElement => {
  const [navigate] = useNavigateWithTransition();

  const onLinkClick = (route: string) => {
    return () => navigate(route);
  };

  return (
    <>
      <Helmet>
        <title>Pitch Training Games | CheckYourPitch - Free Ear Training</title>
        <meta
          name="description"
          content="Train your pitch with free online games! Play Pitchle (musical Wordle), test pitch accuracy, and improve your ear training skills. No download required."
        />
        <meta property="og:title" content="Pitch Training Games | CheckYourPitch - Free Ear Training" />
        <meta
          property="og:description"
          content="Train your perfect pitch with free online games! Play Pitchle (musical Wordle), test pitch accuracy, and improve your ear training skills."
        />
      </Helmet>
      <div className="page page--home">
        <div className="home-header">
          <h1 className="home-header_title">Check Your Pitch</h1>
          <h2 className="home-header_subtitle">♫ Train your ear. Play and improve. ♫</h2>
          <p className="home-header_desc">
            No downloads or sign‑ups. Just simple and fun effective ear‑training games you can enjoy instantly in your
            browser.
          </p>
        </div>
        <div className="home-content-wrapper">
          <div className="home-content">
            <div className="home-content_block home-content_block--big" onClick={onLinkClick("/sing")}>
              <MicIcon />
              <div className="home-content_desc">
                <h3>Can you sing this tone?</h3>
                <p>Test your pitch accuracy by singing back five random tones. See how close you can match them!</p>
              </div>
              <button className="home-content_cta button button--small">Play Now</button>
            </div>
            <div className="home-content_block home-content_block--small-up" onClick={onLinkClick("/pitchle")}>
              <CableIcon />
              <div className="home-content_desc">
                <h3>Pitchle</h3>
                <p>
                  A musical twist on Wordle. Listen carefully and guess each note in today’s melody - you have six
                  tries!
                </p>
              </div>
              <button className="home-content_cta button button--small">Play Now</button>
            </div>
            <div className="home-content_block home-content_block--small-down" onClick={onLinkClick("/listen")}>
              <HeadphonesIcon />
              <div className="home-content_desc">
                <h3>How good is your ear?</h3>
                <p>
                  Challenge yourself to spot subtle pitch differences. Which tone is higher, lower, or exactly the same?
                </p>
              </div>
              <button className="home-content_cta button button--small">Play Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
