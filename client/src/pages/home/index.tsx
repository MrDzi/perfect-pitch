import React, { ReactElement, useEffect } from "react";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import MicIcon from "./icons/mic";
import HeadphonesIcon from "./icons/headphones";
import CableIcon from "./icons/cable";
import "./home.scss";

const Home = (): ReactElement => {
  const [navigate] = useNavigateWithTransition();

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
              <p>A musical twist on Wordle. Guess each tone in today&apos;s melody!</p>
            </div>
            <span className="home-content_cta button button--small">Play Now</span>
          </div>
          <div className="home-content_block home-content_block--small-up" onClick={onLinkClick("/sing")}>
            <MicIcon />
            <div className="home-content_block_inner" />
            <div className="home-content_desc">
              <h3>Can you sing this tone?</h3>
              <p>Test your pitch accuracy by repeating five random tones.</p>
            </div>
            <span className="home-content_cta button button--small">Play Now</span>
          </div>
          <div className="home-content_block home-content_block--small-down" onClick={onLinkClick("/listen")}>
            <HeadphonesIcon />
            <div className="home-content_block_inner" />
            <div className="home-content_desc">
              <h3>How good is your ear?</h3>
              <p>Challenge your listening skills by recognizing small pitch differences.</p>
            </div>
            <span className="home-content_cta button button--small">Play Now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
