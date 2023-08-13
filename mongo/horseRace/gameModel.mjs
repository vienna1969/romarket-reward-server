import "../../loadEnvironment.mjs";

import mongoose from "mongoose";


///const { Schema, model, models } = require("mongoose");
///const mongoose = require("mongoose");


const { Schema, model, models } = mongoose;



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const HorseGameSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
});

const HorseGame = models.HorseRace || model("HorseRace", HorseGameSchema);

////module.exports = HorseGame;


export default HorseGame;
