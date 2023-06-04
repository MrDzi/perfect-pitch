import React, { ReactElement, useEffect } from "react";
import JSConfetti from "js-confetti";

const GameEndConfetti = (): ReactElement => {
  useEffect(() => {
    const jsConfetti = new JSConfetti();
    setTimeout(() => {
      jsConfetti.addConfetti({
        emojis: ["🎵", "🎉", "🎶", "🎷", "🪗", "🥁", "🎸", "🎼", "🎤", "🎧", "🎹", "🎺", "🎻"],
        confettiNumber: 150,
        emojiSize: 60,
      });
    }, 1500);
    return () => {
      jsConfetti.clearCanvas();
    };
  }, []);

  return <div />;
};

export default GameEndConfetti;
