import React, { ReactElement, useRef } from "react";
import { useDetectPitch } from "./pitch";

const WIDTH = 700;
const HEIGHT = 500;

const Home = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [data, togglePitchDetectStarted] = useDetectPitch();

  console.log("from HOME", data);
  return (
    <div>
      <button onClick={togglePitchDetectStarted}>Toggle Pitch Detect</button>
      <div className="hello">{data?.note}</div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

export default Home;
