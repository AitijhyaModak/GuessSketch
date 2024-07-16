import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import mongoose from "mongoose";
import "dotenv/config";
import { Room, roomSchema } from "./models/roomModel.js";
import { Player } from "./models/playerModel.js";
import { getWord } from "./words/words.js";

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

  socket.on("create-room", async (formData) => {
    try {
      const roomExists = await Room.findOne({ name: formData.roomName });

      if (roomExists) {
        socket.emit("error", "room already exists");
        return;
      }

      let room = new Room();
      let player = new Player();

      player.socketId = socket.id;
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

      socket.emit("success-created-room", room);
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

      if (room.totalPlayers === room.players.length || room.gameStarted) {
        socket.emit("error", "room has reached full capacity");
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

      socket.emit("success-joined-room", room);

      socket.to(room.name).emit("update-player-joined", {
        roomData: room,
        notif: {
          type: "join-notif",
          message: `${formData.playerName} has joined the room`,
        },
      });

      if (room.players.length === room.totalPlayers) {
        room.turnIndex = 0;
        room.gameStarted = true;
        room.currentRound = 1;
        room.guessed = [];
        for (let i = 1; i <= room.totalPlayers; i++) room.guessed.push(false);
        room.currentWord = getWord();

        await room.save();

        socket.nsp.to(room.name).emit("update-start-game", {
          roomData: room,
          notif1: { message: "game has started", type: "imp-notif" },
          notif2: {
            messgae: `${room.players[0]} is guessing`,
            type: "imp-notif",
          },
        });
      }
    } catch (err) {
      console.log(err);
      socket.emit("error", "some internal error occured");
    }
  });

  socket.on("notif", (data) => {
    socket.to(data.roomName).emit("notif", {
      message: data.message,
      senderName: data.username,
      type: data.type,
    });
  });

  socket.on("start-drawing", (data) => {
    socket.to(data.roomName).emit("start-drawing", data);
  });

  socket.on("draw", (data) => {
    socket.to(data.roomName).emit("draw", data);
  });

  socket.on("stop-drawing", (data) => {
    socket.to(data.roomName).emit("stop-drawing", data);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("listening on port: ", PORT);
});
