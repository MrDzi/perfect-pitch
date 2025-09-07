import * as React from "react";
import { useState, useMemo, memo } from "react";
import cx from "classnames";
import { Note } from "../../../constants";
import "../pitchle.scss";
import { GameStatus } from "../../../types/types";

const PITCHLE_LENGTH = 5;

export enum InputStatus {
  GUESSED,
  GUESSED_NO_POSITION,
  MISSED,
}

export const getResults = (values: Note[], solution: Note[]): InputStatus[] => {
  const solutionHelperArray: Array<Note | null> = [...solution];
  const noteFrequencyMap = solution.reduce((acc: { [key in Note]: number }, v: Note) => {
    acc[v] = acc[v] ? acc[v] + 1 : 1;
    return acc;
  }, {} as { [key in Note]: number });

  return values.map((v, i) => {
    if (v === solutionHelperArray[i]) {
      noteFrequencyMap[v]--;
      solutionHelperArray[i] = null;
      return InputStatus.GUESSED;
    } else {
      const foundIndex = solutionHelperArray.indexOf(v);
      if (foundIndex > -1) {
        if (values[foundIndex] !== solutionHelperArray[foundIndex] && noteFrequencyMap[v]) {
          noteFrequencyMap[values[i]]--;
          return InputStatus.GUESSED_NO_POSITION;
        }
      }
      return InputStatus.MISSED;
    }
  });
};

interface GameStepProps {
  solution: Note[];
  values: Note[];
  submitted: boolean;
  gameStatus: GameStatus;
}

const GameStep = memo(({ solution, values, submitted, gameStatus }: GameStepProps): JSX.Element => {
  const solutionRef = React.useRef<Array<Note | null>>();
  const [results, setResults] = useState<InputStatus[]>([]);

  const shouldShowResults = useMemo(() => submitted || gameStatus === GameStatus.Ended, [submitted, gameStatus]);

  React.useEffect(() => {
    solutionRef.current = solution;
    if (shouldShowResults) {
      const res = getResults(values, solution);
      setResults(res);
    }
  }, [solution, shouldShowResults, values]);

  const inputFields = useMemo(() => {
    return [...Array(PITCHLE_LENGTH)].map((_, i) => {
      const value = values[i] || "";
      return (
        <div className="text-input-wrapper" key={`game-step-input-${i}`}>
          <div
            className={cx("text-input-wrapper_inner", {
              ["text-input-wrapper_inner--is-submitted"]: shouldShowResults,
            })}
          >
            <div className="text-input-wrapper_front">
              <div
                className={cx("text-input", "flex", "flex-center", {
                  ["text-input--filled"]: value[0],
                })}
              >
                <div className="note">
                  <span>{value[0]}</span>
                  <span>{value[1]}</span>
                </div>
              </div>
            </div>
            <div
              className={cx("text-input-wrapper_back flex flex-center", {
                ["text-input-wrapper_back--green"]: results[i] === InputStatus.GUESSED,
                ["text-input-wrapper_back--yellow"]: results[i] === InputStatus.GUESSED_NO_POSITION,
              })}
            >
              <div className="note">
                <span>{value[0]}</span>
                <span>{value[1]}</span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [values, results, shouldShowResults, gameStatus]);

  return (
    <div
      className={cx("game-step", {
        "game-step--small": gameStatus === GameStatus.Ended,
      })}
    >
      {inputFields}
    </div>
  );
});

GameStep.displayName = "GameStep";

export default GameStep;
