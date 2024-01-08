const express = require("express");
const StreamAudio = require("ytdl-core");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.static("./"));

app.get("/", async (req, res) => {
  const Link = req.query.url;
  if (Link) {
    try {
      const id = StreamAudio.getVideoID(`https://www.youtube.com/watch?v=${Link}`)

      const Download = StreamAudio(Link, {
        filter: "videoandaudio",
        quality: "highestvideo",
      }).pipe(res)

      
    } catch (error) {
      res.json(error.message)
    }
  } else {
    res.status(404).json("url not provided");
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

module.exports = app;
