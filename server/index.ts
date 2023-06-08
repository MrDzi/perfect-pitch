import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";
import config from "./config";

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(config.mongoDbUrl);

const db = mongoose.connection;

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

type Note = typeof NOTES[number];

type Melody = {
  melody: Note[];
  dateKey: string;
};

const getRandomNote = (notes: readonly Note[], skip: Note | null): Note => {
  const index = Math.floor(Math.random() * notes.length);
  if (skip && notes[index] === skip) {
    return getRandomNote(notes, skip);
  }
  return notes[index];
};

const getRandomNotes = (count = 5): Note[] => {
  const randomNotes: Note[] = [];

  for (let i = 0; i < count; i++) {
    randomNotes.push(getRandomNote(NOTES, randomNotes[i - 1]));
  }
  return randomNotes;
};

const melodySchema = new Schema({
  melody: [String],
  dateKey: String,
});
const Melody = mongoose.model("Melody", melodySchema);

type MelodyResponse = {
  melody: string;
  dateKey: string;
};

db.on("error", () => {
  console.log("db conection error");
});
db.once("open", () => {
  console.log("db connection established");
});

const port = process.env.PORT || 3000;

type paramKeys = "gameMode";

type Params = { [key in paramKeys]: string };

let melodyFallback: MelodyResponse | null;

const encodeMelody = (melody: Note[]) => {
  const encoded = Buffer.from(JSON.stringify(melody), "utf8").toString("base64");
  // add one character at the beginning because I have friends who know JavaScript :) (I know there are smarter solutions but this was quick & easy)
  return `X${encoded}`;
};

const handleMissingMelody = async (res: Response<MelodyResponse>, dateKey: string) => {
  const newMelody = getRandomNotes();
  const data = {
    melody: encodeMelody(newMelody),
    dateKey,
  };
  melodyFallback = data;
  const melody = new Melody({
    melody: newMelody,
    dateKey,
  });
  try {
    await melody.save();

    res.send(data);
  } catch {
    // TODO
    res.send(data);
  }
};

app.get("/api/melody", async (req: Request<Params>, res: Response<MelodyResponse>) => {
  const currentDate = new Date();
  const date = ("0" + currentDate.getDate()).slice(-2);
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const year = currentDate.getFullYear();

  const dateKey = `${date}/${month}/${year}`;

  console.log("Date: ", dateKey);

  try {
    const data = await Melody.find({ dateKey }).exec();

    if (data.length) {
      console.log("Found the melody in DB for ", dateKey, "melody: ", data[0].melody);
      return res.send({
        melody: encodeMelody(data[0].melody as Note[]),
        dateKey,
      });
    } else if (melodyFallback && melodyFallback.dateKey === dateKey) {
      console.log("Sending melody fallback for ", dateKey, "melody: ", melodyFallback.melody);
      return res.send(melodyFallback);
    }
    return handleMissingMelody(res, dateKey);
  } catch {
    return handleMissingMelody(res, dateKey);
  }
});

app.get("/api/health", (_, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });
