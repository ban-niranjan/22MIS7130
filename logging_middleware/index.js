const express = require("express");
const Log = require("./logger");

const app = express();

app.get("/", async (req, res) => {
  await Log(
    "backend",
    "info",
    "route",
    "Root API accessed successfully"
  );

  res.send("Logging middleware working");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});