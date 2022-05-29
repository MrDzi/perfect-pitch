import React, { CSSProperties, ReactElement } from "react";
import PitchIcon from "./icons/pitch";
import "./pitch-visualization.scss";

interface PitchVisualizationProps {
  volume: number;
  detune: number | null;
  shouldVisualize: boolean;
}

const getPitchIndicatorStyles = ({ detune, volume }: { detune: number | null; volume: number }): CSSProperties => {
  if (detune === null) {
    return { transform: `scaleX(1.15) scaleY(${volume > 0 ? 1 : 0}px)` };
  }
  return { transform: `translateX(${detune}px) scaleX(1.15) scaleY(${volume > 0 ? 1 : 0})` };
};

const PitchVisualization = ({ volume, detune, shouldVisualize }: PitchVisualizationProps): ReactElement => {
  const isInCenter = shouldVisualize && volume && detune && detune > -10 && detune < 10;

  return (
    <div className="game-visualization">
      <div className="target" style={isInCenter ? { background: "#2A9D8F" } : {}} />
      <div className="line">
        <div
          className="pitch-indicator"
          style={getPitchIndicatorStyles({ detune, volume: shouldVisualize ? volume : 0 })}
        >
          <PitchIcon />
        </div>
      </div>
    </div>
  );
};

export default PitchVisualization;
