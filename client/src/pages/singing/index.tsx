import React, { ReactElement, useEffect, useMemo } from "react";
import Header from "../../components/game-header";
import PitchVisualization from "./pitch-visualization";
import GameEnd from "../../components/game-end";
import usePlayer from "../../hooks/usePlayer";
import useDetectPitch from "../../hooks/useDetectPitch";
import useLocalStorage from "../../hooks/useLocalStorage";
import useGameState from "../../hooks/useGameState";
import { GameStatus } from "../../types/types";
import PageWrapper from "../../components/page-wrapper";
import "./singing.scss";

const getTotalPoints = (currentTotalPoints: number, numOfTonesPlayed: number) =>
  Math.round((numOfTonesPlayed === 0 ? 0 : currentTotalPoints / numOfTonesPlayed) * 10) / 10;

const NUM_OF_NOTES_TO_PLAY = 5;
const COUNTER_START_VALUE = 3;
const LOCAL_STORAGE_KEY = "singing_info_seen";

const getAccuracyLabel = (points: number, missType: "low" | "high" | undefined): string => {
  if (points === 100) return "P e r f e c t !";
  if (points >= 75) return "That was solid!";
  if (points >= 50) return missType ? `That was a little too ${missType === "low" ? "low" : "high"}` : "A little off";
  if (points > 0) return missType ? `That was too ${missType === "low" ? "low" : "high"}, keep trying!` : "Keep trying";

  return "";
};

const getPointsWon = (detune: number | null): number => {
  if (!detune) return 0;

  const absDetune = Math.abs(detune);
  const forgiveness = 12;

  if (absDetune <= forgiveness) return 100;
  if (absDetune <= 100 + forgiveness) return Math.round(100 + forgiveness - absDetune);

  return 0;
};

const Singing = (): ReactElement => {
  const [playNote, repeatNote, playingNoteFinished, notes] = usePlayer();
  const [startPitchDetection, stopPitchDetection, singingData, progress, detune] = useDetectPitch();
  const [instructionsSeen, setInstructionsSeen] = useLocalStorage<boolean>(LOCAL_STORAGE_KEY, false);
  const {
    gameStatus,
    currentStep: numOfTonesPlayed,
    counter,
    points: currentPoints,
    totalPoints,
    startGame: startGameState,
    nextStep,
  } = useGameState({
    totalSteps: NUM_OF_NOTES_TO_PLAY,
    counterStartValue: COUNTER_START_VALUE,
    onCounterComplete: playNote,
  });

  useEffect(() => {
    document.title = "Singing | CheckYourPitch";
  }, []);

  const accuracyLabel = useMemo(
    () => (currentPoints ? getAccuracyLabel(currentPoints, singingData?.missType) : ""),
    [currentPoints, singingData]
  );

  useEffect(() => {
    if (singingData) {
      const newPoints = getPointsWon(singingData.detune);
      nextStep(newPoints);
    }
  }, [singingData, nextStep]);

  useEffect(() => {
    if (!notes) {
      return;
    }
    if (playingNoteFinished) {
      startPitchDetection(notes[0]);
    } else {
      stopPitchDetection();
    }
  }, [notes, playingNoteFinished]);

  const displayTotalPoints = useMemo(
    () => getTotalPoints(totalPoints, numOfTonesPlayed),
    [totalPoints, numOfTonesPlayed]
  );

  const startGame = () => {
    startGameState();
  };

  const closeInstructionsOverlay = () => {
    setInstructionsSeen(true);
  };

  if (gameStatus === GameStatus.Ended) {
    return (
      <PageWrapper>
        <GameEnd totalPoints={displayTotalPoints} onClick={startGame} withPercentage />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper withBackButton>
      <div className="singing">
        {!instructionsSeen ? (
          <div className="instructions-overlay">
            <p>To use this application, please enable microphone access.</p>
            <p>
              After you click &quot;Start&quot;, you&lsquo;ll hear a tone after 3 seconds. Your task is to repeat the
              tone by either singing or whistling. You will hear a total of five tones.
            </p>
            <button className="button button--secondary button--inverted" onClick={closeInstructionsOverlay}>
              Ok
            </button>
          </div>
        ) : null}
        <Header
          totalSteps={NUM_OF_NOTES_TO_PLAY}
          currentStep={numOfTonesPlayed + 1}
          counter={counter}
          points={currentPoints}
          accuracyLabel={accuracyLabel}
          totalPoints={displayTotalPoints}
          isNotePlayed={playingNoteFinished}
          onRepeatClick={repeatNote}
          onStartClick={startGame}
          gameStatus={gameStatus}
          isSingingMode
          withPercentage
        />
        <PitchVisualization
          detune={detune}
          shouldVisualize={counter === 0}
          progress={currentPoints !== null ? 100 : progress}
        />
      </div>
    </PageWrapper>
  );
};

export default Singing;
