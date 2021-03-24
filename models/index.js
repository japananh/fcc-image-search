const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const historySchema = mongoose.Schema(
  {
    term: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      required: true,
      default: 1,
    },
    per_page: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
historySchema.plugin(toJSON);

/**
 * @typedef History
 */
const History = mongoose.model("History", historySchema);

module.exports = History;
