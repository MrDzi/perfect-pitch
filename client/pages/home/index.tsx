import React, { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
// import { AppContext } from "../../app";
import Sing from "./icons/listen";
import Listen from "./icons/sing";
import "./home.scss";

const Home = (): ReactElement => {
  // const [user] = useContext(AppContext);
  const [hovered, setHovered] = useState("left");

  return (
    <div className="page">
      <div className="home-content-wrapper">
        <div className={`home-content hovered-${hovered}`}>
          <div className="home-content_block home-content_block--left" onMouseEnter={() => setHovered("left")}>
            <Link to="/singing">
              <div className="overlay flex flex-center padding">
                {hovered === "left" && (
                  <div className="home-content_desc">
                    <h3>Singing</h3>
                    <p>Practice singing by sdfs lasdfksa sdfjlkjasd sadflk sadf</p>
                  </div>
                )}
                <div>
                  <Listen />
                </div>
              </div>
            </Link>
          </div>
          <div className="home-content_block home-content_block--right" onMouseEnter={() => setHovered("right")}>
            <Link to="/listening">
              <div className="overlay flex flex-center padding">
                {hovered === "right" && (
                  <div className="home-content_desc">
                    <h3>Listening</h3>
                    <p>Practice listening by sdfs lasdfksa sdfjlkjasd sadflk sadf</p>
                  </div>
                )}
                <div>
                  <Sing />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
