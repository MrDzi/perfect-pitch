import React, { ReactElement } from "react";
import sineWaveGif from "./audio-wave.gif";

const AudioWave = ({ width }: { width?: number }): ReactElement => <img width={width || 35} src={sineWaveGif} />;

export default AudioWave;
