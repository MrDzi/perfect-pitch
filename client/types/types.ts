export enum GameStatus {
  NotStarted,
  InProgress,
  Ended,
}

export interface User {
  id: string | null;
  name: string | null;
}

export enum HttpMethods {
  GET,
  POST,
}

export enum GameMode {
  SINGING = "singing",
  LISTENING = "listening",
  PITCHLE = "pitchle",
}
