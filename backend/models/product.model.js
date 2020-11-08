const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, default: 0, required: true },
    image: { type: String, required: true },
    description:{type: String},
    status:{ type: String, required: true,default: 'con'},
    totalQty: { type: Number, default: 1, required: true },
    category:{ type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
