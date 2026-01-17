import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./src/app";

const container = document.getElementById("app");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
if (container!.hasChildNodes()) {
  hydrateRoot(container!, <App />);
} else {
  const root = createRoot(container!);
  root.render(<App />);
}
