import React, { ReactElement, useEffect } from "react";
import JSConfetti from "js-confetti";

const GameEndConfetti = (): ReactElement => {
  useEffect(() => {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ["🎵", "🎉", "🎶", "🎷", "🪗", "🥁", "🎸", "🎼", "🎤", "🎧", "🎹", "🎺", "🎻"],
      confettiNumber: 150,
      emojiSize: 60,
    });
    return () => {
      console.log("CLEAR CANVAS!");
      jsConfetti.clearCanvas();
    };
  }, []);

  return <div />;
};

export default GameEndConfetti;
