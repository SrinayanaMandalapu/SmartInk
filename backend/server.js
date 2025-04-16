import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.get("/", (req, res) => res.send("SmartInk Backend Running!"));

// Store the drawing data in memory
let drawingData = []; // This will hold all the drawing data

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send the existing drawing data to the new client
  socket.emit("existing-drawings", drawingData);

  // Draw event: Add new drawing data and broadcast to others
  socket.on("draw", (data) => {
    drawingData.push(data); // Store the drawing data
    socket.broadcast.emit("draw", data); // Broadcast to all other clients
  });

  // Clear event: Clear drawings and reset the data
  socket.on("clear", () => {
    drawingData = []; // Clear stored drawing data
    socket.broadcast.emit("clear"); // Broadcast clear event to all clients
  });

  // Text change event
  socket.on("text-changed", (data) => {
    socket.broadcast.emit("text-changed", data); // Broadcast text change
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
