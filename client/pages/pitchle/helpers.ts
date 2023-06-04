import { Note } from "../../constants";
import { getResults, InputStatus } from "./game-step";

const greySquare = "\u{2B1C}";
const yellowSqare = "\u{1F7E8}";
const greenSquare = "\u{1F7E9}";
const lineBreak = "\u{000A}";
const doubleLineBreak = "\u{000A}\u{000A}";

export const generateFinalMessage = (solution: Note[], input: { [key: number]: Note[] }, step: number): string => {
  let message = `I guessed the tones of this melody in ${step}/6 tries.${doubleLineBreak}`;

  for (let i = 0; i < Object.keys(input).length; i++) {
    const results = getResults(input[i], solution);
    for (let j = 0; j < results.length; j++) {
      switch (results[j]) {
        case InputStatus.GUESSED:
          message += greenSquare;
          break;
        case InputStatus.GUESSED_NO_POSITION:
          message += yellowSqare;
          break;
        case InputStatus.MISSED:
        default:
          message += greySquare;
      }
      if (j === results.length - 1) {
        message += lineBreak;
      }
    }
  }
  message += lineBreak;
  message += "Can you beat my score?";
  message += lineBreak;
  message += "https://checkyourpitch.com/";

  return message;
};

export const checkIfEqualArrays = <T>(arr1: T[], arr2: T[]): boolean => {
  const length = Math.max(arr1.length, arr2.length);
  let equalArrays = true;
  for (let i = 0; i < length; i++) {
    if (arr1[i] !== arr2[i]) {
      equalArrays = false;
    }
  }
  return equalArrays;
};
