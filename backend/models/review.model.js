const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  content: { type: String, require: true },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
},{ timestamps: true });

module.exports = mongoose.model("reviews", reviewSchema);