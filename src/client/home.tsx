import React, { ReactElement, useEffect, useRef } from "react";
import useDetectPitch from "./useDetectPitch";
import usePlayer from "./usePlayer";

const WIDTH = 700;
const HEIGHT = 500;

const Home = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [note, playRandomNote] = usePlayer();
  const [finalData, setTargetNote, points] = useDetectPitch();

  useEffect(() => {
    if (note) {
      console.log("from home tone index", note);
      setTargetNote(note);
    }
  }, [note]);

  console.log("from HOME", points);

  return (
    <div>
      <button onClick={playRandomNote}>Play Random Tone</button>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

export default Home;
