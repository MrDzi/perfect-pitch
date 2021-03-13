import express from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get("/api/test", (req, res) => {
  res.send({
    test: "test!",
  });
});

app.listen(port, () => {
  console.log("listening on port 3000");
});
