import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import "./home.scss";

const Home = (): ReactElement => {
  return (
    <div className="home-content-wrapper">
      <div className="home-content">
        <div className="home-content_block home-content_block--big">
          <div className="home-content_block_inner" />
          <Link to="/singing">
            <div className="home-content_desc">
              <h3>Sing</h3>
              <p>Sing five randomly given tones as precisely as possible.</p>
            </div>
          </Link>
        </div>
        <div className="home-content_block home-content_block--small-up">
          <div className="home-content_block_inner" />
          <Link to="/listening">
            <div className="home-content_desc">
              <h3>Listen</h3>
              <p>Recognize subtle differences.</p>
            </div>
          </Link>
        </div>
        <div className="home-content_block home-content_block--small-down">
          <div className="home-content_block_inner" />
          <Link to="/pitchle">
            <div className="home-content_desc">
              <h3>Pitchle</h3>
              <p>Play the music version of the famous game.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
