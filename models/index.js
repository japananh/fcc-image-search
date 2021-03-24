const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

// TODO: define schema here
const sampleSchema = mongoose.Schema(
  {
    stock: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    ipLikedList: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
sampleSchema.plugin(toJSON);

/**
 * @typedef Library
 */
const Library = mongoose.model("Stock", sampleSchema);

module.exports = Library;
