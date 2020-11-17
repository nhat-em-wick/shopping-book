const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  access_token: { type: String, require: true },
  refresh_token: {type: String, require: true},
  expires: {
    type: Date,
    default: Date.now(),
    index: { expires: '2d' }
  }
})

module.exports = mongoose.model("tokens", tokenSchema);
