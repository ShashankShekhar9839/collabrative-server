const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors"); // <-- IMPORT cors

const app = express();
app.use(
  cors({
    origin: "https://collabrative-board-frontend.vercel.app", // <-- your frontend vercel URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://collabrative-board-frontend.vercel.app", // <-- same here
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let textData = "";
let drawingData = [];

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.emit("init", { text: textData, drawing: drawingData });

  socket.on("text-update", (text) => {
    textData = text;
    socket.broadcast.emit("text-update", text);
  });

  socket.on("drawing-update", (draw) => {
    drawingData.push(draw);
    socket.broadcast.emit("drawing-update", draw);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
