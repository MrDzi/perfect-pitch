import React, { ReactElement } from "react";

const SineWave = (): ReactElement => (
  <svg width="190px" height="120px" viewBox="10 -80 300 320" className="sine-wave">
    <g className="group">
      <path
        style={{ transform: "translateX(170px)" }}
        d="M10 80  C 40 10, 65 10, 95 80 S 150 150, 180 80"
        stroke="#EAAC8B"
        strokeWidth="5"
        fill="transparent"
      />
      <path d="M10 80  C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="#EAAC8B" strokeWidth="5" fill="transparent" />
      <path
        style={{ transform: "translateX(-170px)" }}
        d="M10 80  C 40 10, 65 10, 95 80 S 150 150, 180 80"
        stroke="#EAAC8B"
        strokeWidth="5"
        fill="transparent"
      />
      <path
        style={{ transform: "translateX(-340px)" }}
        d="M10 80  C 40 10, 65 10, 95 80 S 150 150, 180 80"
        stroke="#EAAC8B"
        strokeWidth="5"
        fill="transparent"
      />
      <path
        style={{ transform: "translateX(-510px)" }}
        d="M10 80  C 40 10, 65 10, 95 80 S 150 150, 180 80"
        stroke="#EAAC8B"
        strokeWidth="5"
        fill="transparent"
      />
    </g>
  </svg>
);

export default SineWave;
