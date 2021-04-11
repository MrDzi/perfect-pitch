import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";
import config from "./config";

const app = express();
app.use(bodyParser.json());
app.use(cors());

console.log(config.mongoDbUrl);

mongoose.connect(config.mongoDbUrl, { useNewUrlParser: true });

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
const Score = mongoose.model("Score", scoreSchema);

db.on("error", () => {
  console.log("db conection error");
});
db.once("open", () => {
  console.log("db connection established");
});

const port = process.env.PORT || 3000;

app.post("/api/scores", (req, res) => {
  console.log("/api/scores", req.body);
  const score = new Score(req.body);
  console.log(score);
  score.save((err, score) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    console.log("!", score);
    res.send(score);
  });
});

app.get("/api/scores", (req, res) => {
  Score.find((err, scores) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(scores);
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
