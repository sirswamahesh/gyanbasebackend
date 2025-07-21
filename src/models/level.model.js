const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
  title: String,
  description: String,
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
});

module.exports = mongoose.model("Level", levelSchema);
