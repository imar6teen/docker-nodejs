require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h2>Hi Aimars</h2>");
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
