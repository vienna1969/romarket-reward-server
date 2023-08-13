//const { Schema, model, models } = require("mongoose");
//require("dotenv").config();

//const mongoose = require("mongoose");

import "../../loadEnvironment.mjs";


import mongoose from "mongoose";

const { Schema, model, models } = mongoose;


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });


const HorsesModel =
  models.Horses ||
  model(
    "Horses",
    new Schema({
      horse1: String,
      horse2: String,
      horse3: String,
      horse4: String,
      horse5: String,
      nft1: Object,
      nft2: Object,
      nft3: Object,
      nft4: Object,
      nft5: Object,
      media1: Object,
      media2: Object,
      media3: Object,
      media4: Object,
      media5: Object,
      inputs: Object,

    })
  );

module.exports = HorsesModel;
