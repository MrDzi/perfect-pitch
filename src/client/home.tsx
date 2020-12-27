import React, { ReactElement, useEffect, useRef } from "react";
import useDetectPitch from "./useDetectPitch";
import usePlayer from "./usePlayer";

const WIDTH = 700;
const HEIGHT = 500;

const Home = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [noteData, playRandomNote] = usePlayer();
  const [startPitchDetection, finalNote, points] = useDetectPitch();

  useEffect(() => {
    console.log("NOTE DATA::: ", noteData);
    if (noteData.note && noteData.played) {
      console.log("from home tone index", noteData.note);
      startPitchDetection(noteData.note);
    }
  }, [noteData]);

  console.log("from HOME", points);

  return (
    <div>
      <button onClick={playRandomNote}>Play Random Tone</button>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  );
};

export default Home;
