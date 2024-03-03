import React, { ReactElement, useContext, useEffect } from "react";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import MicIcon from "./icons/mic";
import HeadphonesIcon from "./icons/headphones";
import CableIcon from "./icons/cable";
import { AppContext } from "../../app";
import "./home.scss";

const Home = (): ReactElement => {
  const [navigate] = useNavigateWithTransition();
  const appContext = useContext(AppContext);

  useEffect(() => {
    document.title = "Home | CheckYourPitch";
  }, []);

  const onLinkClick = (route: string) => {
    return () => navigate(route);
  };
  return (
    <div className="page page--home">
      <div className="home-content-wrapper">
        <div className="home-content">
          <div className="home-content_block home-content_block--big" onClick={onLinkClick("/pitchle")}>
            <CableIcon />
            <div className="home-content_block_inner" />
            <div className="home-content_desc">
              <h3>Pitchle</h3>
              <p>A musical twist of the Wordle game.</p>
              <p>{`Try to guess each tone in a melody for ${appContext.date}. You have 6 tries!`}</p>
            </div>
          </div>
          <div className="home-content_block home-content_block--small-up" onClick={onLinkClick("/sing")}>
            <MicIcon />
            <div className="home-content_block_inner" />
            <div className="home-content_desc">
              <h3>Can you sing this tone?</h3>
              <p>Repeat five random tones.</p>
            </div>
          </div>
          <div className="home-content_block home-content_block--small-down" onClick={onLinkClick("/listen")}>
            <HeadphonesIcon />
            <div className="home-content_block_inner" />
            <div className="home-content_desc">
              <h3>Are these tones the same?</h3>
              <p>Recognize subtle differences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
