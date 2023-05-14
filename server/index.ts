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

db.on("error", () => {
  console.log("db conection error");
});
db.once("open", () => {
  console.log("db connection established");
});

const port = process.env.PORT || 3000;

type paramKeys = "gameMode";

type Params = { [key in paramKeys]: string };

let melodyFallback: Melody | null;

const handleMissingMelody = async (res: Response<Melody>, dateKey: string) => {
  const newMelody = getRandomNotes();
  const data = {
    melody: newMelody,
    dateKey,
  };
  melodyFallback = data;
  const melody = new Melody(data);
  try {
    await melody.save();

    res.send(data);
  } catch {
    // TODO
    console.log("SENDING NEW DATA FROM CATCH", data);
    res.send(data);
  }
};

app.get("/api/melody", async (req: Request<Params>, res: Response<Melody>) => {
  const currentDate = new Date();
  const date = ("0" + currentDate.getDate()).slice(-2);
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const year = currentDate.getFullYear();

  const dateKey = `${date}/${month}/${year}`;

  try {
    const data = await Melody.find({ dateKey }).exec();

    if (data.length) {
      return res.send({
        melody: data[0].melody as Note[],
        dateKey,
      });
    } else if (melodyFallback && melodyFallback.dateKey === dateKey) {
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
