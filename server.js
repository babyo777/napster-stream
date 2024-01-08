const express = require("express");
const StreamAudio = require("ytdl-core");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.static("./"));

app.get("/", async (req, res) => {
  try {
    const Link = req.query.url;
    if (!Link) {
      res.status(400).json({ error: "url not provided" });
      return;
    }
    const SongId = StreamAudio.getVideoID(Link);

    if (fs.existsSync(`music/${SongId}.mp3`)) {
      SendStream(res, SongId);
      return
    } 
      const Download = StreamAudio(Link, {
        filter: "videoandaudio",
        quality: "highestvideo",
      }).pipe(fs.createWriteStream(`music/${SongId}.mp3`));
      Download.on("finish", () => {
        SendStream(res, SongId);
      });
      
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

function SendStream(res, Id) {
  try {
    const Data = fs.statSync(`music/${Id}.mp3`);
    const file = fs.createReadStream(`music/${Id}.mp3`);
  
    res.setHeader("content-type", "audio/mpeg");
    res.setHeader("content-length", Data.size);
     res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Disposition", `attachment; filename="${Id}.mp3"`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Connection", "keep-alive");
    
    console.log("streaming");
    
    file.pipe(res);
    
    file.on('end', () => {
      console.log("Streaming complete.");
      res.end();
    });
    
    
  } catch (error) {
    console.log(error);
  }
 
}

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

module.exports = app;
