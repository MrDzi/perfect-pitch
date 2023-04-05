import React, { ReactElement } from "react";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import "./home.scss";

const Home = (): ReactElement => {
  const [navigate] = useNavigateWithTransition();
  const onLinkClick = (route: string) => {
    return () => navigate(route);
  };
  return (
    <div className="home-content-wrapper">
      <div className="home-content">
        <div className="home-content_block home-content_block--big" onClick={onLinkClick("/pitchle")}>
          <div className="home-content_block_inner" />
          <div className="home-content_desc">
            <h3>Pitchle</h3>
            <p>Guess every tone in a melody.</p>
          </div>
        </div>
        <div className="home-content_block home-content_block--small-up" onClick={onLinkClick("/listening")}>
          <div className="home-content_block_inner" />
          <div className="home-content_desc">
            <h3>Listen</h3>
            <p>Recognize subtle differences.</p>
          </div>
        </div>
        <div className="home-content_block home-content_block--small-down" onClick={onLinkClick("/singing")}>
          <div className="home-content_block_inner" />
          <div className="home-content_desc">
            <h3>Sing</h3>
            <p>Sing five randomly given tones as precisely as possible.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
