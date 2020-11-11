const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, require: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  productId: {type: mongoose.Schema.Types.ObjectId, ref:"Products", required: true}
});

module.exports = mongoose.model("comments", commentSchema);
