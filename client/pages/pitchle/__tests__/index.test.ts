import { Note } from "../../../constants";
import { getResults } from "../game-step";

jest.mock("../pitchle.scss", () => {
  return {};
});

describe("Pitchle helpers", () => {
  it("should getResults", () => {
    const current: Note[] = ["A#", "C#", "F", "G", "A#"];
    const solution: Note[] = ["A#", "C#", "F#", "A#", "B"];

    const results = getResults(current, solution);

    expect(results).toEqual([0, 0, 2, 2, 1]);
  });
  it("should getResults 2", () => {
    const current: Note[] = ["A#", "F#", "F#", "G", "A#"];
    const solution: Note[] = ["A#", "C#", "F#", "A#", "B"];

    const results = getResults(current, solution);

    expect(results).toEqual([0, 2, 0, 2, 1]);
  });
});
