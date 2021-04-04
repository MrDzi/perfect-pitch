import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";

const app = express();
app.use(cors());

mongoose.connect(
  "mongodb+srv://perfect_pitch_user:HitThatTone@cluster0.pupdp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const db = mongoose.connection;

const scoreSchema = new Schema({
  name: {
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

app.get("/api/test", (req, res) => {
  const score = new Score({
    name: "Test",
    date: Date.now(),
    score: 230,
  });
  console.log("score created", score);
  res.send({
    test: JSON.stringify(score),
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
