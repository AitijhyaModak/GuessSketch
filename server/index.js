import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const PORT = 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(PORT, () => {
  console.log("listening on port: ", PORT);
});
