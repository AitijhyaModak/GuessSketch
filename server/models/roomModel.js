import mongoose from "mongoose";
import { playerSchema } from "./playerModel";

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
  players: [playerSchema],
  scores: {
    type: Number,
    required: true,
  },
  players: {
    type: [playerSchema],
    required: true,
  },
});

export const Room = mongoose.model("Room", roomSchema);
