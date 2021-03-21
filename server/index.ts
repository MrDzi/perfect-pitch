import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/api/test", (req, res) => {
  res.send({
    test: "test!",
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
