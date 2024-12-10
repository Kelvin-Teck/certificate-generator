const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ["volunteer", "participant", "speaker"],
  },
  certificateUrl: { type: String, required: false, default: "" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;