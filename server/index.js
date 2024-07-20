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
      player.guessed = false;

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
      player.guessed = false;

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

        socket.nsp.to(room.name).emit("update-start-game", { roomData: room });

        socket.nsp
          .to(room.name)
          .emit("notif", { message: "game has started", type: "imp-notif" });

        socket.nsp.to(room.name).emit("notif", {
          message: `${room.players[0].username} is drawing`,
          type: "imp-notif",
        });
      }
    } catch (err) {
      console.log(err);
      socket.emit("error", "some internal error occured");
    }
  });

  socket.on("guess", async (data) => {
    const room = await Room.findOne({ name: data.roomName });
    const index = room.players.findIndex(
      (player) => player.socketId === socket.id
    );
    if (!room.players[index].guessed) {
      room.totalGuesses = room.totalGuesses + 1;
      room.players[index].guessed = true;
      room.players[room.turnIndex].score =
        room.players[room.turnIndex].score + 18;
      room.players[index].score = room.players[index].score + data.addScore;
      socket.nsp.to(room.name).emit("guess-score-update", { roomData: room });
      await room.save();
      socket.to(room.name).emit("notif", {
        message: `${room.players[index].username} guessed the word !`,
        type: "guess-notif",
      });

      if (room.totalGuesses === room.players.length - 1) nextTurn(data, socket);
    }
    return;
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

  socket.on("brush-change", (data) => {
    socket.to(data.roomName).emit("brush-change", data);
  });

  socket.on("clear-canvas", (data) => {
    socket.to(data.roomName).emit("clear-canvas", data);
  });

  socket.on("time-finish", async (data) => {
    socket.to(data.roomName).emit("notif", {
      message: `the word was ${data.word}`,
      type: "imp-notif",
    });
    nextTurn(data, socket);
  });

  socket.on("disconnecting", async () => {
    const rooms = Array.from(socket.rooms);
    if (rooms.length === 1) return;
    const room = await Room.findOne({ name: rooms[1] });
    if (!room) return;

    if (room.players.length === 1) {
      await Room.deleteOne({ name: room.name });
      return;
    }

    if (!room.gameStarted) {
      const index = room.players.findIndex(
        (player) => player.socketId === socket.id
      );
      const player = room.players[index];
      room.players.splice(index, 1);
      await room.save();
      socket.to(room.name).emit("notif", {
        message: `${player.username} has left the room`,
        type: "leave-notif",
      });
      socket.to(room.name).emit("room-update", { roomData: room });
      return;
    }

    if (room.gameStarted) {
      const index = room.players.findIndex(
        (player) => player.socketId === socket.id
      );
      const player = room.players[index];

      if (room.players.length === 2) {
        room.players.splice(index, 1);
        socket.to(room.name).emit("end-game", { roomData: room });
        await Room.deleteOne({ name: room.name });
        return;
      }

      if (index === room.turnIndex) {
        //drawing
        room.players.splice(index, 1);
        await room.save();
        nextTurnWhenDrawerLeaves(room, socket);
        return;
      }
      //
      else {
        //not drawing
        room.players.splice(index, 1);
        await room.save();
        socket.to(room.name).emit("notif", {
          message: `${player.username} has left the room`,
          type: "leave-notif",
        });

        if (player.guessed) {
          room.totalGuesses = room.totalGuesses - 1;
          await room.save();
          socket.to(room.name).emit("room-update", { roomData: room });
        } else {
          if (room.totalGuesses === room.players.length - 1) {
            nextTurn({ roomName: room.name }, socket);
          } else socket.to(room.name).emit("room-update", { roomData: room });
          return;
        }
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });

  socket.on("leave-room", async (data) => {
    socket.leave(data.roomName);
    await Room.deleteOne({ name: data.roomName });
  });
});

server.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("listening on port: ", PORT);
});

async function nextTurn(data, socket) {
  console.log("next turn");
  const room = await Room.findOne({ name: data.roomName });
  if (room.turnIndex === room.players.length - 1) {
    if (room.currentRound === room.rounds) {
      socket.nsp.to(data.roomName).emit("end-game", { roomData: room });
      await Room.deleteOne({ name: data.roomName });
      return;
    }
    room.turnIndex = 0;
    room.currentRound = room.currentRound + 1;
  } else room.turnIndex = room.turnIndex + 1;
  room.currentWord = getWord();
  room.totalGuesses = 0;
  room.players.map((player) => (player.guessed = false));

  socket.nsp.to(data.roomName).emit("notif", {
    message: `${room.players[room.turnIndex].username} is drawing the word`,
    type: "imp-notif",
  });

  await room.save();
  socket.nsp.to(data.roomName).emit("update-nextturn", { roomData: room });
}

async function nextTurnWhenDrawerLeaves(room, socket) {
  if (room.turnIndex >= room.players.length) {
    if (room.currentRound === room.rounds) {
      socket.to(room.name).emit("end-game", { roomData: room });
      await Room.deleteOne({ name: room.name });
      return;
    }
    room.turnIndex = 0;
    room.currentRound = room.currentRound + 1;
  }
  room.currentWord = getWord();
  room.totalGuesses = 0;
  room.players.map((player) => (player.guessed = false));

  await room.save();
  socket.to(room.name).emit("notif", {
    message: `${room.players[room.turnIndex].username} is drawing the word`,
    type: "imp-notif",
  });
  socket.to(room.name).emit("update-nextturn", { roomData: room });
}
