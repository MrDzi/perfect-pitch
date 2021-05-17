import React, { ReactElement } from "react";

const SineWave = (): ReactElement => (
  <svg width="110px" height="120px" viewBox="10 -80 300 320" className="sine-wave">
    <g className="group">
      <path
        d="M 10 80 C 40 10 65 10 95 80 S 150 150 180 80 C 210 10 235 10 265 80 S 320 150 350 80 C 380 10 405 10 435 80 S 490 150 520 80 C 550 10 575 10 605 80 S 660 150 690 80 C 720 10 745 10 775 80 S 830 150 860 80"
        stroke="#EAAC8B"
        strokeWidth="5"
        fill="transparent"
      />
    </g>
  </svg>
);

export default SineWave;
