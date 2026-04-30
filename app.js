import express from "express";

import { PORT } from "./config/env.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to the SubTrack API!");
});

app.listen(PORT, () => {
  console.log(`SubTrack API is running on http://localhost:${PORT}`);
});

export default app;
