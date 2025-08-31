import React, { ReactElement, memo, useMemo } from "react";
import cx from "classnames";
import PitchIcon from "./icons/pitch";
import "./pitch-visualization.scss";

interface PitchVisualizationProps {
  detune: number | null;
  shouldVisualize: boolean;
  progress: number;
}

const PitchVisualization = memo(({ detune, shouldVisualize, progress }: PitchVisualizationProps): ReactElement => {
  const isInCenter = useMemo(
    () => shouldVisualize && detune !== null && detune > -25 && detune < 25,
    [shouldVisualize, detune]
  );

  const progressBarStyle = useMemo(
    () => ({
      transform: `translateX(${-200 + progress * 2}px)`,
    }),
    [progress]
  );

  const targetStyle = useMemo(() => (isInCenter ? { background: "#6A994E" } : {}), [isInCenter]);

  const pitchIndicatorStyle = useMemo(
    () => ({
      transform: `translateX(${detune || 0}px)`,
    }),
    [detune]
  );

  return (
    <div className="pitch-visualization">
      <div className="pitch-visualization_progress">
        <div className="pitch-visualization_progress-bar-wrapper">
          <div className="pitch-visualization_progress-bar" style={progressBarStyle} />
        </div>
        {/* <div className="pitch-visualization_progress-bar-number">{`${progress}%`}</div> */}
      </div>
      <div className="pitch-visualization_pitch">
        <div className="target" style={targetStyle} />
        <div className="line">
          <div className="pitch-indicator-wrapper" style={pitchIndicatorStyle}>
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
});

PitchVisualization.displayName = "PitchVisualization";

export default PitchVisualization;
