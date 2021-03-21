import React, { CSSProperties, ReactElement } from "react";
import PitchIcon from "./icons/pitch";

interface PitchVisualizationProps {
  volume: number;
  detune: number | null;
  counter: number | null;
}

const getPitchIndicatorStyles = ({ detune, volume }: { detune: number | null; volume: number }): CSSProperties => {
  if (detune === null) {
    return { transform: `scaleX(1.7) scaleY(${volume}px)` };
  }
  return { transform: `translateX(${detune}px) scaleX(1.7) scaleY(${volume})` };
};

const PitchVisualization = ({ volume, detune, counter }: PitchVisualizationProps): ReactElement => {
  const isInCenter = counter === 0 && volume && detune && detune > -10 && detune < 10;

  return (
    <div className="game-visualization">
      <div className="target" style={isInCenter ? { background: "#2A9D8F" } : {}} />
      <div className="line">
        <div
          className="pitch-indicator"
          style={getPitchIndicatorStyles({ detune, volume: counter !== null && counter === 0 ? volume : 0 })}
        >
          <PitchIcon />
        </div>
      </div>
    </div>
  );
};

export default PitchVisualization;
