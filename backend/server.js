import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.get("/", (req, res) => res.send("SmartInk Backend Running!"));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data); // Send drawing data to all users except sender
  });

  socket.on("disconnect", () => console.log(`User disconnected: ${socket.id}`));
});

server.listen(5000, () => console.log("Server running on port 5000"));
