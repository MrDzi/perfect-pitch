import * as React from "react";
import { useState } from "react";
import cx from "classnames";
import { Note } from "../../../constants";

const PITCHLE_LENGTH = 5;

enum InputStatus {
  GUESSED,
  GUESSED_NO_POSITION,
  MISSED,
}

const getResults = (values: Note[], solution: Note[]): InputStatus[] => {
  const sol: Array<Note | null> = [...solution];
  const map = solution.reduce((acc: { [key in Note]: number }, v: Note) => {
    acc[v] = acc[v] ? acc[v] + 1 : 1;
    return acc;
  }, {} as { [key in Note]: number });

  return values.map((v, i) => {
    if (v === sol[i]) {
      map[v]--;
      return InputStatus.GUESSED;
    } else {
      const foundIndex = sol.indexOf(v);
      if (foundIndex > -1) {
        if (values[foundIndex] !== sol[foundIndex] && map[values[i]]) {
          map[values[i]]--;
          return InputStatus.GUESSED_NO_POSITION;
        }
      }
      return InputStatus.MISSED;
    }
  });
};

const GameStep = ({
  solution,
  values,
  submitted,
}: {
  solution: Note[];
  values: Note[];
  submitted: boolean;
}): JSX.Element => {
  const solutionRef = React.useRef<Array<Note | null>>();
  const [results, setResults] = useState<InputStatus[]>([]);

  React.useEffect(() => {
    solutionRef.current = solution;
  }, [solution]);

  React.useEffect(() => {
    if (submitted) {
      const res = getResults(values, solution);
      setResults(res);
    }
  }, [submitted]);

  const renderInputFields = () => {
    return [...Array(PITCHLE_LENGTH)].map((_, i) => {
      const value = values[i] || "";
      return (
        <div className="text-input-wrapper" key={`game-step-input-${i}`}>
          <div
            className={cx("text-input-wrapper_inner", {
              ["text-input-wrapper_inner--is-submitted"]: submitted,
            })}
          >
            <div className="text-input-wrapper_front">
              <div className="text-input">{value}</div>
            </div>
            <div
              className={cx("text-input-wrapper_back", {
                ["text-input-wrapper_back--green"]: results[i] === InputStatus.GUESSED,
                ["text-input-wrapper_back--yellow"]: results[i] === InputStatus.GUESSED_NO_POSITION,
              })}
            >
              {value}
            </div>
          </div>
        </div>
      );
    });
  };

  return <div className="game-step flex flex-center justify-space-between">{renderInputFields()}</div>;
};

export default GameStep;