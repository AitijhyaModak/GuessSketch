import mongoose from "mongoose";

export const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  isCreator: {
    type: Boolean,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  guessed: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export const Player = mongoose.model("Player", playerSchema);
