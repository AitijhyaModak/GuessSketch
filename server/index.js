import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
import "dotenv/config";
import { Room } from "./models/roomModel.js";
import { Player } from "./models/playerModel.js";

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

  socket.on("create-room", async (senderSocketId, formData) => {
    try {
      const roomExists = await Room.findOne({ name: formData.roomName });

      if (roomExists) {
        socket.emit("error", "room already exists");
        return;
      }

      let room = new Room();
      let player = new Player();

      player.socketId = senderSocketId;
      player.username = formData.playerName;
      player.isCreator = true;
      player.score = 0;

      room.name = formData.roomName;
      room.password = formData.password;
      room.totalPlayers = formData.totalPlayers;
      room.rounds = formData.rounds;
      room.gameStarted = false;
      room.players.push(player);

      await room.save();
      await socket.join(room.name);

      socket.emit("success", room);
    } catch (err) {
      console.log(err);
      socket.emit("error", "some internal error occured");
    }
  });

  socket.on("join-room", async (formData) => {
    try {
      const room = await Room.findOne({ name: formData.roomName });
      if (!room) {
        socket.emit("error", "room does not exists");
        return;
      }

      if (room.password !== formData.password) {
        socket.emit("error", "wrong password");
        return;
      }

      let player = new Player();
      player.username = formData.playerName;
      player.socketId = socket.id;
      player.isCreator = false;
      player.score = false;

      room.players.push(player);
      await room.save();

      await socket.join(room.name);

      socket.emit("success", room);
      socket.to(room.name).emit("update", {
        roomData: room,
        notif: { message: `${formData.playerName} has joined the room` },
      });
    } catch (err) {
      console.log(err);
      socket.emit("error", "some internal error occured");
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("listening on port: ", PORT);
});
