import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send({ body: "Welcome to the SubTrack API" });
});

app.listen({
  port: 3000,
  hostname: () => {
    console.log("SubTrack API is running on http://localhost:3000");
  },
});

export default app;
