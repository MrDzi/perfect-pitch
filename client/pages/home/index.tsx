import React, { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
// import { AppContext } from "../../app";
import Sing from "./icons/listen";
import Listen from "./icons/sing";

const Home = (): ReactElement => {
  // const [user] = useContext(AppContext);
  const [hovered, setHovered] = useState(1);

  return (
    <div className="full-size flex flex-center">
      <div style={{ width: 700, height: "80vh" }}>
        <div className={`parent hovered-${hovered}`}>
          <div className="child1" onMouseEnter={() => setHovered(1)}>
            <Link to="/singing">
              <div className="overlay flex flex-center">
                {hovered === 1 && (
                  <div className="child-desc">
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
          <div className="child2" onMouseEnter={() => setHovered(2)}>
            <Link to="/listening">
              <div className="overlay flex flex-center">
                {hovered === 2 && (
                  <div className="child-desc">
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
