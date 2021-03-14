import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Game from "./game";
import { baseURL } from "./constants";

const app = () => {
  useEffect(() => {
    fetch(`${baseURL}/api/test`).then((response) => {
      console.log("from frontend", response);
    });
  }, []);
  return <Game />;
};

const App = React.createElement(app);

ReactDOM.render(App, document.getElementById("app"));
