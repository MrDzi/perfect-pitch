const express = require("express");

const app = express();

app.get("/api/test", (req, res) => {
  res.send({
    test: "test!",
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
