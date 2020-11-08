const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: String, required: true, default: false },
    resetLink: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
