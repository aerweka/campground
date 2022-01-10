const mongoose = require("mongoose");

const campsSchema = mongoose.Schema({
  alias: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["Baik", "Rusak"],
  },
  status: {
    type: String,
    enum: ["Kosong", "Terpesan", "Terisi"],
    default: "Kosong",
  },
  description: String,
});

module.exports = mongoose.model("Camps", campsSchema);
