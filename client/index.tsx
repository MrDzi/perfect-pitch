import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Game from "./game";

const app = () => {
  useEffect(() => {
    fetch("/api/test").then((response) => {
      console.log("from frontend", response);
    });
  }, []);
  return <Game />;
};

const App = React.createElement(app);

ReactDOM.render(App, document.getElementById("app"));
