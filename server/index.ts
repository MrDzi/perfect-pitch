import express, { application, Request } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";
import config from "./config";

const app = express();
app.use(bodyParser.json());
app.use(cors());

export type GameMode = "singing" | "listening" | "pitchle";

mongoose.connect(config.mongoDbUrl);

const db = mongoose.connection;

const scoreSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: Date,
});
const SingingScore = mongoose.model("Score", scoreSchema);
const ListeningScore = mongoose.model("Score", scoreSchema);
const PitchleScore = mongoose.model("Score", scoreSchema);

db.on("error", () => {
  console.log("db conection error");
});
db.once("open", () => {
  console.log("db connection established");
});

const port = process.env.PORT || 3000;

type paramKeys = "gameMode";

type Params = { [key in paramKeys]: string };

app.post("/api/scores", (req: Request<Params>, res) => {
  console.log("/api/scores", req.body);
  let score;
  switch (req.query.gameMode) {
    case "singing":
      score = new SingingScore(req.body);
    case "listening":
      score = new ListeningScore(req.body);
    case "pitchle":
      score = new PitchleScore(req.body);
  }
  score.save((err: any, score: any) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error with writing to database");
    }
    console.log("!", score);
    res.send(score);
  });
});

app.get("/api/scores", (req: Request<Params>, res) => {
  let score;
  switch (req.query.gameMode) {
    case "singing":
      score = SingingScore;
    case "listening":
      score = ListeningScore;
    case "pitchle":
      score = PitchleScore;
    default:
      score = SingingScore;
  }
  score.find((err, scores) => {
    if (err) {
      res.status(500).send("Error with reading from database");
    }
    res.send(scores);
  });
});

app.get("/api/health", (_, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
