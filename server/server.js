const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();

// Enable CORS to allow frontend to connect
app.use(
  cors({
    origin: "https://collabrative-board-frontend.vercel.app", // your frontend Vercel URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://collabrative-board-frontend.vercel.app", // your frontend Vercel URL
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io", // Explicitly set the path if it's needed
});

// Your application logic here
let textData = "";
let drawingData = [];

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  // Send current state
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
