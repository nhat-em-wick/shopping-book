const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  access_token: { type: String, require: true },
  refresh_token: {type: String, require: true},
  expireAt: {type: Date, default: Date.now(), index: { expires: '5h' }} 
})
module.exports = mongoose.model("tokens", tokenSchema);
