import React, { ReactElement } from "react";
import cx from "classnames";
import PitchIcon from "./icons/pitch";
import "./pitch-visualization.scss";

interface PitchVisualizationProps {
  detune: number | null;
  shouldVisualize: boolean;
  progress: number;
}

const PitchVisualization = ({ detune, shouldVisualize, progress }: PitchVisualizationProps): ReactElement => {
  const isInCenter = shouldVisualize && detune && detune > -30 && detune < 30;

  return (
    <div className="pitch-visualization">
      <div className="pitch-visualization_progress">
        <div className="pitch-visualization_progress-bar-wrapper">
          <div
            className="pitch-visualization_progress-bar"
            style={{
              transform: `translateX(${-200 + progress * 2}px)`,
            }}
          />
        </div>
        {/* <div className="pitch-visualization_progress-bar-number">{`${progress}%`}</div> */}
      </div>
      <div className="pitch-visualization_pitch">
        <div className="target" style={isInCenter ? { background: "#6A994E" } : {}} />
        <div className="line">
          <div className="pitch-indicator-wrapper" style={{ transform: `translateX(${detune}px)` }}>
            <div
              className={cx("pitch-indicator", {
                "pitch-indicator--active": detune !== null,
              })}
            >
              <PitchIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchVisualization;
