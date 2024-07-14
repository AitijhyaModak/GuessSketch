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
});

export const Player = mongoose.model("Player", playerSchema);
