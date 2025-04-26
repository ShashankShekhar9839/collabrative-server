const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Enable CORS for frontend (Vercel URL)
app.use(
  cors({
    origin: "https://collabrative-board-frontend.vercel.app", // your frontend Vercel URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://collabrative-board-frontend.vercel.app", // your frontend Vercel URL
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io", // Explicitly set the path
});

let drawingData = [];
let textData = "";

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  // Send current drawing and text state to the new user
  socket.emit("init-drawing", drawingData);
  socket.emit("init-text", textData);

  // Listen for drawing updates and broadcast them
  socket.on("drawing-update", (newDrawingData) => {
    drawingData.push(newDrawingData); // Save the new drawing data
    socket.broadcast.emit("drawing-update", newDrawingData); // Broadcast to other users
  });

  // Listen for text updates and broadcast them
  socket.on("text-update", (newText) => {
    textData = newText; // Update text data
    socket.broadcast.emit("text-update", newText); // Broadcast to other users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5173;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
