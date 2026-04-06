const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello Docker Compose");
});

app.listen(3000, () => {
  console.log("Server running");
});
