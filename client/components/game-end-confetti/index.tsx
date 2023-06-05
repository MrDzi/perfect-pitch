import React, { ReactElement, useEffect } from "react";
import JSConfetti from "js-confetti";

const GameEndConfetti = ({ showConfetti }: { showConfetti: boolean }): ReactElement => {
  useEffect(() => {
    if (showConfetti) {
      const jsConfetti = new JSConfetti();
      setTimeout(() => {
        jsConfetti.addConfetti({
          emojis: ["🎵", "🎉", "🎶", "🎷", "🪗", "🥁", "🎸", "🎼", "🎤", "🎧", "🎹", "🎺", "🎻"],
          confettiNumber: 150,
          emojiSize: 60,
        });
      }, 500);
      return () => {
        jsConfetti.clearCanvas();
      };
    }
  }, [showConfetti]);

  return <></>;
};

export default GameEndConfetti;
