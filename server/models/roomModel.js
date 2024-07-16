import mongoose from "mongoose";
import { playerSchema } from "./playerModel.js";

export const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gameStarted: {
    type: Boolean,
    required: true,
  },
  totalPlayers: {
    type: Number,
    required: true,
  },
  rounds: {
    type: Number,
    required: true,
  },
  players: [playerSchema],
  turnIndex: Number,
  currentRound: Number,
  guessed: [Boolean],
  currentWord: String,
});

export const Room = mongoose.model("Room", roomSchema);
