import React, { ReactElement, useRef } from "react";
import useNavigateWithTransition from "../../hooks/useNavigateWithTransition";
import "./home.scss";

const Home = (): ReactElement => {
  const [navigate] = useNavigateWithTransition();
  const pitchleRef = useRef<HTMLDivElement>(null);
  const listenRef = useRef<HTMLDivElement>(null);
  const singRef = useRef<HTMLDivElement>(null);
  const onLinkClick = (route: string, ref?: HTMLDivElement | null) => {
    return () => navigate(route);
  };
  return (
    <div className="home-content-wrapper">
      <div className="home-content">
        <div
          className="home-content_block home-content_block--big"
          ref={pitchleRef}
          onClick={onLinkClick("/pitchle", pitchleRef.current)}
        >
          <div className="home-content_block_inner" />
          <div className="home-content_desc">
            <h3>Pitchle</h3>
            <p>Guess every tone in a melody.</p>
          </div>
        </div>
        <div
          className="home-content_block home-content_block--small-up"
          ref={listenRef}
          onClick={onLinkClick("/listening", listenRef.current)}
        >
          <div className="home-content_block_inner" />
          <div className="home-content_desc">
            <h3>Listen</h3>
            <p>Recognize subtle differences.</p>
          </div>
        </div>
        <div
          className="home-content_block home-content_block--small-down"
          ref={singRef}
          onClick={onLinkClick("/singing", singRef.current)}
        >
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
