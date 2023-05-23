import React, { ReactElement } from "react";
import sineWaveGif from "./audio-wave.gif";

const AudioWave = ({ width }: { width?: number }): ReactElement => <img width={width || 30} src={sineWaveGif} />;

export default AudioWave;
